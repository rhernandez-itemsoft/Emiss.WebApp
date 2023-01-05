import { AddressBookModel } from "./address-book-model";

export class UserModel {
    userId: number = 0;
    firstName: string = '';
    lastName: string = '';
    mLastName: string = '';
    
    enabled: boolean = false;
}


export class UserFilter {
    fullName: string = '';
    enabled: boolean | string = true;
}