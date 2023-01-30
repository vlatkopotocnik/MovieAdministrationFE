import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Movie } from '@app/_models/movie';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    public movies = new Array<Movie>();

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        var m = new Movie();
        m.id = 1;
        m.budget = 60000;
        m.description = "Description";
        m.end = "2019-01-16";  
        m.start = "2019-01-16";  
        m.name = "Die Easy";
        m.duration = new Date().toLocaleTimeString();;

        this.movies?.push(m);
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