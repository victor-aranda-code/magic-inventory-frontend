import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthResponse } from "../models/AuthResponse";

export class AuthUtils {
    constructor() { }

    static saveToken(response: AuthResponse) {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(response.token);
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('username', decodedToken.sub);
        localStorage.setItem('role', decodedToken.role);
    }
}