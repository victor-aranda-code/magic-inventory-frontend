import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Item } from '../../models/Item';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpService } from '../../services/http-service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Header } from "../../header/header";
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { CardItem } from './card-item/card-item';
@Component({
    selector: 'app-list-items',
    imports: [MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, CommonModule, Header, CardItem],
    templateUrl: './list-items.html',
    styleUrl: './list-items.css',
})
export class ListItems {
    items: Item[] = [];
    route: ActivatedRoute;
    router: Router;
    user: User;
    protected readonly Role = Role;
    private cdr = inject(ChangeDetectorRef);
    constructor(private httpService: HttpService, route: ActivatedRoute, router: Router) {
        this.route = route;
        this.router = router;
        this.user = new User(
            localStorage.getItem('username') || '',
            (localStorage.getItem('role') as Role) || Role.USER
        );
        if (environment.MOCK_BACKEND) {
            this.items = [
                new Item("1", 'Item 1', 'Category 1', 'Description 1'),
                new Item("2", 'Item 2', 'Category 2', 'Description 2'),
                new Item("3", 'Item 3', 'Category 3', 'Description 3'),
                new Item("4", 'Item 4', 'Category 4', 'Description 4'),
            ];
        } else {
            this.route.queryParams.subscribe((params: any) => {
                let filter = params['filter'];
                if (filter) {
                    this.httpService.findItemByString(filter).subscribe(items => {
                        this.items = items.map((item: any) => Item.fromJSON(item));
                        this.cdr.detectChanges();
                    });
                } else {
                    this.httpService.listAllItems().subscribe(items => {
                        this.items = items.map((item: any) => Item.fromJSON(item));
                        this.cdr.detectChanges();
                    });
                }
            });
        }
    }
}
