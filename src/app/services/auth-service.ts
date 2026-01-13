import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Item } from "../classes/Item";
import { map, Observable } from "rxjs";
import { User } from "../classes/User";
import { RegisterRequest } from "../models/RegisterRequest";
import { LoginRequest } from "../models/LoginRequest";
import { AuthResponse } from "../models/AuthResponse";
import { environment } from "../../environments/environment";
@Injectable({ providedIn: 'root' })
export class AuthService {
    private url = environment.BACKEND_URL;
    private http = inject(HttpClient);
    private headers = new HttpHeaders();
    private params = new HttpParams();
    private responseType = 'json';

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


    registerUser(user: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.url + '/register', user, this.createOptions());
    }
    login(user: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.url + '/login', user, this.createOptions());
    }




}