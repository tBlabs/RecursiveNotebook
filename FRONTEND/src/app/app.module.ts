import { TabsModule } from './tabs/tabs.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { FocusModule } from 'angular2-focus';
import { AppComponent } from './app.component';


@NgModule(
{ 
  imports: 
  [
    BrowserModule,
    FormsModule,
    HttpModule,
    FocusModule.forRoot(),
    TabsModule,
    AppRoutingModule // Should be always at last position on that list
  ],
  declarations: 
  [
    AppComponent    
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
