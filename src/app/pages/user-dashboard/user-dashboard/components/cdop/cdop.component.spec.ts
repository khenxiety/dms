import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdopComponent } from './cdop.component';

describe('CdopComponent', () => {
  let component: CdopComponent;
  let fixture: ComponentFixture<CdopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
