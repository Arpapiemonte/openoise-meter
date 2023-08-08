import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoisemeterPage } from './noisemeter.page';

describe('NoisemeterPage', () => {
  let component: NoisemeterPage;
  let fixture: ComponentFixture<NoisemeterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoisemeterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoisemeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
