import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGroupComponent } from './modify-group.component';

describe('ModifyGroupComponent', () => {
  let component: ModifyGroupComponent;
  let fixture: ComponentFixture<ModifyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
