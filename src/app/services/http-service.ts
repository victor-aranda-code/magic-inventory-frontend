import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, switchMap, of } from "rxjs";
import { ImageUtils } from "../utils/image-utils";
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
    private INVENTORY_PREFIX = '/api/v1/inventory';
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
        return this.http.post<User>(this.url + '/api/v1/auth/register', user, this.createOptions());
    }
    login(user: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.url + '/api/v1/auth/login', user, this.createOptions());
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
        return this.http.put<User>(this.url + '/api/v1/auth/user/' + user.id, JSON.stringify(user), options);
    }
    deleteUserByAdmin(id: number): Observable<User> {
        return this.http.delete<User>(this.url + '/api/v1/auth/user/' + id, this.createOptions());
    }

    addImage(itemId: string, image: any): Observable<Item> {
        return ImageUtils.resizeImage(image, 320, 320).pipe(
            switchMap(resizedBlob => {
                var fd = new FormData();
                fd.append('image', resizedBlob, 'image.jpg');
                fd.append('itemId', itemId);
                return this.http.post<Item>(this.url + this.INVENTORY_PREFIX + '/images', fd, {});
            })
        );
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

    autocompleteDetails(image: any, item: Item): Observable<Item> {
        return ImageUtils.resizeImage(image, 320, 320).pipe(
            switchMap(resizedBlob => {
                var fd = new FormData();
                fd.append('image', resizedBlob, 'image.jpg');
                fd.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
                return this.http.post<Item>(this.url + '/api/v1/ai/autocomplete', fd, {});
            })
        );
    }

    advancedSearch(image: any, searchTerm: string): Observable<Item[]> {
        const imageResizer: Observable<Blob | null> = (image != null && image !== "")
            ? ImageUtils.resizeImage(image, 320, 320)
            : of(null);

        return imageResizer.pipe(
            switchMap((resizedBlob: Blob | null) => {
                var fd = new FormData();
                if (resizedBlob) {
                    fd.append('image', resizedBlob, 'image.jpg');
                }
                if (searchTerm != null && searchTerm != "") {
                    fd.append('query', searchTerm);
                }
                return this.http.post<Item[]>(this.url + '/api/v1/ai/search', fd, {});
            })
        );
    }
}