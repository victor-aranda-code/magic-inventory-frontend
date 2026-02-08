import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth-service";
import { FormsModule } from "@angular/forms";
import { AuthResponse } from '../../models/AuthResponse';
import { AuthUtils } from '../../utils/auth-utils';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  imports: [MatFormField, MatIcon, MatLabel, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  passwordVisible = true;
  router: Router;
  authService: AuthService;
  username: any;
  password: any;
  wrongCredentials = false;
  cdr: ChangeDetectorRef;
  isProduction = environment.production;
  constructor(router: Router, authService: AuthService, cdr: ChangeDetectorRef) { this.router = router; this.authService = authService; this.cdr = cdr; }
  ngOnInit() {
    localStorage.clear();
  }
  login() {
    this.wrongCredentials = false;
    //TODO: Implement login
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (authResponse: AuthResponse) => {
        AuthUtils.saveToken(authResponse);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.wrongCredentials = true;
        console.error('Could not login', err)
        this.cdr.detectChanges();
      }
    })
  }


  clickEvent(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
  }

  hidePassword() {
    return this.passwordVisible;
  }

}
