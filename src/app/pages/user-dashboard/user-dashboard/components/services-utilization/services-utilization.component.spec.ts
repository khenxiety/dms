import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesUtilizationComponent } from './services-utilization.component';

describe('ServicesUtilizationComponent', () => {
  let component: ServicesUtilizationComponent;
  let fixture: ComponentFixture<ServicesUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesUtilizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
