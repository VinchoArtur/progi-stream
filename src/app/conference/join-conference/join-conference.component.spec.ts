import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinConferenceComponent } from './join-conference.component';

describe('JoinConferenceComponent', () => {
  let component: JoinConferenceComponent;
  let fixture: ComponentFixture<JoinConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinConferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
