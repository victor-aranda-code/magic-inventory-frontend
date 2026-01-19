import { Item } from "./Item";
import { Role } from "./Role";

export class User {
    id?: string
    username: string;
    password?: string;
    role: Role;
    enabled?: boolean;

    constructor(username: string, role: Role = Role.USER, enabled: boolean = true, id: string = "", password: string = "") {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }
    public static fromJSON(json: any): User {
        return Object.assign(User.builder().build(), json);
    }
    public static builder(): UserBuilder {
        return new UserBuilder();
    }
    isDifferent(original: User): boolean {
        return this.username !== original.username || this.password !== original.password || this.role !== original.role || this.enabled !== original.enabled;
    }

    createUserWithOnlyDifferences(original: User): User {
        if (original.password === this.password) {
            this.password = undefined;
        }
        if (original.enabled === this.enabled) {
            this.enabled = undefined;
        }
        return new User(this.username, this.role, this.enabled, this.id, this.password);
    }
    
    public clone(): User {
        return new User(
            this.username,
            this.role,
            this.enabled,
            this.id,
            this.password
        );
    }
}

export class UserBuilder {
    private user: User = new User("", Role.USER, true, "", "");

    public withId(id: string): UserBuilder {
        this.user.id = id;
        return this;
    }

    public withUsername(username: string): UserBuilder {
        this.user.username = username;
        return this;
    }

    public withRole(role: Role): UserBuilder {
        this.user.role = role;
        return this;
    }

    public withPassword(password: string): UserBuilder {
        this.user.password = password;
        return this;
    }

    public withEnabled(enabled: boolean): UserBuilder {
        this.user.enabled = enabled;
        return this;
    }

    public build(): User {
        return this.user.clone();
    }
}