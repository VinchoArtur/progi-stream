import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomPageConferenceComponent } from './welcom-page-conference.component';

describe('WelcomPageConferenceComponent', () => {
  let component: WelcomPageConferenceComponent;
  let fixture: ComponentFixture<WelcomPageConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomPageConferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomPageConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
