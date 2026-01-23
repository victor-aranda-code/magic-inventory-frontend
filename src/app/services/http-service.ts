import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User } from "../models/User";
import { RegisterRequest } from "../models/RegisterRequest";
import { LoginRequest } from "../models/LoginRequest";
import { AuthResponse } from "../models/AuthResponse";
import { environment } from "../../environments/environment";
import { Item } from "../models/Item";
@Injectable({ providedIn: 'root' })

export class HttpService {
    private url = environment.BACKEND_URL;
    private http = inject(HttpClient);
    private headers = new HttpHeaders();
    private params = new HttpParams();
    private responseType = 'json';
    private INVENTORY_PREFIX = '/inventory';
    items: Item[] = [];

    constructor() { }

    private createOptions() {
        let options = {
            headers: new HttpHeaders(),
            params: new HttpParams(),
            responseType: 'json' as const
        };
        return options;
    }


    registerUser(user: RegisterRequest): Observable<User> {
        return this.http.post<User>(this.url + '/auth/register', user, this.createOptions());
    }
    login(user: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.url + '/auth/login', user, this.createOptions());
    }

    listAllItems(): Observable<Item[]> {
        return this.http.get<Item[]>(this.url + this.INVENTORY_PREFIX + '/items', this.createOptions());
    }

    listAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url + this.INVENTORY_PREFIX + '/users', this.createOptions());
    }

    findItemById(id: string): Observable<Item> {
        return this.http.get<Item>(this.url + this.INVENTORY_PREFIX + '/items/' + id, this.createOptions());
    }

    findItemByString(name: string): Observable<Item[]> {
        return this.http.get<Item[]>(this.url + this.INVENTORY_PREFIX + '/items?search=' + name, this.createOptions());
    }

    addItem(item: Item): Observable<Item> {
        let options = this.createOptions();
        options.headers = options.headers.set('Content-Type', 'application/json');
        return this.http.post<Item>(this.url + this.INVENTORY_PREFIX + '/items', JSON.stringify(item), options);
    }
    updateItem(item: Item): Observable<Item> {
        let options = this.createOptions();
        options.headers = options.headers.set('Content-Type', 'application/json');
        return this.http.put<Item>(this.url + this.INVENTORY_PREFIX + '/items/' + item.id, JSON.stringify(item), options);
    }
    deleteItem(id: string): Observable<void> {
        let options = this.createOptions();
        return this.http.delete<void>(this.url + this.INVENTORY_PREFIX + '/items/' + id, options);
    }
    editUser(user: User): Observable<User> {
        let options = this.createOptions();
        options.headers = options.headers.set('Content-Type', 'application/json');
        return this.http.put<User>(this.url + '/user/' + user.id, JSON.stringify(user), options);
    }
    deleteUserByAdmin(id: number): Observable<User> {
        return this.http.delete<User>(this.url + '/user/' + id, this.createOptions());
    }

    addImage(itemId: string, image: string): Observable<Item> {
        const options = {
        };
        var fd = new FormData();
        fd.append('image', image);
        fd.append('itemId', itemId);
        return this.http.post<Item>(this.url + this.INVENTORY_PREFIX + '/images', fd, options);
    }
    deleteImage(imageId: string): Observable<string> {
        return this.http.delete<string>(this.url + this.INVENTORY_PREFIX + '/images/' + imageId, this.createOptions());
    }

    getImage(imageId: string): Observable<Blob> {
        const options = {
            headers: this.headers,
            params: this.params,
            //observe: 'response' as const,
            responseType: 'blob' as const
        };
        return this.http.get(this.url + this.INVENTORY_PREFIX + '/images/' + imageId, options);
    }
}