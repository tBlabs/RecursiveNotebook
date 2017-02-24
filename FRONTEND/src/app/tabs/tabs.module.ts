import { HttpResourceService } from './../common/http-resource.service';
import { EditableOnceComponent } from './editable-once.component';
import { EditableValueComponent } from './editable-value.component';
import { DynamicTabsComponent } from './dynamic-tabs.component';
import { TabsListComponent } from './tabs-list.component';
import { RouterModule } from '@angular/router';
import { TabsService } from './tabs.service';
import { Http, HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusModule } from 'angular2-focus';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: 
  [
    FormsModule,
    HttpModule,
    CommonModule,
    FocusModule.forRoot(),
    RouterModule.forChild([
      { path: 'tabs', component: DynamicTabsComponent },
      { path: 'tabs/:id', component: DynamicTabsComponent }
    ])
  ],
  exports:
  [
    RouterModule
  ],
  declarations:
  [
    DynamicTabsComponent,
    TabsListComponent,
    EditableValueComponent,
    EditableOnceComponent
  ],
  providers:
  [
    HttpResourceService,
    TabsService
  ]
})
export class TabsModule { }