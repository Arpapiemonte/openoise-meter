import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'pages/tabs',
    component: TabsPage,
    children: [
      {
        path: 'noisemeter',
        loadComponent: () =>
          import('../noisemeter/noisemeter.page').then((m) => m.NoisemeterPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'info',
        loadComponent: () =>
          import('../info/info.page').then((m) => m.InfoPage),
      },
      {
        path: 'saveddata',
        loadComponent: () =>
          import('../savedata/savedata.page').then((m) => m.SavedataPage),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('../map/map.page').then((m) => m.MapPage),
      },
      {
        path: '',
        redirectTo: '/pages/tabs/noisemeter',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/pages/tabs/noisemeter',
    pathMatch: 'full',
  },
];
