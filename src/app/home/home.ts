import { Component, Input } from '@angular/core';
import { Header } from "../header/header";
import { User } from "../models/User";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../services/http-service';
import { Item } from '../models/Item';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../models/Role';
@Component({
    selector: 'app-home',
    imports: [Header, MatFormFieldModule, MatInputModule, MatIconModule],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {

    private httpService: HttpService;
    private router: Router;
    user: User;
    protected readonly Role = Role;
    constructor(httpService: HttpService, router: Router, private route: ActivatedRoute) {
        this.httpService = httpService;
        this.router = router;
        this.user = new User(
            localStorage.getItem('username') || '',
            (localStorage.getItem('role') as Role) || Role.USER
        );
    }

    addItem() {
        this.router.navigate(['/items/new']);
    }
    listAllItems() {
        /*this.httpService.listAllItems().subscribe({
              next: (items: Item[]) => {
                  this.router.navigate(['/items']);
              },
              error: (err: any) => console.error('Could not list all items', err)
          });*/
        this.router.navigate(['/items']);
    }
    listAllUsers() {
        this.router.navigate(["/users"]);
    }
    searchUsers(filter: string) {
        this.router.navigate(["/users"], { queryParams: { "filter": filter } });
    }

    searchItems(filter: string) {
        this.router.navigate(["/items"], { queryParams: { "filter": filter } });
    }
}
