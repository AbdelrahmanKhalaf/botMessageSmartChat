import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBouquteComponent } from './details-bouqute.component';

describe('DetailsBouquteComponent', () => {
  let component: DetailsBouquteComponent;
  let fixture: ComponentFixture<DetailsBouquteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsBouquteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBouquteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
