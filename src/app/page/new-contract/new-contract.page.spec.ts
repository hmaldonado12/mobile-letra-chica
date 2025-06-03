import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewContractPage } from './new-contract.page';

describe('NewContractPage', () => {
  let component: NewContractPage;
  let fixture: ComponentFixture<NewContractPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
