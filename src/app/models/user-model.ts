import { AddressBookModel } from "./address-book-model";

export class UserModel {
    userId: number = 0;
    firstName: string = '';
    lastName: string = '';
    mLastName: string = '';
    // userName: string = '';
    // password: string = '';
    // rePassword: string = '';
    
    // workEmail: string = '';
    // groupId: number = 0;
    // group: GroupModel | null = null;
    addressBook: AddressBookModel | null = null;
    //  addressBook: AddressBookModel[]  = [];
    
    enabled: boolean = false;
}


export class UserFilter {
    userId: number | null = 0;
    groupId: number | null = 0;
    userName: string = '';
    workEmail: string = '';
    firstName: string = '';
    lastName: string = '';
    mLastName: string = '';
    enabled: boolean | string = true;
}