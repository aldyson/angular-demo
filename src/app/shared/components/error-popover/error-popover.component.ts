import { Component, AfterViewInit, TemplateRef, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Component({
    selector: 'error-popover',
    templateUrl: './error-popover.component.html'
})

export class ErrorPopoverComponent implements AfterViewInit {
    @ViewChild('errorPopover') private errorPopover!: TemplateRef<any>;

    public errorMessage: string | undefined;
    private template: Subject<TemplateRef<any>> = new Subject<TemplateRef<any>>();

    public ngAfterViewInit(): void {
        if (this.errorPopover) {
            this.template.next(this.errorPopover);
            this.template.complete();
        };
    };

    public getTemplateRef = (): Observable<TemplateRef<any>> => this.template.asObservable();
};