import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDocumentsComponent } from './other-documents.component';

describe('OtherDocumentsComponent', () => {
  let component: OtherDocumentsComponent;
  let fixture: ComponentFixture<OtherDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
