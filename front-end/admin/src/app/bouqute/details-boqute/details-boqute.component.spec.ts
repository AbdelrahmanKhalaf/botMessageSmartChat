import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBoquteComponent } from './details-boqute.component';

describe('DetailsBoquteComponent', () => {
  let component: DetailsBoquteComponent;
  let fixture: ComponentFixture<DetailsBoquteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsBoquteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBoquteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
