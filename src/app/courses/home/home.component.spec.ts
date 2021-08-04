import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {Observable, of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import {LoggerService} from '../services/logger.service';
import {Course} from '../model/course';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: jasmine.SpyObj<CoursesService>;
  const beginnerCourses = setupCourses().filter(c => c.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(c => c.category === 'ADVANCED');

  beforeEach(waitForAsync( () => {

    // waitForAsync is like fakeAsync in that it will detect all the asynchronous operations that
    // are made inside the block that it's wrapping. So here it will wait for the
    // configureTestingModule promise to resolve before it is considered to be completed.
    // waitForAsync does not allow for control over the execution of micro vs macro tasks,
    // does not give control over the passage of time, and therefore does not allow for the
    // the synchronous layout of tests.
    // waitForAsync does support actual http requests, so it can be used for integration tests
    // with an actual call to a server. This leads to why async is being used in the beforeEach()
    // There may be a third party component being imported that is making a request to a backend
    // using http calls
    // waitForAsync should almost never be used in regular tests, and almost always used in the
    // beforeEach() block

    const spy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: spy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
      });

  })); // end beforeEach()

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });


  it('should display only beginner courses', () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');


  });


  it('should display only advanced courses', () => {

    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it('should display both tabs', () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');

  });


  it('should display advanced courses when tab clicked', fakeAsync(() => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // custom function created for this course.
    click(tabs[1]);

    fixture.detectChanges();

    flush(); // simulates passage of time and drains macrotask queue until it is empty
    // could also call tick(16) b/c we know the call to the browser animation is 16s
    // can't be used if the amount of time needed to pass is not known

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active'));

    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

  }));

  it('should display advanced courses when tab clicked - async', waitForAsync(() => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // custom function created for this course.
    click(tabs[1]);

    fixture.detectChanges();

    // whenStable() is the callback that the async test zone is going to call
    // when the test zone has detected that all asynchronous operations inside
    // the waitForAsync block have been completed.
    fixture.whenStable().then(() => {

      console.log('called whenStable()');

      const cardTitles = el.queryAll(By.css('.mat-tab-body-active'));

      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });




  }));


});


