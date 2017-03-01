import { DynamicTabsComponent } from './tabs/dynamic-tabs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes =
  [
    //{ path: 'tabs', component: TabsListComponent }, // TODO: path should not be empty! that's for test
   // { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    //{ path: '**', redirectTo: 'welcome' }
    { path: '**', component: DynamicTabsComponent }
  ];

@NgModule(
  {
    imports:
    [
      CommonModule,
      FormsModule,
      RouterModule.forRoot(appRoutes)
    ],
    exports:
    [
      RouterModule
    ]
  })
export class AppRoutingModule { }