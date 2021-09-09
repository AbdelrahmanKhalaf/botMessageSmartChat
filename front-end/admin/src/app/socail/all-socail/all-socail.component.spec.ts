import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSocailComponent } from './all-socail.component';

describe('AllSocailComponent', () => {
  let component: AllSocailComponent;
  let fixture: ComponentFixture<AllSocailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSocailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSocailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
