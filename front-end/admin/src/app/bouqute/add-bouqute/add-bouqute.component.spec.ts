import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBouquteComponent } from './add-bouqute.component';

describe('AddBouquteComponent', () => {
  let component: AddBouquteComponent;
  let fixture: ComponentFixture<AddBouquteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBouquteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBouquteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
