import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookEditComponent } from './address-book-edit.component';

describe('AddressBookEditComponent', () => {
  let component: AddressBookEditComponent;
  let fixture: ComponentFixture<AddressBookEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
