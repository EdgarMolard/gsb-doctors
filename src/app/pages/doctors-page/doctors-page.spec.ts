import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsPage } from './doctors-page';

describe('DoctorsPage', () => {
  let component: DoctorsPage;
  let fixture: ComponentFixture<DoctorsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
