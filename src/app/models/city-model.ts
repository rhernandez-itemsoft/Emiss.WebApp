
export class CityModel {
    
    cityId: number = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';
    countryId?: number = 0;
    stateId?: number = 0;
    enabled: boolean = false;
}


export class CityFilter {
    cityId: number | null = 0;
    code: string = '';
    abbreviation: string = '';
    name: string = '';
    
    enabled: boolean | string = true;
    countryId?: number | null = 0;
    stateId?: number | null = 0;
}


