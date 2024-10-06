import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {DialogModule} from "@syncfusion/ej2-angular-popups";
import {Router} from "@angular/router";
import {GroupService} from "../services/group.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-modify-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    TextBoxAllModule,
    NgForOf,
    ButtonAllModule,
    DialogModule
  ],
  templateUrl: './modify-group.component.html',
  styleUrl: './modify-group.component.scss'
})

export class ModifyGroupComponent implements OnInit{
  groupForm!: FormGroup;
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  @Output() notifyListGroupComponent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public newGroupDetails$: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private router: Router, public groupService: GroupService) {}

  ngOnInit() {
    this.buildGroupForm();
    this.newGroupDetails$ = this.groupService.newGroupCreatedDetails$.subscribe(value => {
      if (value) {

      }
    })
  }

  buildGroupForm() {
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
      groupDescription: [''],
      members: this.fb.array([]), // Form array for members
    });
  }

  get members(): FormArray {
    return this.groupForm.get('members') as FormArray;
  }

  // Add new member form group to FormArray
  addMember() {
    const memberGroup = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
    });
    this.members.push(memberGroup);
  }

  // Remove a member from the FormArray
  removeMember(index: number) {
    this.members.removeAt(index);
  }

  closeModal() {
    this.notifyListGroupComponent.emit(false);
  }

  public onOpen(args: any): void {
    //Preventing the default dialog focus
    args.preventFocus = true;
  }

  onGroupAddOrUpdate() {
    if (this.groupForm.get('groupName')?.value && this.groupForm.valid) {
      this.groupService.sendNewGroupDetailsToServer(this.groupForm?.value);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }
}
