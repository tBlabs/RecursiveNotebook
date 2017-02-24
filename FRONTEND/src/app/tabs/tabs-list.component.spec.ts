import { EditableOnceComponent } from "./editable-once.component";
import { TabsService } from "./tabs.service";
import { Tab } from "./tab.model";
import { Observable } from "rxjs/Rx";
import { ActivatedRoute } from "@angular/router";
import { element, by } from "protractor";
import { TabsListComponent } from "./tabs-list.component";
import { async, inject, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { SuperFixture } from "./../testing/utils";
import { EditableValueComponent } from "./editable-value.component";
import { Location } from "@angular/common";
import { Title } from "@angular/platform-browser";

describe("tabs-list", () =>
{
    let _service: TabsService;

    let tabsServiceStub =
        {
            GetChildren: (parentId: number) =>
            {
                if (parentId == 0)
                {
                    return Observable.of(
                        [
                            { parentId: 0, id: 1, title: "A", content: "A content" },
                            { parentId: 0, id: 2, title: "B", content: "B content" },
                            { parentId: 0, id: 3, title: "C", content: "C content" }
                        ]);
                }
                else if (parentId == 1)
                {
                    return Observable.of(
                        [
                            { parentId: 1, id: 10, title: "AA", content: "AA content" },
                            { parentId: 1, id: 11, title: "AB", content: "AB content" },
                            { parentId: 1, id: 12, title: "AC", content: "AC content" }
                        ]);
                }
            }
        }

    let f: SuperFixture<TabsListComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule(
            {
                declarations:
                [
                    TabsListComponent,
                    EditableOnceComponent,
                    EditableValueComponent
                ],
                providers:
                [
                    Title,
                    { provide: TabsService, useValue: tabsServiceStub }
                ]
            })
            .compileComponents();
    }));

    beforeEach(inject([TabsService, Title], (service: TabsService, t: Title) =>
    {
        _service = service;

        f = new SuperFixture<TabsListComponent>(TabsListComponent);

        f.component.parentTab = null;

        f.DetectChanges();
    }));

    it("should start with initial tabs", () =>
    {
        expect(f.$("ul li", "A")).toBeDefined();
        expect(f.$("ul li", "B")).toBeDefined();
        expect(f.$("ul li", "C")).toBeDefined();
        expect(f.$("ul li", "(+)")).toBeDefined("plus tab not found");
    });

    it("after click on tab should call onSelect", () =>
    {
        spyOn(f.component.onSelect, "emit").and.callThrough();

        f.ClickLeft(f.$("ul li", "A"));

        f.component.onSelect.subscribe((tab: Tab) =>
        {
            expect(tab.parentId).toBe(0);
            expect(tab.id).toBe(1);
            expect(tab.title).toBe("A");
            expect(tab.content).toBe("A content");
        });

        expect(f.component.onSelect.emit).toHaveBeenCalled();
    });

    it("after click on tab A should load tabs AA, AB, AC and _ and (+)", () =>
    {
        f.ClickLeft(f.$("ul li", "A"));

        expect(f.$("ul li", "_")).toBeDefined("parent content tab not found");
        expect(f.$("ul li", "AA")).toBeDefined();
        expect(f.$("ul li", "AB")).toBeDefined();
        expect(f.$("ul li", "AC")).toBeDefined();
        expect(f.$("ul li", "(+)")).toBeDefined("plus tab not found");
    });

});