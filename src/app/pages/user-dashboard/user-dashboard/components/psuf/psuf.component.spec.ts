import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsufComponent } from './psuf.component';

describe('PsufComponent', () => {
  let component: PsufComponent;
  let fixture: ComponentFixture<PsufComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsufComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
