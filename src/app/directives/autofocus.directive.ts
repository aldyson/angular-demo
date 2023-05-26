import { Directive, ElementRef } from '@angular/core';
import { timer, Subscription } from 'rxjs';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective {
    private subscription!: Subscription;
    public constructor(private element: ElementRef) { };

    public ngAfterContentInit(): void {
        this.focusElement();
    };

    public focusElement(): void {
        let interval = timer(50);
        this.subscription = interval.subscribe(() => {
            this.element.nativeElement.focus();
            if (document.activeElement === this.element.nativeElement) {
                this.subscription.unsubscribe();
            };
        });
    };
};