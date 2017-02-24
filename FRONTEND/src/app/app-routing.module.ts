import { TabsListComponent } from './tabs/tabs-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes =
  [
    { path: 'tabs', component: TabsListComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome' }
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