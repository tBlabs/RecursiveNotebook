import { HttpResourceService } from './../common/http-resource.service';
import { HttpModule } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { TabsService } from './tabs.service';
import { Http } from '@angular/http';


describe('Service: Tabs', () =>
{
  let service: TabsService = null;

  beforeEach(() =>
  {
    TestBed.configureTestingModule(
    {
      imports: [HttpModule],
      providers: [
        HttpResourceService,
        TabsService]
    });
  });

  beforeEach(inject([TabsService], (tabsService: TabsService) =>
  {
    service = tabsService;
  }));

  it('should exist', () =>
  {
      expect(service).toBeTruthy();   
  });
 
});