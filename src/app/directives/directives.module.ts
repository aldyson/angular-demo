import { NgModule } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';
import { ValidateDirective } from './validate.directive';

@NgModule({
    declarations: [
        AutofocusDirective,
        ValidateDirective
    ],
    exports: [
        AutofocusDirective,
        ValidateDirective
    ]
})
export class DirectivesModule { };