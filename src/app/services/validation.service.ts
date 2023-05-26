import { Injectable } from "@angular/core";
import { AbstractControl, NgModel } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class ValidationService {
    public constructor() { }

    public getValidationMessage(control: AbstractControl | NgModel, controlKey?: string): { message: string, labelText: string; } | null {
        const message: { labelText: string; message: string; } = {
            labelText: controlKey || '',
            message: ''
        };
        for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
                if (key === 'ngbDate') {
                    message.message += `Date "${control.errors[key].invalid}" is invalid. Please try again. `;
                };
                if (key === 'email') {
                    message.message += 'Please enter a valid email address. ';
                };
                if (key === 'max') {
                    message.message += `Please enter a value smaller than or equal to ${control.errors[key].max}. `;
                };
                if (key === 'maxlength') {
                    message.message += `Must be less than ${control.errors[key].requiredLength} characters. `;
                };
                if (key === 'min') {
                    message.message += `Please enter a value greater than or equal to ${control.errors[key].min}. `;
                };
                if (key === 'minlength') {
                    message.message += `Please enter at least ${control.errors[key].requiredLength} characters. `;
                };
                if (key === 'typeofObject') {
                    message.message += 'Invalid Format';
                };
                if (key === 'pattern') {
                    message.message += 'Please match the requested format. ';
                };
                if (key === 'required') {
                    message.message += 'Please enter a value. ';
                };
                if (key === 'matchField') {
                    message.message += `Must match ${control.errors[key].field} field. `;
                };
                if (key === 'timeRangeInvalid') {
                    message.message += `Please enter valid time range. `;
                };
                if (key === 'dateRangeInvalid') {
                    message.message += `Please enter valid date range. `;
                };
                if (key === 'dateTimeRangeInvalid') {
                    message.message += `Please enter valid date time range. `;
                };
            };
        };

        return message.message ? message : null;
    };
};