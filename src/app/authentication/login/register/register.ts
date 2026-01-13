import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { User } from '../../../classes/User';
import { AuthResponse } from '../../../models/AuthResponse';
import { AuthService } from '../../../services/auth-service';
import { Router } from "@angular/router";
import { Role } from '../../../models/Role';

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

  constructor(authService: AuthService, router: Router) {
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
    this.authService = authService;
    this.router = router;
  }

  clickEvent(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
  }

  hidePassword() {
    return this.passwordVisible;
  }
  register() {
    console.log("Call Register");
    if (this.password !== this.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    this.authService.registerUser({ username: this.username, password: this.password, role: Role.USER }).subscribe({
      next: (authResponse: AuthResponse) => {
        console.log("User registered");
        localStorage.setItem('jwt_token', authResponse.token);
        localStorage.setItem('user', this.username);
        localStorage.setItem('role', Role.USER.toString());
        this.router.navigate(['/home']);
      },
      error: (err: any) => console.error('Could not register', err)
    });
  }
}

