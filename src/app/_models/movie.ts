export class Movie {
    id!: number;
    name?: string;
    description?: string;
    duration?: string;
    budget?: number;
    start?: string;
    end?: string;
    isDeleting?: boolean;
    isActing = false;
    isRequested = false;
}