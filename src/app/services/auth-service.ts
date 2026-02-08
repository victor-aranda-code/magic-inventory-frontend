import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Item } from "../models/Item";
import { map, Observable } from "rxjs";
import { User } from "../models/User";
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
        return this.http.post<AuthResponse>(this.url + '/api/v1/auth/register', user, this.createOptions());
    }
    login(user: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.url + '/api/v1/auth/login', user, this.createOptions());
    }
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/api/v1/auth/users/' + id, this.createOptions());
    }
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url + '/api/v1/auth/users', this.createOptions());
    }
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(this.url + '/api/v1/auth/users/' + id, this.createOptions());
    }
    updateUser(user: User): Observable<void> {
        return this.http.put<void>(this.url + '/api/v1/auth/users/' + user.id, user, this.createOptions());
    }




}