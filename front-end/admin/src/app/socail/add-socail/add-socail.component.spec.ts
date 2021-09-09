import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocailComponent } from './add-socail.component';

describe('AddSocailComponent', () => {
  let component: AddSocailComponent;
  let fixture: ComponentFixture<AddSocailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
