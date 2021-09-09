import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersWitAcceptComponent } from './all-users-wit-accept.component';

describe('AllUsersWitAcceptComponent', () => {
  let component: AllUsersWitAcceptComponent;
  let fixture: ComponentFixture<AllUsersWitAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUsersWitAcceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUsersWitAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
