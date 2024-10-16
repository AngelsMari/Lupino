export interface User {
    _id : string,
    name: string;
    password: string;
    jwt: string;
    mail: string;
    isAdmin: boolean;
    fcmtoken: string;
}
