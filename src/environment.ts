// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


//*****************************************************************
// *******************     MANEJO DE LOGS   ***********************
//
///       https://www.codemag.com/article/1711021/Logging-in-Angular-Applications
//
//*****************************************************************
//*****************************************************************

export const environment = {
  production: false,

  img_profile_dumy: 'assets/images/dummy_user_min.png',


  getUlrApi(apiName: ApiName, endpointName: string): string {
    return apiName + endpointName;
  }
};

export enum ApiName {
  Default = 'https://localhost:7048/api/'
 
};

export enum EndpointName {
  User = 'User',
  City = 'City',
  Country = 'Country',
  State = 'State',
};