export class HttpResponseApi<T> {
    code:number=0;
    data!: T; 
    message:string='';
}