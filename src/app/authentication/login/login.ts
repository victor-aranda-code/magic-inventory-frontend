import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth-service";
import {FormsModule} from "@angular/forms";
import { AuthResponse } from '../../models/AuthResponse';
@Component({
  selector: 'app-login',
  imports: [MatFormField, MatIcon, MatLabel, MatInputModule, FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  passwordVisible = true;
  router: Router;
  authService: AuthService;
username: any;
password: any;
  constructor(router: Router, authService: AuthService) { this.router = router; this.authService = authService; }
  login() {
    console.log("Login");
    //TODO: Implement login
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: (authResponse: AuthResponse) => {
        localStorage.setItem('token', authResponse.token);
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Could not login', err)
    })
  }
  

  clickEvent(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
  }

  hidePassword() {
    return this.passwordVisible;
  }

}
