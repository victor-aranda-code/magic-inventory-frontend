import { Component } from '@angular/core';
import { Item } from '../../classes/Item';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';
import { HttpService } from '../../services/http-service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-items',
  imports: [MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, CommonModule],
  templateUrl: './list-items.html',
  styleUrl: './list-items.css',
})
export class ListItems {
    items: Item[] = [];
    route: ActivatedRoute;
    router: Router;
    constructor(private httpService: HttpService, route: ActivatedRoute, router: Router) {
        this.route = route;
        this.router = router;
        if(environment.MOCK_BACKEND) {
            this.items = [
                new Item(1, 'Item 1', 'Category 1', 'Description 1'),
                new Item(2, 'Item 2', 'Category 2', 'Description 2'),
                new Item(3, 'Item 3', 'Category 3', 'Description 3'),
                new Item(4, 'Item 4', 'Category 4', 'Description 4'),
            ];
        } else {
            this.route.queryParams.subscribe((params: any) => {
                let find = params['find'];
                if(find) {
                    this.httpService.findItemByString(find).subscribe(items => {
                        this.items = items;
                    });
                } else {
                    this.httpService.listAllItems().subscribe(items => {
                        this.items = items;
                    });
                }
            });
        }
    }
    onItemSelect(item: Item) {
        this.router.navigate(['/items', item.id]);
    }
}
