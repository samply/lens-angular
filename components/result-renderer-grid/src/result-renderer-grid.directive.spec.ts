import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultRendererGridComponent } from './result-renderer-grid.component';

import { ResultRendererGridDirective } from './result-renderer-grid.directive';

describe('ResultRendererGridDirective', () => {
  let fixture: ComponentFixture<ResultRendererGridComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultRendererGridDirective, ResultRendererGridComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ResultRendererGridComponent);
  })
  it('should create an instance', () => {
    const directive = fixture;
    expect(directive).toBeTruthy();
  });
});
