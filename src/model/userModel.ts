export class UserModel {
    id: string;

    username: string;

    countryName?: string;

    score: number;
    rank?: number;
}

export class RedisModel {
    value: string;

    score: number;

    rank?: number;
}