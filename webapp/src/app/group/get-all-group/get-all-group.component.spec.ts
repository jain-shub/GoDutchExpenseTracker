import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllGroupComponent } from './get-all-group.component';

describe('GetAllGroupComponent', () => {
  let component: GetAllGroupComponent;
  let fixture: ComponentFixture<GetAllGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAllGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
