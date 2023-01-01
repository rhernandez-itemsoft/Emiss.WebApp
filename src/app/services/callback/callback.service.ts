import { Injectable } from '@angular/core';

//Este servicio nos permite utilizar autocompletado e impedir que se hagan n llamadas sino hasta que se termine de escribir (600 milisegundos entre presskey)
@Injectable({
  providedIn: 'root',
})
export class CallBackService {
  private static dropDownTimeOut: any;

  //filter state
  execute(context: any, callbackFunction: Function, defaultSeconds: number = 600): void {
    clearTimeout(CallBackService.dropDownTimeOut);
    CallBackService.dropDownTimeOut = setTimeout(
      callbackFunction.bind(context)
      , defaultSeconds);
  }
}
