import cloneDeep from 'lodash.clonedeep';
import { Dictionary } from '../../models/dictionary.model';

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

export class ObjectUtilities {
    public static deepAccessUsingString = <T, K extends string>(obj: T, key: K) => {
        if (obj && key) {
            return key.split('.').reduce((nestedObject: any, key: string) => {
                if (nestedObject && key in nestedObject) {
                    return nestedObject[key];
                };
                return undefined;
            }, obj);
        };
        return null;
    };

    /**
     * Returns a deep copy of provided value. 
     * @param {T} value - The value to recursively clone.
     */
    public static deepCopy = <T>(value: T): T => cloneDeep(value);

    /**
     * Check if two values are deeply equivalent
     * @param a 
     * @param b 
     */
    public static equal(a: any, b: any): boolean {
        if (a === b) {
            return true;
        };

        if (a && b && typeof a == 'object' && typeof b == 'object') {
            var arrA = isArray(a);
            var arrB = isArray(b);
            var i;
            var length;
            var key;;

            if (arrA && arrB) {
                length = a.length;
                if (length != b.length) {
                    return false;
                };
                for (i = length; i-- !== 0;) {
                    if (!this.equal(a[i], b[i])) {
                        return false;
                    };
                };
                return true;
            };

            if (arrA != arrB) {
                return false;
            };

            var dateA = a instanceof Date;
            var dateB = b instanceof Date;

            if (dateA != dateB) {
                return false;
            };
            if (dateA && dateB) {
                return a.getTime() == b.getTime();
            };

            var regexpA = a instanceof RegExp;
            var regexpB = b instanceof RegExp;

            if (regexpA != regexpB) {
                return false;
            };
            if (regexpA && regexpB) {
                return a.toString() == b.toString();
            };

            var keys = keyList(a);
            length = keys.length;

            if (length !== keyList(b).length) {
                return false;
            };

            for (i = length; i-- !== 0;) {
                if (!hasProp.call(b, keys[i])) {
                    return false;
                };
            };

            for (i = length; i-- !== 0;) {
                key = keys[i];
                if (!this.equal(a[key], b[key])) {
                    return false;
                };
            };

            return true;
        };

        return a !== a && b !== b;
    };

    public static forEach<T>(dictionary: Dictionary<T>, callback: (item: T, key?: string) => void): void {
        for (var key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                callback(dictionary[key]!, key);
            };
        };
    };

    /**
    * Returns a boolean after checking empty object. 
    * @param {T} value - The value to check.
    */
    public static isEmpty<T extends Object>(value: T): Boolean {
        return Object.values(value).every(x => x === null || x === '');
    };
};