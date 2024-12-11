import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MappaBaseComponent } from './mappa-base.component';

describe('MappaBaseComponent', () => {
  let component: MappaBaseComponent;
  let fixture: ComponentFixture<MappaBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappaBaseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MappaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
