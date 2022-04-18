import { Location } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpyLocation } from '@angular/common/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { PeopleComponent } from './people/people.component';
import { PeopleService } from './people/people.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AboutComponent } from './about/about.component';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let page: Page;
let router: Router;
let location: SpyLocation;
let http: HttpClient;

describe('AppComponent', () => {
  const peopleService = jasmine.createSpyObj('PeopleService', [
    'getPerson',
    'timer',
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent, PeopleComponent],
      providers: [{ provide: PeopleService, useValue: peopleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    page = new Page();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render anchors', () => {
    expect(page.anchor.length).toBe(2);
  });

  describe('RouterTestingModule', () => {
    it('should navigate to "People" immediately', fakeAsync(() => {
      createComponent();
      tick();

      expect(location.path()).toEqual('/people');
      const el = fixture.debugElement.query(By.directive(PeopleComponent));
      expect(el).toBeTruthy();
    }));

    it('should navigate to "About" on click', fakeAsync(() => {
      createComponent();
      page.anchor[1].click(); // About anchor

      tick();
      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/about');
      const el = fixture.debugElement.query(By.directive(AboutComponent));
      expect(el).toBeTruthy();
    }));
  });
});

function createComponent() {
  const injector = fixture.debugElement.injector;
  location = injector.get(Location) as SpyLocation;
  router = injector.get(Router);
  router.initialNavigation();
}

class Page {
  get anchor() {
    return this.queryAll<HTMLElement>('a');
  }

  private queryAll<T>(selector: string): T[] {
    return fixture.nativeElement.querySelectorAll(selector);
  }
}
