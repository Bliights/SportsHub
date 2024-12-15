import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencePageComponent } from './preference-page.component';

describe('PreferencePageComponent', () => {
  let component: PreferencePageComponent;
  let fixture: ComponentFixture<PreferencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
