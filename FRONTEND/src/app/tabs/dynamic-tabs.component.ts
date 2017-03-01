import { Tab } from './tab.model';
import { TabsService } from './tabs.service';
import { TabsListComponent } from './tabs-list.component';
import { Component, OnInit } from '@angular/core';

@Component({
    template: `
  
    <h1>Recursive Notebook</h1>
    <hr>

    <tabs-list (onSelect)="Selected($event)"></tabs-list> 

    <textarea *ngIf="selectedTab" 
              [value]="selectedTab.content" 
              (keyup)="content=$event.target.value"></textarea>

    <button *ngIf="selectedTab" 
            [disabled]="selectedTab.content==content" 
            (click)="Save()" 
            [innerHTML]="buttonText" 
            class="btn btn-primary">Save</button>
    
    `,
    styles: [` textarea { width:98%; margin: 12px 1%; padding: 12px; border: 1px solid #ddd; height: 300px }`]
})
export class DynamicTabsComponent
{
    private selectedTab: Tab = null;

    private buttonText: string = "Save";
    private content: string = "";


    constructor(private _tabsService: TabsService) { }

    private Selected($event: Tab): void
    {
        this.selectedTab = $event;

        if ($event != null)
        {
            console.log("Selected tab: " + this.selectedTab.title);
        }
    }

    private Save(): void
    {
        this.buttonText = "Saving...";
  this.selectedTab.content = this.content;
      console.log(this.selectedTab);
    
        this._tabsService.UpdateContent(this.selectedTab).subscribe((n) =>
        {
            this.buttonText = "Save";
        });
    }
}