import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import {filterStackTrace} from 'protractor/built/util';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  // the ComponentFixture type is a utility tpe that helps bring together a lot
  // of features that are needed for testing a component
  let fixture: ComponentFixture<CoursesCardListComponent>;

  let el: DebugElement;

  // asynch() will wait for the asynchronous operations to complete before considing
  // the beforeEach() to be completed (will wait 5 seconds)
  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents() // returns a promise that is resolved when the testbed is finished
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it('should create the component', () => {

   expect(component).toBeTruthy();

  });


  it('should display the course list', () => {

    component.courses = setupCourses();

    // This must be called when there are any changes made to the component.
    // Angular will not detect them automatically
    fixture.detectChanges();

    // can use the debugElement to print the native HTML to the console
    // nativeElement will give us the native DOM element that corresponds to the component
    console.log(el.nativeElement.outerHTML);

    // The By class is a test utility that makes it easy to create a predicate
    // function to identify a given dom element. A predicate function is a
    // function that either returns true or false
    const cards = el.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');


  });


  it('should display the first course', () => {

      component.courses = setupCourses();

      fixture.detectChanges();

      const course = component.courses[0];

      const card = el.query(By.css('.course-card:first-child'));
      const title = card.query(By.css('mat-card-title'));
      const image = card.query(By.css('img'));

      expect(card).toBeTruthy();
      expect(title.nativeElement.textContent).toBe(course.titles.description);
      expect(image.nativeElement.src).toBe(course.iconUrl);



  });


});


