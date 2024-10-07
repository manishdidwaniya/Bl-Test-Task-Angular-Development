import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonAllModule, CheckBoxAllModule, RadioButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {NgForOf, NgIf} from "@angular/common";
import {DropDownListAllModule, MultiSelectAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {NumericTextBoxAllModule, TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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

  onGroupChange(event: any): void {
    const selectedGroupId = event.itemData.id;  // Get selected group ID
    const isSplitBetweenAll = this.expenseForm.get('splitBetweenAll')?.value;
    if (selectedGroupId) {
      if (isSplitBetweenAll) {
        this.updateGroupMembers(selectedGroupId, true);
      } else {
        this.updateGroupMembers(selectedGroupId, false);
      }
    }
  }

  onSelectAllMembers(event: any): void {
    const isSplitBetweenAll = event.checked;  // Get checkbox status
    const selectedGroupId = this.expenseForm.get('group')?.value;
    if (selectedGroupId) {
      this.updateGroupMembers(selectedGroupId, isSplitBetweenAll);
    }
  }

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
