import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User } from "../classes/User";
import { RegisterRequest } from "../models/RegisterRequest";
import { LoginRequest } from "../models/LoginRequest";
import { AuthResponse } from "../models/AuthResponse";
import { environment } from "../../environments/environment";
import { Item } from "../classes/Item";
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

    private resetOptions(): void {
        this.headers = new HttpHeaders();
        this.params = new HttpParams();
        this.responseType = 'json';
    }
    private createOptions() {
        this.resetOptions()
        let options = {
            headers: this.headers,
            params: this.params,
            responseType: 'json' as const,
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

    findItemById(id: number): Observable<Item> {
        return this.http.get<Item>(this.url + this.INVENTORY_PREFIX + '/items/' + id, this.createOptions());
    }

    findItemByString(name: string): Observable<Item[]> {
        return this.http.get<Item[]>(this.url + this.INVENTORY_PREFIX + '/items?search=' + name, this.createOptions());
    }

    addItem(item: Item): Observable<Item> {
        return this.http.post<Item>(this.url + this.INVENTORY_PREFIX + '/items', item, this.createOptions());
    }
    updateItem(item: Item): Observable<Item> {
        return this.http.put<Item>(this.url + this.INVENTORY_PREFIX + '/items/' + item.id, item, this.createOptions());
    }
    deleteItem(id: number): Observable<Item> {
        return this.http.delete<Item>(this.url + this.INVENTORY_PREFIX + '/items/' + id, this.createOptions());
    }
    editUser(user: User): Observable<User> {
        return this.http.put<User>(this.url + '/user/' + user.id, user, this.createOptions());
    }
    deleteUserByAdmin(id: number): Observable<User> {
        return this.http.delete<User>(this.url + '/user/' + id, this.createOptions());
    }

    addImage(itemId: string, image: string): Observable<string> {
        const options = this.createOptions();
        options.params.set('image', image);
        options.params.set('itemId', itemId);
        options.headers.set('Content-Type', 'multipart/form-data');

        return this.http.post<string>(this.url + this.INVENTORY_PREFIX + '/images', options);
    }

    getImage(imageId: string): Observable<Blob> {
        const options = this.createOptions();
        options.responseType = 'blob' as 'json';
        return this.http.get<Blob>(this.url + this.INVENTORY_PREFIX + '/images/' + imageId, options);
    }





}