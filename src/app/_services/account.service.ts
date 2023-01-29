import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Movie } from '@app/_models/movie';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    private movieSubject: BehaviorSubject<Movie | null>;
    public user: Observable<User | null>;
    public movie: Observable<Movie | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
        this.movieSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('movie')!));
        this.movie = this.movieSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    public get movieValue() {
        return this.movieSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getAllMovies() {
        return this.http.get<Movie[]>(`${environment.apiUrl}/Movies`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: number, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }

    
    deleteMovie(id: number) {
        return this.http.delete(`${environment.apiUrl}/movies/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }

    getMovieById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/movies/${id}`);
    }

    addMovie(movie: Movie) {
        return this.http.post(`${environment.apiUrl}/movies/`, movie);
    }

    updateMovie(id: number, params: any) {
        return this.http.put(`${environment.apiUrl}/movie/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.movieValue?.id) {
                    // update local storage
                    const movie = { ...this.movieValue, ...params };
                    localStorage.setItem('movie', JSON.stringify(movie));

                    // publish updated movie to subscribers
                    this.movieSubject.next(movie);
                }
                return x;
            }));
    }
}