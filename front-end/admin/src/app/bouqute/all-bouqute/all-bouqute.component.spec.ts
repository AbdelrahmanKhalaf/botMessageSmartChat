import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBouquteComponent } from './all-bouqute.component';

describe('AllBouquteComponent', () => {
  let component: AllBouquteComponent;
  let fixture: ComponentFixture<AllBouquteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBouquteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBouquteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
