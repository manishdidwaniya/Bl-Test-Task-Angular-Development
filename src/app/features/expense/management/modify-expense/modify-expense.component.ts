import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonAllModule, CheckBoxAllModule, RadioButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {NgForOf, NgIf} from "@angular/common";
import {DropDownListAllModule, MultiSelectAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {NumericTextBoxAllModule, TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DialogAllModule} from "@syncfusion/ej2-angular-popups";
import {DatePickerAllModule} from "@syncfusion/ej2-angular-calendars";
import {GroupService} from "../../../groups/management/services/group.service";
import {Subscription} from "rxjs";
import {ExpenseService} from "../../services/expense.service";
import {NotificationsService} from "../../../../shared/common/services/notifications.service";

@Component({
  selector: 'app-modify-expense',
  standalone: true,
  imports: [
    ButtonAllModule,
    NgForOf,
    DropDownListAllModule,
    TextBoxAllModule,
    ReactiveFormsModule,
    DialogAllModule,
    DatePickerAllModule,
    NumericTextBoxAllModule,
    RadioButtonAllModule,
    CheckBoxAllModule,
    MultiSelectAllModule,
    NgIf
  ],
  templateUrl: './modify-expense.component.html',
  styleUrl: './modify-expense.component.scss'
})
export class ModifyExpenseComponent implements OnInit, OnDestroy{
  expenseForm!: FormGroup;
  allGroupList$: Subscription = new Subscription();
  groupDropdownFields: Object = {text: 'groupName', value: 'id'};
  groupMembersDropdownFields: Object = {text: 'name', value: 'name'};
  allGroupList: any = [];
  allGroupMembersList: any = [];
  newExpenseDetails$: Subscription = new Subscription();
  isModalVisible: boolean = true;
  constructor(private fb: FormBuilder, private groupService: GroupService, private expenseService: ExpenseService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.buildExpenseForm();
    this.allGroupList$ = this.groupService.allGroupDetails$.subscribe((allGroups: any) => {
      if (allGroups) {
        this.allGroupList = allGroups;
      }
    });
    this.newExpenseDetails$ =  this.expenseService.newExpenseDetails$.subscribe(newAddedExpenseDetails => {
      if (newAddedExpenseDetails) {
        this.notificationsService.displaySuccessMessageOnToast('Added new expense successfully.');
        this.isModalVisible = false;
      }
    })
    this.groupService.getAllGroupList();
  }

  buildExpenseForm(): void {
    this.expenseForm = this.fb.group({
      group: ['', Validators.required],
      splitBetweenAll: [true],
      groupMembers: [''],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  onSubmitExpense() {
    if (this.expenseForm.valid) {
      this.expenseService.sendExpenseDetailsToServer(this.expenseForm?.value);
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  /**
   * Handles the event when a group is selected from the dropdown.
   * Based on the selected group and the state of the 'splitBetweenAll' checkbox,
   * it updates the list of group members.
   *
   * @param event - The selection event containing the selected group's details.
   *    - `event.itemData.id`: The ID of the selected group.
   *
   * Logic:
   * - If a group is selected and 'splitBetweenAll' is checked, assigns all group members.
   * - If 'splitBetweenAll' is unchecked, allows manual selection of group members.
   */
  onGroupChange(event: any): void {
    const selectedGroupId = event.itemData.id;
    const isSplitBetweenAll = this.expenseForm.get('splitBetweenAll')?.value;
    if (selectedGroupId) {
      if (isSplitBetweenAll) {
        this.updateGroupMembers(selectedGroupId, true);
      } else {
        this.updateGroupMembers(selectedGroupId, false);
      }
    }
  }

  /**
   * Handles the 'Select all members' checkbox event.
   * Updates the list of group members based on the checkbox state.
   *
   * @param event - The event triggered by the checkbox action.
   *    - `event.checked`: Indicates whether the 'Select all members' checkbox is checked (true) or unchecked (false).
   *
   * Logic:
   * - If a group is selected and the checkbox is checked, assigns all group members.
   * - If the checkbox is unchecked, allows manual selection of group members.
   */
  onSelectAllMembers(event: any): void {
    const isSplitBetweenAll = event.checked;  // Get checkbox status
    const selectedGroupId = this.expenseForm.get('group')?.value;
    if (selectedGroupId) {
      this.updateGroupMembers(selectedGroupId, isSplitBetweenAll);
    }
  }

  /**
   * Updates the list of group members for the selected group.
   * If the 'Select all members' checkbox is checked, automatically selects all members.
   * Otherwise, clears the current selection to allow manual selection.
   *
   * @param selectedGroupId - The ID of the selected group.
   * @param autoSelectAll - A boolean flag indicating whether to automatically select all members (true) or not (false).
   *
   * Logic:
   * - Finds the group details based on the selected group ID.
   * - If a group is found, sets the `allGroupMembersList` with its members.
   * - If `autoSelectAll` is true, selects all members' names and updates the `groupMembers` form control.
   * - If `autoSelectAll` is false, clears the selection for manual member selection.
   * - Calls `calculatePerPersonAmount()` to recalculate the amount per person.
   */
  updateGroupMembers(selectedGroupId: any, autoSelectAll: boolean): void {
    const selectedGroupDetails = this.allGroupList.find((group: any) => group.id === selectedGroupId);
    this.allGroupMembersList = selectedGroupDetails ? selectedGroupDetails.members : [];
    if (autoSelectAll) {
      const allMemberNames = this.allGroupMembersList.map((member: any) => member.name);
      this.expenseForm.patchValue({ groupMembers: allMemberNames });
    } else {
      this.expenseForm.patchValue({ groupMembers: [] });
    }
    this.calculatePerPersonAmount();
  }

  /**
   * Calculates the amount each group member should contribute based on the total expense amount and the number of selected members.
   *
   * @returns A formatted string showing the amount each member needs to contribute in the format: `($X per person)`
   *
   * Logic:
   * - Retrieves the total amount (`amount`) entered in the expense form.
   * - Retrieves the list of currently selected group members from the form.
   * - If both the amount and the members list are valid (non-empty), calculates the per-person amount by dividing the total amount by the number of members.
   * - Returns a string showing the per-person contribution in the format `($X per person)`.
   */
  calculatePerPersonAmount() {
    const addedAmount: number = this.expenseForm.get('amount')?.value;
    const currentGroupMembers: [] = this.expenseForm.get('groupMembers')?.value;
    let perPersonAmount: number = 0;
    if (addedAmount && currentGroupMembers.length > 0) {
      perPersonAmount = addedAmount/currentGroupMembers.length;
    }
    return '('+ '$' + perPersonAmount + ' per person' + ')';
  }

  ngOnDestroy() {
    if (this.newExpenseDetails$) {
      this.newExpenseDetails$.unsubscribe();
    }
  }

  public onOpen(args: any): void {
    //Preventing the default dialog focus
    args.preventFocus = true;
  }

  onDialogClose(): void {
    this.isModalVisible = false;
  }

}
