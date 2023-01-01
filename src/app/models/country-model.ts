export class CountryModel {
    countryId: number = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';

    enabled: boolean = false;
}


export class CountryFilter {
    countryId: number | null = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';

    enabled: boolean | string = true;
}

