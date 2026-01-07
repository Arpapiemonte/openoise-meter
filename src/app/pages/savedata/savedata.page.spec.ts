import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedataPage } from './savedata.page';

describe('SavedataPage', () => {
  let component: SavedataPage;
  let fixture: ComponentFixture<SavedataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
