import {
  Component,
  Directive,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleResultRendererComponent } from './single-result-renderer.component';

import { SingleResultRendererDirective } from './single-result-renderer.directive';

describe('SingleResultRendererDirective', () => {
  let fixture: ComponentFixture<SingleResultRendererComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleResultRendererDirective, SingleResultRendererComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SingleResultRendererComponent);
  })
  it('should create an instance', () => {
    const directive = fixture
    expect(directive).toBeTruthy();
  });
});
