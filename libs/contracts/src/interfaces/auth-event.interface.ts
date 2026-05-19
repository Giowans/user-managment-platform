export interface UserLoggedInPayload {

    userId: string;

    email: string;

    roles: Array<{

        id: string;
        name: string;
    }>;
}