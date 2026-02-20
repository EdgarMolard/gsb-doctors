import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RapportsPageComponent } from './rapports-page';

describe('RapportsPageComponent', () => {
  let component: RapportsPageComponent;
  let fixture: ComponentFixture<RapportsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
