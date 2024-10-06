import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColumnChooserService, GridAllModule} from "@syncfusion/ej2-angular-grids";
import {Subscription} from "rxjs";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {Router, RouterLink} from "@angular/router";
import {DialogAllModule} from "@syncfusion/ej2-angular-popups";
import {ModifyGroupComponent} from "../modify-group/modify-group.component";
import {NgForOf, NgIf} from "@angular/common";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-list-group',
  standalone: true,
  imports: [
    GridAllModule,
    ButtonAllModule,
    RouterLink,
    DialogAllModule,
    ModifyGroupComponent,
    NgIf,
    NgForOf
  ],
  providers: [ColumnChooserService],
  templateUrl: './list-group.component.html',
  styleUrl: './list-group.component.scss'
})
export class ListGroupComponent implements OnInit, OnDestroy{
  groupDetailsList: any = [];
  allGroupDetails$: Subscription = new Subscription();
  isModalVisible: boolean = false;

  constructor(private groupService: GroupService, private router: Router) {
  }

  ngOnInit() {
    this.allGroupDetails$ = this.groupService.allGroupDetails$.subscribe((allGroupDetails: any) => {
      if (allGroupDetails) {
        this.groupDetailsList = allGroupDetails;
      }
    });
    this.groupService.getAllGroupList();
  }

  // Function to filter members with names only
  displayNames(members: any[]) {
    return members.filter(member => member.name && member.email).map(member => member.name);
  }

  // Function to filter members with emails (if no names exist)
  displayEmails(members: any[]) {
    return members.filter(member => !member.name && member.email).map(member => member.email);
  }

  onAddNewGroup() {
    this.router.navigate(['/groups'], { queryParams: { add: 'true' } });
    this.isModalVisible = true;
  }

  handleAddNewGroupComponentEvent(value: boolean) {
    this.isModalVisible = value;
    this.router.navigate(['/groups'], { queryParams: {} });
  }

  ngOnDestroy() {
    if (this.allGroupDetails$) {
      this.allGroupDetails$.unsubscribe();
    }
  }
}
