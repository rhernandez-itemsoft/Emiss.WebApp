
import { MenuItem, PrimeNGConfig, SelectItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { routes } from 'src/app/app-routing.module';
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';
import { ActionModel } from 'src/app/models/action-model';
import { EndpointFilter, EndpointModel } from 'src/app/models/endpoint-model';
import { createTranslateLoader } from 'src/app/modules/prime.module';
import { AccessService } from 'src/app/services/security/access/security.access.service';
import {
    EndpointService
} from 'src/app/services/security/endpoint/security-endpoint.service';
import { BreadcrumbService } from 'src/app/services/shared/breadcrumb/breadcrumb.service';
import {
    EndpointComponent, EndpointAddComponent, EndpointDeleteComponent,
    EndpointEditComponent, EndpointFilterComponent
} from 'src/app/views/security/endpoint/endpoint';
import { ApiName, EndpointName, environment as env } from 'src/environments/environment';

import { HTTP_INTERCEPTORS, HttpClient, } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { Base64 } from '../base64/base64';
import { DataTable } from './datatable';
import { DtRequest } from './models/dt-request';

//simula los datos de una fila
const totalRows = 33;
const rowMock = <EndpointModel>{
    endpointId: 1,
    name: EndpointName.Endpoint,
    description: 'Test',
    actions: <ActionModel[]>[
        <ActionModel>{
            actionId: 1,
            name: 'Create',
            description: 'Test1',
            enabled: false,
            selected: false,
        },
        <ActionModel>{
            actionId: 2,
            name: 'Read',
            description: 'Test2',
            enabled: false,
            selected: false,
        },
        <ActionModel>{
            actionId: 3,
            name: 'UPDATE',
            description: 'Test2',
            enabled: false,
            selected: false,
        },
        <ActionModel>{
            actionId: 4,
            name: 'DELETE',
            description: 'Test2',
            enabled: false,
            selected: false,
        },
        <ActionModel>{
            actionId: 5,
            name: 'EXPORT',
            description: 'Test2',
            enabled: false,
            selected: false,
        }
    ],
    enabled: true,
};

describe('DataTable', () => {
    let dlgService: DialogService;
    // let accessService: AccessService;
    let dtTable: DataTable<EndpointModel, EndpointFilter>;
    let client: HttpClient;
    let translate: TranslateService;
    let changeDetectorRef: ChangeDetectorRef;
    let fixture: ComponentFixture<EndpointComponent>;

    let controller: HttpTestingController;
    let allRowsMock: EndpointModel[];


    beforeEach(() => {
        // let mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
        // mockNgZone.run.and.callFake((f: any) => function () { });

        TestBed.configureTestingModule({
            teardown: { destroyAfterEach: false },
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                PaginatorModule,
                RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
            ],
            providers: [
                TranslateService,
                AccessService,
                DialogService,
                AccessService,
                BreadcrumbService,
                EndpointService,
                DynamicDialogRef,
                { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },

                Paginator,
                { provide: ChangeDetectorRef, useValue: {} },

            ],
            declarations: [
                EndpointComponent,
                EndpointAddComponent,
                EndpointEditComponent,
                EndpointDeleteComponent,
                EndpointFilterComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();

            spyOn(Base64, 'toFile').and.callFake(()=>{
                return ;
              });
              
        controller = TestBed.inject(HttpTestingController);
        // accessService = TestBed.inject(AccessService);

        client = TestBed.inject(HttpClient);
        dlgService = TestBed.inject(DialogService);
        translate = TestBed.inject(TranslateService);
        dtTable = new DataTable<EndpointModel, EndpointFilter>(
            dlgService, translate, 
            // accessService,
            EndpointAddComponent,
            EndpointEditComponent,
            EndpointDeleteComponent,
            EndpointFilterComponent,

            'endpointId',
            EndpointName.Endpoint
        );


        allRowsMock = getAllData();
        fixture = TestBed.createComponent(EndpointComponent);
        let app = fixture.componentInstance;

        let render: any;
        let config = new PrimeNGConfig();
        dtTable.dtCtxMenu = new ContextMenu(app.dtCtxMenu.el, render, app.dtCtxMenu.cd, app.dtCtxMenu.zone, app.dtCtxMenu.contextMenuService, config);
        dtTable.dtCtxMenuExport = new ContextMenu(app.dtCtxMenuExport.el, render, app.dtCtxMenuExport.cd, app.dtCtxMenuExport.zone, app.dtCtxMenuExport.contextMenuService, config);
        dtTable.allowUpdate = true;
        dtTable.allowDelete = true;
        dtTable.dtMenuItem = app.dtMenuItem;
        dtTable.dtMenuExportItem = app.dtMenuExportItem;
        dtTable.initContextMenu();
        dtTable.dtMenuItem[0].command!();
        dtTable.dtMenuItem[1].command!();
        dtTable.dtMenuItem[2].command!();

        dtTable.dtMenuExportItem[0].command!();
        dtTable.dtMenuExportItem[1].command!();
        dtTable.dtMenuExportItem[2].command!();
      

        changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
        dtTable.paginator = new Paginator(changeDetectorRef);

        dtTable.paginator.rowsPerPageOptions = [10, 20, 50, 100, 5000];
        dtTable.paginator.rows = 10;
        dtTable.paginator.onPageChange.subscribe((pager: any) => {
        
            /**
             * Page comienza en cero e indica el numero de la página
             * 
             */
            getDataPaginated(pager.rows, pager.page + 1);

        });

    });


    function getAllData(): EndpointModel[] {
        //llenamos data del responseDt
        let dataMock: EndpointModel[] = <EndpointModel[]>[];
        for (let i = 1; i <= totalRows; i++) {
            let newRow = Object.assign({}, rowMock);
            newRow.endpointId = i;

            newRow.name = newRow.name + i;
            dataMock.push(newRow);
        }

        return dataMock;
    }

    function changePage(page: number) {
        dtTable.paginator.changePage(page - 1);
    }

    function getDataPaginated(rows: number, page: number) {
        if (page == 0) {
            return;
        }
        const posInit = (rows * page) - rows;
        let dataMock: EndpointModel[] = <EndpointModel[]>[];
        dtTable.paginator.rowsPerPageItems = [];
        for (let i = posInit; i < (posInit + rows); i++) {


            if (allRowsMock[i] == undefined) {
                break;
            }
            dataMock.push(allRowsMock[i]);
            dtTable.paginator.rowsPerPageItems.push(<SelectItem>{
                label: allRowsMock[i].name,   //?: string;
                value: allRowsMock[i],   //: T;
                styleClass: '',   //?: string;
                icon: '',   //?: string;
                title: '',   //?: string;
                disabled: false    //?: boolean;
            });
        }

        const recordsTotal = dataMock.length;
        const recordsFiltered = allRowsMock.length;

        //establecemos los datos de paginacion inicial
        // dtTable.paginator = new Paginator(changeDetectorRef);
        dtTable.responseDt.data = dataMock;
        dtTable.responseDt.length = recordsTotal;
        dtTable.responseDt.page = page;
        dtTable.responseDt.pages = Math.ceil(recordsFiltered / 10);

        dtTable.responseDt.recordsFiltered = recordsFiltered;
        dtTable.responseDt.recordsTotal = recordsTotal;

        dtTable.paginator.totalRecords = recordsFiltered;

        dtTable.selectedRow = dtTable.responseDt.data[dtTable.defaultSelected];
    }


    it(' initContextMenu ', () => {

        let contextMenuItem = <MenuItem>{ label: translate.instant('i18n.btn.edit'), icon: 'fa pi-fw pi pi-pencil', command: () => { } };
        let contextMenuExportItem = <MenuItem>{ label: 'Excel', icon: 'pi pi-file-excel', command: () => { } };
        dtTable.allowUpdate = true;
        dtTable.allowDelete = true;
        dtTable.getI18n();
        expect(dtTable).toBeTruthy();
        expect(dtTable).toBeInstanceOf(Object);
        dtTable.setBreadcrumb();
        dtTable.initFormFilters();
        dtTable.clearFilter();
        dtTable.initDataTable();

        expect(dtTable.dtMenuItem.length).toBeGreaterThanOrEqual(3);
        expect(dtTable.dtMenuItem[1].label).toEqual(contextMenuItem.label);
        expect(dtTable.dtMenuExportItem[1].label).toEqual(contextMenuExportItem.label);
        // expect(dtTable.customFilter).toEqual(dataMock);
    });

    it('showDialogAdd ', () => {
        const responseMock = { data: 'Test' };
        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.new = translate.instant('i18n.security.endpoint.titleNew');

        // dtTable.onCloseAddDialog = (response: any) => {
        //     expect(response).toEqual(responseMock)
        // };

        let ref = dtTable.showDialogAdd(dlgCnf);
        expect(ref).not.toBeNull();
        ref.close(responseMock);


        dtTable.onCloseEditDialog(rowMock);
        dtTable.onCloseEditDialog(null);
    });



    it('showDialogEdit selectedRow = null', () => {

        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.new = translate.instant('i18n.security.endpoint.titleNew');

        dtTable.selectedRow = rowMock;
        let ref = dtTable.showDialogEdit(dlgCnf);
        expect(ref).toBeInstanceOf(Object);

        //si no ha seleccionado una fila entonces regresa null
        dtTable.selectedRow = null;
        let refNull = dtTable.showDialogEdit(dlgCnf);
        expect(refNull).toBeNull
    });

    it('showDialogEdit selectedRow != null SaveButton', () => {

        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.edit = translate.instant('i18n.security.endpoint.titleEdit');
        dtTable.selectedRow = rowMock;

        // // spyOn(dtTable, 'onCloseFilterDialog').and.callThrough();
        // dtTable.onCloseEditDialog = (response: EndpointModel) => {

        //     expect(response).toEqual(rowMock)
        // };


        let ref = dtTable.showDialogEdit(dlgCnf);
        expect(ref).not.toBeNull();
        ref?.close(rowMock);
        dtTable.onCloseEditDialog(rowMock);
        dtTable.onCloseEditDialog(null);
    });



    it('showDialogDelete selectedRow = null', () => {
        const responseMock = { data: 'Test' };
        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.new = translate.instant('i18n.security.endpoint.titleNew');

        dtTable.selectedRow = rowMock;
        let ref = dtTable.showDialogDelete(dlgCnf);
        expect(ref).toBeInstanceOf(Object);


        //si no ha seleccionado una fila entonces regresa null
        dtTable.selectedRow = null;
        let refNull = dtTable.showDialogDelete(dlgCnf);
        expect(refNull).toBeNull
    });

    it('showDialogDelete selectedRow != null', () => {
        const responseMock = { data: 'Test' };
        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.new = translate.instant('i18n.security.endpoint.titleNew');

        dtTable.onCloseEditDialog = (response: any) => {
            expect(response).toEqual(responseMock)
        };
        dtTable.selectedRow = <EndpointModel>{
            endpointId: 1,
            name: 'Test',
            description: 'Test',
            actions: <ActionModel[]>[<ActionModel>{
                actionId: 1,
                name: 'Test',
                description: 'Test',
                enabled: false,
                selected: false,
            }],
            enabled: true,
        };
        let ref = dtTable.showDialogDelete(dlgCnf);
        expect(ref).not.toBeNull();
        ref?.close(responseMock);


    });

    it('showDialogFilter ', () => {
        const responseMock = { data: 'Test' };
        let dlgCnf = { width: '80rem' };
        dtTable.dialogTitles.new = translate.instant('i18n.security.endpoint.titleNew');



        // dtTable.onCloseFilterDialog = (response: any) => {
        //     expect(response).toEqual(responseMock)
        // };

        let ref = dtTable.showDialogFilter(dlgCnf);

        expect(ref).not.toBeNull();
        ref.close(responseMock);


        dtTable.onCloseFilterDialog(<EndpointFilter>{});
        dtTable.onCloseFilterDialog(null);
    });

    it('exportToCsv ', () => {
        let dtRequestMock: DtRequest | any = new DtRequest();
        for (let key in dtTable.customFilter) {
            let value = (<any>dtTable.customFilter)[key];
            let isId = key.substring(key.length - 2, key.length).toUpperCase() == 'ID';
            if (typeof value == 'object' && value == null && isId) {
                continue;
            } else if (typeof value == 'boolean' && value == null) {
                continue;
            }
            (<any>dtRequestMock)[key] = (<any>dtTable.customFilter)[key];
        }
        dtTable.exportToCsv();
        dtRequestMock.allowPaging = false;
        expect(dtTable.newRequestDt).toEqual(dtRequestMock);
    });

    it('exportToXls ', () => {
        let dtRequestMock: DtRequest | any = new DtRequest();
        for (let key in dtTable.customFilter) {
            let value = (<any>dtTable.customFilter)[key];
            let isId = key.substring(key.length - 2, key.length).toUpperCase() == 'ID';
            if (typeof value == 'object' && value == null && isId) {
                continue;
            } else if (typeof value == 'boolean' && value == null) {
                continue;
            }
            (<any>dtRequestMock)[key] = (<any>dtTable.customFilter)[key];
        }
        dtTable.exportToXls();
        dtRequestMock.allowPaging = false;
        expect(dtTable.newRequestDt).toEqual(dtRequestMock);
    });

    it('exportToPdf ', () => {
        let dtRequestMock: DtRequest | any = new DtRequest();
        for (let key in dtTable.customFilter) {
            let value = (<any>dtTable.customFilter)[key];
            let isId = key.substring(key.length - 2, key.length).toUpperCase() == 'ID';
            if (typeof value == 'object' && value == null && isId) {
                continue;
            } else if (typeof value == 'boolean' && value == null) {
                continue;
            }
            (<any>dtRequestMock)[key] = (<any>dtTable.customFilter)[key];
        }
        dtTable.exportToPdf();
        dtRequestMock.allowPaging = false;
        expect(dtTable.newRequestDt).toEqual(dtRequestMock);
    });

    it('refreshData ', () => {
        let fn = spyOn(dtTable, 'refreshData').and.callThrough();
        dtTable.refreshData();
        expect(fn).toHaveBeenCalled();
    });

    it('closeDialogDetail ', () => {
        dtTable.closeDialogDetail(null);
        expect(dtTable.displayDetail).toEqual(false);
    });

    it('goBackRow ', () => {
        //no hay datos
        dtTable.responseDt.data = <EndpointModel[]>[];
        dtTable.selectedRow = null;
        dtTable.goBackRow();
        expect(dtTable.selectedRow).toBeNull();

        // 10 filas por página
        // Pagina 1
        getDataPaginated(10, 1);


        //ya no puede retroceder
        dtTable.selectedRow = dtTable.responseDt.data[0];
        dtTable.goBackRow();
        expect(dtTable.selectedRow).toEqual(allRowsMock[0]);


        //puede retroceder
        dtTable.selectedRow = dtTable.responseDt.data[1];
        dtTable.goBackRow();
        expect(dtTable.selectedRow).toEqual(allRowsMock[0]);


        // 10 filas por página
        // ultimo registro de la pagina 2, retrocede un registro (penultimo de la tabla)
        dtTable.defaultSelected = 0;

        changePage(2);
        // brinca la pagina y se mantiene en la posicion seleccionada
        expect(dtTable.selectedRow).toEqual(allRowsMock[10]);

        //fila 1 pagina 2 brinca a ultima fila pagina 1
        dtTable.goBackRow();
        expect(dtTable.selectedRow).toEqual(allRowsMock[9]);

        // primer registro de la pagina 2, retrocede al ultimo registro de la página 1
        changePage(3); //regresa a la 2
        // brinca la pagina y se mantiene en la posicion seleccionada
        expect(dtTable.selectedRow).toEqual(allRowsMock[29]);

        //nos movemos a la primer fila de la pagina 3
        dtTable.selectedRow = dtTable.responseDt.data[0];
        expect(dtTable.selectedRow).toEqual(allRowsMock[20]);

        dtTable.goBackRow();
        expect(dtTable.responseDt.page).toEqual(2);
        expect(dtTable.selectedRow).toEqual(allRowsMock[19]);

        dtTable.goBackRow();
        expect(dtTable.responseDt.page).toEqual(2);
        expect(dtTable.selectedRow).toEqual(allRowsMock[18]);
    });

    it('goNextRow ', () => {
        //no hay datos
        dtTable.responseDt.data = <EndpointModel[]>[];
        dtTable.selectedRow = null;
        dtTable.goNextRow();
        expect(dtTable.selectedRow).toBeNull();

        // 10 filas por página
        // Pagina 1
        getDataPaginated(10, 1);

        // fila 1 a la 2 de la pagina 1
        expect(dtTable.responseDt.page).toEqual(1);
        dtTable.selectedRow = dtTable.responseDt.data[0];
        dtTable.goNextRow();
        expect(dtTable.responseDt.page).toEqual(1);
        expect(dtTable.selectedRow).toEqual(allRowsMock[1]);

        // Fila 9, pagina 1, brinca a fila 1 pagina 2
        dtTable.selectedRow = dtTable.responseDt.data[dtTable.responseDt.data.length - 1];
        expect(dtTable.selectedRow).toEqual(allRowsMock[9]);
        dtTable.goNextRow();
        expect(dtTable.responseDt.page).toEqual(2);
        expect(dtTable.selectedRow).toEqual(allRowsMock[10]);

        // vamos a la ultima ágina
        changePage(4);

        // //última pagina primer registro
        expect(dtTable.selectedRow).toEqual(allRowsMock[30]);
        dtTable.goNextRow();
        expect(dtTable.responseDt.page).toEqual(4);
        expect(dtTable.selectedRow).toEqual(allRowsMock[31]);
        dtTable.goNextRow();
        dtTable.goNextRow();
        dtTable.goNextRow();
        dtTable.goNextRow();
        expect(dtTable.responseDt.page).toEqual(4);
        expect(dtTable.selectedRow).toEqual(allRowsMock[32]);

    });

    it('showMenuContext ', () => {
        let event: any = {
            stopPropagation() { }
        };
        spyOn(event, 'stopPropagation');
        spyOn(dtTable.dtCtxMenu, 'show');
        spyOn(dtTable.dtCtxMenuExport, 'hide');
        spyOn(dtTable, 'showMenuContext').and.callThrough();

        expect(dtTable.showMenuContext(dtTable.dtCtxMenu, event, rowMock)).toBeFalsy();
    });

    it('showMenuContextExport ', () => {
        let event: any = {
            stopPropagation() { }
        };
        spyOn(event, 'stopPropagation');
        spyOn(dtTable.dtCtxMenu, 'hide');
        spyOn(dtTable.dtCtxMenuExport, 'show');
        spyOn(dtTable, 'showMenuContext').and.callThrough();

        expect(dtTable.showMenuContextExport(dtTable.dtCtxMenuExport, event)).toBeFalsy();
    });

    it('hideExportMenuContext ', () => {
        spyOn(dtTable.dtCtxMenuExport, 'hide');
        expect(dtTable.hideExportMenuContext()).toBeFalsy();
    });

    it('checkIfActionIsAllowed ', () => {
        let _dataMock: EndpointModel[] = <EndpointModel[]>[
            rowMock
        ];

        let isAllowed: boolean = dtTable.checkIfActionIsAllowed(EndpointName.Endpoint, 'Create');
        expect(isAllowed).toBeFalse();


        // dtTable.getPermissions();
        let _urlMock = env.getUlrApi(ApiName.Default, `${EndpointName.Access}/GetPermissions?endpoints=${EndpointName.Endpoint}`);
        const requestMock = controller.expectOne(_urlMock);
        expect(requestMock.request.method).toEqual('GET');
        requestMock.flush(
            {
                code: 200,
                data: _dataMock,
                message: ""
            }
        );

        dtTable.permissions = _dataMock;
        isAllowed = dtTable.checkIfActionIsAllowed(EndpointName.Endpoint, 'Create');
        expect(isAllowed).toBeTrue();
    });


});

