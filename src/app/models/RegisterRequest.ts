import { Role } from "./Role";

export class RegisterRequest {
    username: string;
    password: string;
    role: Role;

    constructor(username: string, password: string, role: Role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}