import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractDetailPage } from './contract-detail.page';

describe('ContractDetailPage visual', () => {
  let fixture: ComponentFixture<ContractDetailPage>;
  let component: ContractDetailPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractDetailPage]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractDetailPage);
    component = fixture.componentInstance;
    component.title = 'Test Contract';
    component.ventajas = ['Advantage 1', 'Advantage 2'];
    component.desventajas = ['Disadvantage 1'];
    component.modificaciones = ['Modification 1'];
    component.clausulas = ['Clause 1'];
    fixture.detectChanges();
  });

  it('should render all sections with example data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Contract');
    expect(compiled.textContent).toContain('Advantage 1');
    expect(compiled.textContent).toContain('Disadvantage 1');
    expect(compiled.textContent).toContain('Modification 1');
    expect(compiled.textContent).toContain('Clause 1');
  });
});
