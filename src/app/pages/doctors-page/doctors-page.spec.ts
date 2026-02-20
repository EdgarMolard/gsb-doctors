import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsPageComponent } from './doctors-page';

describe('DoctorsPageComponent', () => {
  let component: DoctorsPageComponent;
  let fixture: ComponentFixture<DoctorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
