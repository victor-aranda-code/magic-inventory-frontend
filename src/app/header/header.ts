import { Component, Input } from '@angular/core';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Router } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  router: Router;
  constructor(router: Router) { this.router = router; }

  @Input() userLoggedIn!: User;
  protected readonly Role = Role;

  goToHome() {
    this.router.navigate(['/home']);
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
