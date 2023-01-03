import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookDeleteComponent } from './address-book-delete.component';

describe('AddressBookDeleteComponent', () => {
  let component: AddressBookDeleteComponent;
  let fixture: ComponentFixture<AddressBookDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
