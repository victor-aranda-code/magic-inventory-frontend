import { Component } from '@angular/core';
import { User } from '../classes/User';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIcon } from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-manage-users',
  imports: [MatCheckboxModule, MatIcon, MatButtonModule, MatTableModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers {
cancelChanges() {
throw new Error('Method not implemented.');
}
applyChanges() {
throw new Error('Method not implemented.');
}
deleteUser(arg0: any) {
throw new Error('Method not implemented.');
}
  updateInLocked(id: number, event: any) {
      console.log(id, event.checked);
  }
    users: User[] = [];
}
