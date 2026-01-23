import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { User } from '../../../models/User';
import { AuthResponse } from '../../../models/AuthResponse';
import { AuthService } from '../../../services/auth-service';
import { Router } from "@angular/router";
import { Role } from '../../../models/Role';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthUtils } from '../../../utils/auth-utils';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-register',
  imports: [MatFormField, MatIcon, MatLabel, MatInputModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  passwordVisible = true;
  username: string;
  password: string;
  confirmPassword: string;
  authService: AuthService;
  router: Router;
  passwordsDoNotMatch = false;
  userErrorMessage: string;
  cdr: ChangeDetectorRef;

  constructor(authService: AuthService, router: Router, cdr: ChangeDetectorRef) {
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
    this.authService = authService;
    this.router = router;
    this.cdr = cdr;
    this.userErrorMessage = "";
  }

  clickEvent(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
  }

  hidePassword() {
    return this.passwordVisible;
  }

  checkPasswords() {
    this.passwordsDoNotMatch = this.password !== this.confirmPassword;
    if(this.confirmPassword.length === 0) {
      this.userErrorMessage = "";
    } else {
      this.userErrorMessage = this.passwordsDoNotMatch ? "Passwords do not match" : "";
    }
    this.cdr.detectChanges();
  }

  register() {
    this.checkPasswords();
    if (this.passwordsDoNotMatch) {
      console.log("Passwords do not match");
      this.userErrorMessage = "Passwords do not match";
      this.cdr.detectChanges();
      return;
    }

    this.authService.registerUser({ username: this.username, password: this.password, role: Role.USER }).subscribe({
      next: (authResponse: AuthResponse) => {
        console.log("User registered");
        AuthUtils.saveToken(authResponse);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        if(err.status === 409) {
          this.userErrorMessage = "Error: User already exists";
        } else {
          this.userErrorMessage = "Error: Could not register user";
        }
        console.error('Could not register', err)
        this.cdr.detectChanges();
      }
    });
  }
}

