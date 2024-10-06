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

  constructor(private http: HttpClient) { }

  getAllGroupList() {
    this.http.get(groupsApiUrl).subscribe((value) => {
      if (value) {
        this.allGroupDetails.next(value)
      }
    });
  }

  sendNewGroupDetailsToServer(groupFormValue: any) {
    if (groupFormValue) {
      this.http.post(groupsApiUrl, groupFormValue).subscribe(newGroupCreatedDetails => {
       if (newGroupCreatedDetails) {
        this.newGroupCreatedDetails.next(newGroupCreatedDetails);
       }
      });
    }
  }

}
