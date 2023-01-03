import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookDetailComponent } from './address-book-detail.component';

describe('AddressBookDetailComponent', () => {
  let component: AddressBookDetailComponent;
  let fixture: ComponentFixture<AddressBookDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
