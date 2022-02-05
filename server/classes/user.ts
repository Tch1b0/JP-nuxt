import bcrypt from "bcrypt";

export class User {
    username: string;
    password: string;
    token: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = bcrypt.hashSync(password, 10);
    }

    public comparePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    public genToken(): string {
        this.token = bcrypt.hashSync(Math.random().toString(16), 10);
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
