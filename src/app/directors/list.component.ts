import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Movie } from '@app/_models/movie';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    public movies = new Array<Movie>();

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        // var m = new Movie();
        // m.id = 1;
        // m.budget = 60000;
        // m.description = "Description";
        // m.end = new Date(); 
        // m.start = new Date();
        // m.name = "Die Easy";
        // m.duration = new Date();

        // this.movies?.push(m);
        this.accountService.getAllMovies()
            .pipe(first())
            .subscribe(movies => this.movies = movies);
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