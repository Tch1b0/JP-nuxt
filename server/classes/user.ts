import { hashSync, compareSync } from "bcrypt";
import { nanoid } from "nanoid";
import { setDayInterval } from "~~/utility";

export class User {
    username: string;
    password: string;
    token: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = hashSync(password, 10);

        // Regenerate the token every 15 days
        setDayInterval(() => this.genToken(), 15);
    }

    public comparePassword(password: string): boolean {
        return compareSync(password, this.password);
    }

    public genToken(): string {
        this.token = nanoid(36);
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
