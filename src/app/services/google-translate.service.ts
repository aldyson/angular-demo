import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleQuery, LanguageOption, SavedTranslation, TranslateResponse } from '../models';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleTranslateService {
    protected readonly key = environment.googleTranslateKey;
    url = 'https://translation.googleapis.com/language/translate/v2?key=';

    static Languages: LanguageOption[] = [
        { lang: 'de', icon: 'de', languageName: 'German' },
        { lang: 'en', icon: 'gb', languageName: 'English' },
        { lang: 'fr', icon: 'fr', languageName: 'French' },
        { lang: 'it', icon: 'it', languageName: 'Italian' },
        { lang: 'es', icon: 'es', languageName: 'Spanish' },
        { lang: 'sv', icon: 'se', languageName: 'Swedish' }
    ];

    // This is only maintained in the service, so will be lost on page reload.
    // Doesn't use a database or localstorage to maintain data.
    savedTranslations: SavedTranslation[] = [];

    constructor(private http: HttpClient) { }

    translate(val: string, lang: string): Observable<string> {
        const query: GoogleQuery = { q: [val], target: lang, format: "text" };
        return this.http.post<TranslateResponse>(this.url + this.key, query).pipe(
            map(({ data }: TranslateResponse) => {
                return data.translations.length > 0 ? data.translations[0].translatedText : '';
            })
        );
    };
};