import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, of, switchMap, tap } from 'rxjs';
import { GoogleTranslateService } from './services';
import { TranslationResult, LanguageOption, SavedTranslation } from './models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    currentTranslation: TranslationResult = { input: '', translated: '' };
    selectedLanguage: LanguageOption = GoogleTranslateService.Languages[1];
    readonly languages: LanguageOption[] = GoogleTranslateService.Languages;

    // These could be defined in a service if other components needed to subscribe to these observables
    private language$: BehaviorSubject<LanguageOption> = new BehaviorSubject(this.selectedLanguage);
    private translate$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(public google: GoogleTranslateService) { }

    ngOnInit(): void {
        this.translate$.pipe(
            debounceTime(500),
            switchMap(() => this.currentTranslation.input.length ? this.google.translate(this.currentTranslation.input, this.selectedLanguage.lang) : of('')) // Translate the input 500ms after the last keypress
        ).subscribe({
            next: res => this.currentTranslation.translated = res,
            error: err => console.error(err)
        });

        this.language$.pipe(
            tap((lang: LanguageOption) => this.selectedLanguage = lang), // Apply the new selected language
            switchMap(async () => this.translate$.next(this.currentTranslation.input)) // Translate the input
        ).subscribe();
    };

    ngOnDestroy(): void {
        this.language$.unsubscribe();
        this.translate$.unsubscribe();
    };

    // Applies the saved translation without re-running the translation
    onApplySavedTranslation({ input, translated, language }: SavedTranslation): void {
        this.currentTranslation = { input, translated };
        this.selectedLanguage = language;
    };

    // Remove the saved translation from the list
    onRemoveSavedTranslation(index: number): void {
        this.google.savedTranslations.splice(index, 1);
    };

    // Add the translation input and result to a list
    onSaveTranslationResult() {
        this.google.savedTranslations.push({ ...this.currentTranslation, language: this.selectedLanguage });
        this.currentTranslation = { input: '', translated: '' };
    };

    // Called after clicking on a flag
    onSelectLanguage = (selected: LanguageOption): void => this.language$.next(selected);

    // Called after each keypress
    onTranslate = (): void => this.translate$.next(this.currentTranslation.input);
}