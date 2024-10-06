import {Component, Output, EventEmitter, OnInit, Input, OnDestroy} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {DialogModule} from "@syncfusion/ej2-angular-popups";
import {Router} from "@angular/router";
import {GroupService} from "../services/group.service";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../../../shared/common/services/notifications.service";

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

export class ModifyGroupComponent implements OnInit, OnDestroy{
  @Input() selectedGroupId? : string;
  groupForm!: FormGroup;
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  @Output() notifyListGroupComponent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public newGroupDetails$: Subscription = new Subscription();
  public groupModalHeading: string = '';
  public selectedGroupDetails$: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private router: Router, public groupService: GroupService,
              public notificationsService: NotificationsService) {}

  ngOnInit() {
    this.buildGroupForm();
    this.newGroupDetails$ = this.groupService.newGroupCreatedDetails$.subscribe(value => {
      if (value) {
        this.notificationsService.displaySuccessMessageOnToast('Group has been successfully created.');
        this.notifyListGroupComponent.emit(false);
        this.router.navigate(['/groups'], { queryParams: {} });
      }
    });
    if (this.selectedGroupId !== '') {
      this.groupModalHeading = 'Update Group'
    } else {
      this.groupModalHeading = 'Create Group'
    }
    this.selectedGroupDetails$ = this.groupService.selectedGroupDetails$.subscribe(selectedGroupDetails => {
      if (selectedGroupDetails) {
        this.patchGroupForm(selectedGroupDetails);
      }
    });
    this.getSelectedGroupDetails();
  }

  getSelectedGroupDetails() {
    this.groupService.getSelectedGroupDetailsFromApi(this.selectedGroupId!);
  }

  /**
   * Patches the group form with the provided group data.
   *
   * This method updates the form fields for the group name and
   * description, and resets the members form array based on
   * the members of the provided group. Each member's name and
   * email are added to the form array as form groups.
   *
   * @param group - The group data to patch the form with. This should be an
   * object containing the groupName, groupDescription, and members.
   * Each member is expected to be an object with 'name' and 'email' properties.
   */
  patchGroupForm(group: any): void {
    // Patch the form values
    this.groupForm.patchValue({
      groupName: group.groupName,
      groupDescription: group.groupDescription,
    });
    const membersFormArray = this.groupForm.get('members') as FormArray;
    membersFormArray.clear(); // Clear existing members
    group.members.forEach((member:any) => {
      membersFormArray.push(this.fb.group({
        name: [member.name || ''],
        email: [member.email || '', [Validators.email]]
      }));
    });
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

  ngOnDestroy() {
    if (this.selectedGroupDetails$) {
      this.selectedGroupDetails$.unsubscribe()
    }
    if (this.selectedGroupDetails$) {
      this.selectedGroupDetails$.unsubscribe();
    }
  }
}
