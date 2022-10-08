import { hashSync, compareSync } from "bcrypt";
import { nanoid } from "nanoid";
import { setDayInterval, timeInMillis } from "~~/utility/utility";
import { readFileSync, existsSync } from "node:fs";

/**
 * a user-representation in the backend
 */
export class User {
    username: string;
    password: string;
    token: string;
    description = "";

    /**
     * create a new user
     * @param username the username of the user
     * @param password the password of the user
     * @param autoRegenerateToken whether the token should be automatically regenerated
     * @param regenerationIntervalDays after how many days a new token should be generated
     */
    constructor(
        username: string,
        password: string,
        autoRegenerateToken = true,
        regenerationIntervalDays = 15,
    ) {
        this.username = username;
        this.password = hashSync(password, 10);

        this.genToken();
        this.loadDescription();

        if (autoRegenerateToken) {
            // regenerate the token every `regenerationIntervalDays` days
            setDayInterval(() => this.genToken(), regenerationIntervalDays);
        }

        if (process.env.NODE_ENV === "production") {
            setInterval(
                () => this.loadDescription(),
                timeInMillis({ minutes: 5 }),
            );
        }
    }

    /**
     * compare a password with the passwords hash of the user
     * @param password the password to compare
     * @returns whether the passwords match or not
     */
    public comparePassword(password: string): boolean {
        return compareSync(password, this.password);
    }

    /**
     * generate a new token and store it in this object
     * @returns this token
     */
    public genToken(): string {
        this.token = nanoid(36);
        return this.token;
    }

    public loadDescription() {
        console.log("Loading Description");

        const filepath = "./data/about.md";
        if (existsSync(filepath)) {
            this.description = readFileSync(filepath).toString();
        } else if (this.description.length === 0) {
            this.description = "Add an about.md file inside the data directory";
        }
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
