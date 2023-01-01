
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CallBackService } from './callback.service';

describe('CallBackService', () => {
  let service: CallBackService;
  let contextMock = this;
  let paramsMock = { test: 'Test' };


  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        teardown: { destroyAfterEach: false },
        imports: [
        ],
        providers: [CallBackService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

    service = TestBed.inject(CallBackService);
  });



  it('setItems', () => {
    service.execute(contextMock, ()=> callBackFunctionTest(paramsMock) );
    expect(service).toBeTruthy();
  });

  function callBackFunctionTest(params: any): void{
    expect(params).toEqual(paramsMock);
  }


});
