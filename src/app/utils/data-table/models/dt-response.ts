
export class DtResponse<T> {
    draw: number = 0; //validación de seguridad
    length: number = 0;
    first: number = 0;
    page: number = 0;
    pages: number = 0;
    recordsFiltered: number = 0;
    recordsTotal: number = 0;
    data: T  = [] as unknown as T;
}

