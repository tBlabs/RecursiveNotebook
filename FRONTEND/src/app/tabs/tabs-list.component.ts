import { Observable } from 'rxjs/Rx';
import { TabsService } from './tabs.service';
import { Tab } from './tab.model';
import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'tabs-list',
    template: `
  
        <ul class="nav nav-tabs little-margin-top">

            <li *ngIf="parentTab != null" 
                [class.active]="selectedTab == null" 
                (click)="SelectContentTab()">
                <a>_</a>
            </li>

            <li *ngIf="isLoading"> 
                <a>Loading...</a>
            </li>

            <li *ngFor="let tab of tabs"           
                class="editable-tab"    
                [class.active]="tab == selectedTab" 
                (click)="Select(tab)"
                (contextmenu)="Delete($event, tab)">   
                <a>  
                    <editable-value [class.active-tab]="tab == selectedTab" 
                                    [value]="tab.title"
                                    [placeholder]="'Title'"
                                    (onChange)="EditTabTitle(tab, $event)">
                    </editable-value>             
                </a>
            </li>

            <li>   
                <a>             
                    <editable-once [value]="'(+)'"
                                   [placeholder]="'New Tab Title'"
                                   (onComplete)="AddSibiling($event)">
                    </editable-once>             
                </a>
            </li>
 
        </ul>
        
        <tabs-list *ngIf="selectedTab != null" 
                    [parentTab]="selectedTab"
                    (onSelect)="onSelect.emit($event)">
        </tabs-list> 
    `,
    styleUrls: ['tabs-list.component.css']
})
export class TabsListComponent implements OnInit, OnChanges
{
    @Input() parentTab: Tab = null;
    @Output() onSelect: EventEmitter<Tab> = new EventEmitter<Tab>();

    private tabs: Tab[] = [];
    private selectedTab: Tab = null;
    private isLoading: boolean = false;

    constructor(private tabsService: TabsService, private _title: Title) { }


    ngOnChanges()
    {
        this.selectedTab = null;

        this.LoadTabs(this.parentTab);
    }

    ngOnInit()
    {
        if (this.parentTab == null) // Because ngOnChanges() comes first..
        {
            this.LoadTabs(this.parentTab);
        }
    }


    private SelectContentTab(): void
    {
        if (this.selectedTab != null)
        {
            this.onSelect.emit(this.parentTab); 

            this.selectedTab = null;
        }
    }

    private Select(tab: Tab): void
    {
        if (this.selectedTab != tab)
        {
            this.selectedTab = tab;

            this.onSelect.emit(this.selectedTab);

            this._title.setTitle(tab.title);
        }
    }

    private LoadTabs(parentId: Tab): void
    {
        this.isLoading = true;
        this.tabs = [];

        this.tabsService.GetChildren(parentId ? parentId.id : 0)
            .finally(() =>
            {
                this.isLoading = false;
            })
            .subscribe((tabs: Tab[]) => 
            {
                this.tabs = tabs;
            });
    }

    private AddSibiling(title: string): void
    {
        if (title != "")
        {
            this.tabsService.AddSibling(this.parentTab ? this.parentTab.id : 0, title).subscribe(newTab =>
            {
                this.tabs.push(newTab);

                this.Select(newTab);
            });
        }
    }

    private EditTabTitle(tab: Tab, newTabTitle: string): void
    {
        this.tabsService.UpdateTitle(tab, newTabTitle).subscribe(() => 
        {
            tab.title = newTabTitle;
        });
    }

    private Delete($event: Event, tab: Tab)
    {
        $event.preventDefault();

        if (confirm("Delete?"))
        {
            this.tabsService.Delete(tab.id).subscribe(() =>
            {
                this.tabs.splice(this.tabs.indexOf(tab), 1);
                this.SelectContentTab();
            });
        }
    }
}