import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {groupsApiUrl} from "../../../../shared/configurations/routes-config";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  allGroupDetails = new Subject()
  allGroupDetails$ = this.allGroupDetails.asObservable();
  newGroupCreatedDetails = new Subject();
  newGroupCreatedDetails$ = this.newGroupCreatedDetails.asObservable();
  selectedGroupDetails = new Subject();
  selectedGroupDetails$ = this.selectedGroupDetails.asObservable();

  constructor(private http: HttpClient) { }

  // API function integration to get all group details
  getAllGroupList() {
    this.http.get(groupsApiUrl).subscribe((value) => {
      if (value) {
        this.allGroupDetails.next(value)
      }
    });
  }

  // API function to create new group
  sendNewGroupDetailsToServer(groupFormValue: any) {
    if (groupFormValue) {
      this.http.post(groupsApiUrl, groupFormValue).subscribe(newGroupCreatedDetails => {
       if (newGroupCreatedDetails) {
        this.newGroupCreatedDetails.next(newGroupCreatedDetails);
       }
      });
    }
  }

  // API function to get selected group details
  getSelectedGroupDetailsFromApi(selectedGroupId: string) {
    if (selectedGroupId && selectedGroupId !== '') {
      this.http.get(`${groupsApiUrl}/${selectedGroupId}`).subscribe(selectedGroupDetails => {
        if (selectedGroupDetails) {
          this.selectedGroupDetails.next(selectedGroupDetails);
        }
      })
    }
  }

}
