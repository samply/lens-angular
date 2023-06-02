import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRendererGridComponent } from './result-renderer-grid.component';
import { ResultRendererGridDirective } from './result-renderer-grid.directive';

describe('ResultRendererGridComponent', () => {
  let component: ResultRendererGridComponent;
  let fixture: ComponentFixture<ResultRendererGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultRendererGridComponent, ResultRendererGridDirective ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultRendererGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
