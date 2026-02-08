import { Role } from "./Role";

export class AuthResponse {
    token: string;
    username: string;
    role: Role;
    constructor(token: string, username: string, role: Role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
}