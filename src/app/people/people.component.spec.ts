import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { asyncScheduler, of, timer } from 'rxjs';

import { PeopleComponent } from './people.component';
import { Person } from './people.model';
import { PeopleService } from './people.service';

let component: PeopleComponent;
let fixture: ComponentFixture<PeopleComponent>;
let testPerson: Person;
let asyncPerson: Person;
let getPersonSpy: jasmine.Spy;
let timerSpy: jasmine.Spy;
let page: Page;

describe('PeopleComponent', () => {
  beforeEach(() => {
    testPerson = {
      name: {
        first: 'John',
        last: 'Smith',
      },
      picture: {
        large: 'https://picsum.photos/200/300',
      },
    };

    const peopleService = jasmine.createSpyObj('PeopleService', [
      'getPerson',
      'timer',
    ]);

    getPersonSpy = peopleService.getPerson.and.returnValue(of(testPerson));
    timerSpy = peopleService.timer.and.returnValue(getPersonSpy());

    TestBed.configureTestingModule({
      declarations: [PeopleComponent],
      providers: [{ provide: PeopleService, useValue: peopleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    page = new Page();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show person before OnInit', () => {
    expect(page.header)
      .withContext('should not show header text before OnInit')
      .toBe(null);
    expect(timerSpy.calls.any())
      .withContext('timerSpy not yet called')
      .toBe(false);
  });

  it('should show person after component initialized', () => {
    fixture.detectChanges(); // onInit()

    expect(page.header?.textContent)
      .withContext('should show header text after OnInit')
      .toBe(`${testPerson.name.first} ${testPerson.name.last}`);

    expect(page.image?.src)
      .withContext('should show image after OnInit')
      .toBe(`${testPerson.picture.large}`);

    expect(timerSpy.calls.any()).withContext('timerSpy called').toBe(true);
  });

  describe('fakeAsync timer', () => {
    let _tick: (milliseconds: number) => void;
    beforeEach(() => {
      asyncPerson = {
        name: {
          first: 'Anne',
          last: 'Jordan',
        },
        picture: {
          large: 'https://picsum.photos/200/300',
        },
      };
      let fakeNow = 0;
      _tick = (milliseconds) => {
        fakeNow += milliseconds;
        tick(milliseconds);
      };
      asyncScheduler.now = () => fakeNow;
    });
    it("should change object's property value after specific time", fakeAsync(() => {
      const source = timer(100);
      let receivedPerson: Person | undefined;
      source.subscribe((value) =>
        value === 0
          ? (receivedPerson = Object.assign({}, asyncPerson))
          : undefined
      );
      _tick(50);
      expect(receivedPerson).not.toBeDefined();
      _tick(50);
      expect(receivedPerson?.name.first).toBe(asyncPerson.name.first);
    }));
  });
});

class Page {
  get image() {
    return this.query<HTMLImageElement | null>('img');
  }
  get header() {
    return this.query<HTMLElement | null>('h1');
  }

  get button() {
    return this.query<HTMLButtonElement>('button');
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
