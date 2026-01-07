import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoisemeterPage } from './noisemeter.page';

describe('NoisemeterPage', () => {
  let component: NoisemeterPage;
  let fixture: ComponentFixture<NoisemeterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoisemeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
