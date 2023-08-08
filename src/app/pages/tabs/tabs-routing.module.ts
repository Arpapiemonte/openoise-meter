import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'pages/tabs',
    component: TabsPage,
    children: [
      {
        path: 'noisemeter',
        loadChildren: () => import('../noisemeter/noisemeter.module').then(m => m.NoisemeterPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'info',
        loadChildren: () => import('../info/info.module').then(m => m.InfoPageModule)
      },
      {
        path: 'saveddata',
        loadChildren: () => import('../saveddata/saveddata.module').then( m => m.SaveddataPageModule)
      },
      {
        path: '',
        redirectTo: '/pages/tabs/noisemeter',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pages/tabs/noisemeter',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
