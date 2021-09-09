import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingChatUserComponent } from './setting-chat-user.component';

describe('SettingChatUserComponent', () => {
  let component: SettingChatUserComponent;
  let fixture: ComponentFixture<SettingChatUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingChatUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingChatUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
