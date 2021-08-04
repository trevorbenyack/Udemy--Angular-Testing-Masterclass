import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {

    console.log('1. entering test');
    coursesService.findAllCourses().subscribe(courses => {
      console.log('2. entering .subscribe()');
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'incorrect number of courses');

      const course = courses.find(c => c.id === 12);

      expect(course.titles.description).toBe('Angular Testing Course');
    });

    console.log('3. modeling api request');
    const req = httpTestingController.expectOne('/api/courses');

    console.log('4. expect GET request');
    expect(req.request.method).toEqual('GET');

    console.log('5. flush data');
    req.flush({payload: Object.values(COURSES)});

  });

  it('should find a course by id', () => {

    coursesService.findCourseById(12).subscribe(course => {

      expect(course).toBeTruthy('No courses returned');
      expect(course.id).toBe(12, 'incorrect course id');

    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);

  });

  it('should save the course data', () => {

    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes).subscribe(course => {

      expect(course).toBeTruthy('no course found');

      expect(course.id).toBe(12, 'incorrect course id');

    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    const flushData = {
      ...COURSES[12], // return course 12 data
      ...changes // overwrite course 12 data with that in changes
    };

    req.flush(flushData);

  });

  it('should give an error if save course fails', () => {

    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail('the save course operation should have failed');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {

    coursesService.findLessons(12).subscribe(lessons => {

      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);

    });

    const req = httpTestingController.expectOne(r => r.url === '/api/lessons');
    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify(); // verifies that no other api calls are being made  })
  });

});
