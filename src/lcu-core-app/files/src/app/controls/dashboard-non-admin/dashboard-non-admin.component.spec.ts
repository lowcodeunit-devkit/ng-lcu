import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNonAdminComponent } from './dashboard-non-admin.component';

describe('DashboardNonAdminComponent', () => {
  let component: DashboardNonAdminComponent;
  let fixture: ComponentFixture<DashboardNonAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNonAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNonAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
