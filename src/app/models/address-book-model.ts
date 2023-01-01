import { CityModel } from "./city-model";
import { CountryModel } from "./country-model";
import { StateModel } from "./state-model";

export class AddressBookModel {
    addressId: number = 0;

    alias: string = '';

    phone: string = '';
    email: string = '';

    country: CountryModel | null = null;
    city: CityModel | null = null;
    state: StateModel | null = null;
    countryId: number | null = 0;
    stateId: number | null= 0;
    cityId: number | null= 0;

    street: string = '';
    subdivision: string = '';
    reference: string = '';

    zipCode: number = 0;

    enabled: boolean = false;

}
