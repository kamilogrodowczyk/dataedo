import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

let component: AboutComponent;
let fixture: ComponentFixture<AboutComponent>;
let page: Page

describe('AboutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    page = new Page()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show header', () => {
    expect(page.header.textContent).toBe('Recruitment task');
  });
});

class Page {
  get header() {
    return this.query<HTMLElement>('h2');
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
