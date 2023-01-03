import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookAddComponent } from './address-book-add.component';

describe('AddressBookAddComponent', () => {
  let component: AddressBookAddComponent;
  let fixture: ComponentFixture<AddressBookAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
