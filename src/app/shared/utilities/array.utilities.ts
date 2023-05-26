export class ArrayUtilities {
    public static deepAccessUsingString = <T>(obj: T, key: string): any => {
        if (obj && key) {
            return key.split('.').reduce((nestedObject: { [x: string]: any; }, key: string) => {
                if (nestedObject && key in nestedObject) {
                    return nestedObject[key];
                };
                return undefined;
            }, obj);
        };
        return null;
    };

    public static filterMultipleProperties<T>(array: T[], props: string[], string: string): T[] {
        let filtered = [];
        let filterString = string.toLowerCase();
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < props.length; j++) {
                let val = ArrayUtilities.deepAccessUsingString(array[i], props[j]);
                if ((val || val === 0) && val.toString().toLowerCase().indexOf(filterString) !== -1 || !filterString) {
                    filtered.push(array[i]);
                    break;
                };
            };
        };
        return filtered;
    };

    public static sortAlphabetically<T, K extends keyof T>(array: T[], prop: K) {
        return array.sort((a, b) => {
            const nameA = typeof a[prop] == 'string' ? String(a[prop]).toLowerCase() : a[prop];
            const nameB = typeof b[prop] == 'string' ? String(b[prop]).toLowerCase() : b[prop];
            if (nameA < nameB) {
                return -1;
            };
            if (nameA > nameB) {
                return 1;
            };
            return 0;
        });
    };

    public static sortByNumber(array: any[], prop?: string): any[] {
        if (array && array.length) {
            return array.sort((a, b) => prop ? b[prop] - a[prop] : b - a);
        };
        return [];
    };

    public static moveElementUp = <T>(array: T[], index: number): T[] => this.moveElement(array, index, true);

    public static moveElementDown = <T>(array: T[], index: number): T[] => this.moveElement(array, index, false);

    private static moveElement<T>(array: T[], index: number, up: boolean): T[] {
        return [
            ...array.slice(0, index - 1 + (up ? 0 : 1)),
            array[index + (up ? 0 : 1)],
            array[index - 1 + (up ? 0 : 1)],
            ...array.slice(index + 1 + (up ? 0 : 1)),
        ];
    };
};