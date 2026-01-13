import { Component, Input } from '@angular/core';
import { Header } from "../header/header";
import { User } from "../classes/User";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { HttpService } from '../services/http-service';
import { Item } from '../classes/Item';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
    constructor(httpService: HttpService, router: Router, private route: ActivatedRoute) {
        this.httpService = httpService;
        this.router = router;
        this.user = {username: localStorage.getItem('user')!, role: localStorage.getItem('role')!};
    }

    searchItems(find: string) {
        this.router.navigate(['/items', { queryParams: { find: find } }]);
    }
    addItem() {
        this.router.navigate(['/items/new']);
    }
    listAllItems() {
      this.httpService.listAllItems().subscribe({
            next: (items: Item[]) => {
                this.router.navigate(['/items']);
            },
            error: (err: any) => console.error('Could not list all items', err)
        });
    }
}
