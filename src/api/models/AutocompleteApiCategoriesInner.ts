/* tslint:disable */
/* eslint-disable */
/**
 * Crypto Map API documentation
 * The Establishments map API is serves a list of establishments that accept crypto as a payment method.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface AutocompleteApiCategoriesInner
 */
export interface AutocompleteApiCategoriesInner {
    /**
     * 
     * @type {number}
     * @memberof AutocompleteApiCategoriesInner
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof AutocompleteApiCategoriesInner
     */
    label: string;
}

/**
 * Check if a given object implements the AutocompleteApiCategoriesInner interface.
 */
export function instanceOfAutocompleteApiCategoriesInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "label" in value;

    return isInstance;
}

export function AutocompleteApiCategoriesInnerFromJSON(json: any): AutocompleteApiCategoriesInner {
    return AutocompleteApiCategoriesInnerFromJSONTyped(json, false);
}

export function AutocompleteApiCategoriesInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): AutocompleteApiCategoriesInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'label': json['label'],
    };
}

export function AutocompleteApiCategoriesInnerToJSON(value?: AutocompleteApiCategoriesInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'label': value.label,
    };
}

