import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Movie } from '@app/_models/movie';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    public movies = new Array<Movie>();

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllMovies()
            .pipe(first())
            .subscribe(movies => this.movies = movies as Array<Movie>);
    }

    deleteMovie(id: number) {
        const movie = this.movies!.find(x => x.id === id);
        if(movie) {
        movie.isDeleting = true;
        this.accountService.deleteMovie(id)
            .pipe(first())
            .subscribe(() => this.movies = this.movies!.filter(x => x.id !== id));
        }
    }
}