export interface GoogleQuery {
    q: string[];
    target: string;
    format: "text";
}

export interface TranslateResponse {
    data: {
        translations: Array<{ translatedText: string, detectedSourceLanguage: string; }>;
    };
}

export type Language = 'de' | 'en' | 'es' | 'fr' | 'it' | 'sv';
export type LanguageOption = { lang: Language, icon: string, languageName: string; };
export type TranslationResult = { input: string; translated: string; };
export type SavedTranslation = TranslationResult & { language: LanguageOption; };