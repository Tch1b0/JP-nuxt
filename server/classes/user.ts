import { hashSync, compareSync } from "bcrypt";

export class User {
    username: string;
    password: string;
    token: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = hashSync(password, 10);
    }

    public comparePassword(password: string): boolean {
        return compareSync(password, this.password);
    }

    public genToken(): string {
        this.token = hashSync(Math.random().toString(16), 10);
        return this.token;
    }

    public toJSON(): object {
        return {
            username: this.username,
            password: this.password,
        };
    }

    public static fromJSON(json: object): User {
        return new User(json["username"], json["password"]);
    }
}
