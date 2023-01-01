export class StateModel {
    stateId: number = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';

    countryId?: number = 0;
    enabled: boolean = false;
}


export class StateFilter {
    stateId: number | null = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';
    enabled: boolean | string = true;
    countryId?: number | null = 0;
}
