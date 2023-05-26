import {
    AfterContentInit,
    ApplicationRef,
    ChangeDetectorRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Injector,
    NgZone,
    OnDestroy,
    Renderer2,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { ErrorPopoverComponent } from '../shared/components/error-popover/error-popover.component';
import { NgModel, NgForm } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ValidationService } from '../services';

const errorPopoverConfig: any = {
    animation: true,
    autoClose: false,
    placement: ['top'],
    popperOptions: () => { },
    triggers: 'manual',
    container: 'body',
    disablePopover: false,
    popoverClass: 'error-popover',
    openDelay: 0,
    closeDelay: 0
};

@Directive({
    providers: [NgbPopover],
    selector: '[validateInput]'
})
export class ValidateDirective implements AfterContentInit, OnDestroy {
    @HostBinding('attr.ngbPopover') public ngbPopover = new NgbPopover(
        this.elementRef,
        this.renderer,
        this.injector,
        this.viewContainerRef,
        errorPopoverConfig,
        this.ngZone,
        document,
        this.changeDetectorRef,
        this.applicationRef
    );

    @HostListener('focus') private focus(): void {
        if (this.control && this.control.invalid && this.control.touched) {
            if (!this.isPopoverOpened) {
                this.openPopover();
            };
            if (!this.elementRef.nativeElement.classList.contains('has-error')) {
                this.renderer.addClass(this.elementRef.nativeElement, 'has-error');
            };
        };
    };

    @HostListener('blur') private onblur(): void {
        if (this.ngbPopover && this.isPopoverOpened) {
            this.isPopoverOpened = false;
            this.ngbPopover.close();
        };
        if (this.control && this.control.invalid && !this.elementRef.nativeElement.classList.contains('has-error')) {
            this.renderer.addClass(this.elementRef.nativeElement, 'has-error');
        };
    };

    private AfterContentInit = false;
    private controlStatusChangeSubscription!: Subscription;
    private isPopoverOpened: boolean = false;
    private ngSubmitSubscription!: Subscription;
    private errorPopoverComponentRef!: ComponentRef<ErrorPopoverComponent>;

    public constructor(
        private control: NgModel,
        private elementRef: ElementRef<HTMLInputElement>,
        private renderer: Renderer2,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private ngZone: NgZone,
        private validationService: ValidationService,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationRef: ApplicationRef
    ) { };

    public ngAfterContentInit(): void {
        this.control;
        this.controlStatusChangeSubscription = this.control.statusChanges!.subscribe((status: string | null) => {
            if (this.AfterContentInit && !this.control.disabled) {
                status = status ? status.toLowerCase() : 'valid';
                if (status === 'valid') {
                    if (this.elementRef.nativeElement.classList.contains('has-error')) {
                        this.renderer.removeClass(this.elementRef.nativeElement, 'has-error');
                    };
                    if (this.isPopoverOpened) {
                        this.ngbPopover.close();
                        this.isPopoverOpened = false;
                    };
                } else {
                    const validationMessage = this.validationService.getValidationMessage(this.control);
                    const errorMessage = validationMessage?.message;
                    if (this.errorPopoverComponentRef && this.errorPopoverComponentRef.instance && this.errorPopoverComponentRef.instance.errorMessage !== errorMessage) {
                        this.errorPopoverComponentRef.instance.errorMessage = errorMessage;
                    };
                    if (!this.elementRef.nativeElement.classList.contains('has-error')) {
                        this.renderer.addClass(this.elementRef.nativeElement, 'has-error');
                    };
                    !this.isPopoverOpened && this.openPopover();
                };
            };
            if (this.control.disabled) {
                if (this.elementRef.nativeElement.classList.contains('has-error')) {
                    this.renderer.removeClass(this.elementRef.nativeElement, 'has-error');
                };
                this.ngbPopover.close();
                this.isPopoverOpened = false;
            };
            this.AfterContentInit = true;
        });
        this.ngSubmitSubscription = (this.control.formDirective as NgForm).ngSubmit.subscribe(() => {
            if (this.control.invalid && !this.elementRef.nativeElement.classList.contains('has-error')) {
                this.renderer.addClass(this.elementRef.nativeElement, 'has-error');
            };
        });
    };

    public ngOnDestroy(): void {
        this.controlStatusChangeSubscription.unsubscribe();
        this.ngSubmitSubscription.unsubscribe();
        if (this.ngbPopover.isOpen()) {
            this.ngbPopover.close();
        };
        this.errorPopoverComponentRef?.destroy();
    };

    private openPopover(): void {
        const validationMessage = this.validationService.getValidationMessage(this.control);
        if (!this.errorPopoverComponentRef) {
            let factory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(ErrorPopoverComponent);
            this.errorPopoverComponentRef = this.viewContainerRef.createComponent(factory);
            this.errorPopoverComponentRef.instance.errorMessage = validationMessage?.message;
            this.errorPopoverComponentRef.instance.getTemplateRef().subscribe((template: TemplateRef<any>) => {
                if (template) {
                    this.isPopoverOpened = true;
                    this.ngbPopover.ngbPopover = template;
                    this.ngbPopover.open();
                };
            });
        } else {
            this.errorPopoverComponentRef.instance.errorMessage = validationMessage?.message;
            this.isPopoverOpened = true;
            this.ngbPopover.open();
        };
    };
};