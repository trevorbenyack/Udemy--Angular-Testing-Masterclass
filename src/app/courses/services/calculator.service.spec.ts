import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

describe('Calculator Service', () => {

  let calculator: CalculatorService;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    console.log('calling beforeEach()');
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });

    calculator = TestBed.inject(CalculatorService);
    loggerServiceSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  it('should add two numbers', () => {
    console.log('add test');
    const result = calculator.add(2, 2);

    expect(result).toBe(4);

    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    console.log('subtract test');
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected subtraction result');

    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });

});
