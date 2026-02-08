import { Component, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from '../models/User';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { HttpService } from '../services/http-service';
import { AuthService } from '../services/auth-service';
import { Header } from "../header/header";
import { Role } from '../models/Role';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-manage-users',
  imports: [MatCheckboxModule, MatIcon, MatButtonModule, MatTableModule, Header, CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers {
  protected httpService: HttpService = inject(HttpService);
  protected authService: AuthService = inject(AuthService);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  users: User[] = [];
  user: User;
  originalUsers: User[] = [];
  isChangeToBeApplied: boolean = false;
  listUsersIdToBeDeleted: string[] = [];
  displayedColumns = ['id', 'username', 'role', 'enabled', 'actions'];
  router: Router;


  constructor(router: Router) {
    this.router = router;
    this.user = new User(
      localStorage.getItem('username') || '',
      (localStorage.getItem('role') as Role) || Role.USER
    );
    if (this.user.role !== Role.ADMIN) {
      this.router.navigate(['/home']);
    }
  }
  cancelChanges() {
    this.reloadUsers();
  }
  applyChanges() {
    if (!this.isChangeToBeApplied) {
      console.log("No changes to apply");
      return;
    }

    // 1. Delete users marked for deletion
    this.listUsersIdToBeDeleted.forEach((id) => {
      this.authService.deleteUser(id).subscribe();
    });
    // 2. Update modified users (the ones remaining in this.users)
    this.users.forEach((user) => {
      const original = this.originalUsers.find((u: User) => u.id === user.id);
      if (original && user.isDifferent(original)) {
        const userWithOnlyDifferences = user.createUserWithOnlyDifferences(original);
        userWithOnlyDifferences.password = undefined;
        this.authService.updateUser(userWithOnlyDifferences).subscribe();
      }
    });
    this.reloadUsers();
    console.log("Changes applied");
  }
  deleteUser(id: string) {
    if (!id) return;
    const index = this.users.findIndex((u: User) => u.id === id);
    if (index !== -1) {
      this.listUsersIdToBeDeleted.push(id); // Store ID for backend deletion later
      this.users.splice(index, 1); // Remove from local view
      this.users = [...this.users]; // CRITICAL: Update reference to refresh mat-table
      this.isChangeToBeApplied = true;
      this.cdr.detectChanges();
    }
  }

  updateEnabled(id: string, event: any) {
    console.log(id, event.checked);
    this.isChangeToBeApplied = true;
    this.users.find((u: User) => u.id === id)!.enabled = event.checked;
  }

  ngOnInit(): void {
    this.reloadUsers();
  }

  reloadUsers() {
    this.listUsersIdToBeDeleted = [];
    this.authService.getAllUsers().subscribe((users) => {
      this.users = users.map(u => new User(u.username, u.role, u.enabled, u.id, u.password));
      this.originalUsers = users.map(u => new User(u.username, u.role, u.enabled, u.id, u.password));
      this.isChangeToBeApplied = false;
      this.cdr.detectChanges();
    });
  }
}
