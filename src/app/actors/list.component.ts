import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Movie } from '@app/_models/movie';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    currentRolesMovies = new Array<Movie>();
    availableMovies = new Array<Movie>();
    actorId?: number;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.actorId = this.accountService.userValue?.id;

        // form with validation rules
        this.form = this.formBuilder.group({
            budget: [10000, Validators.required]
        });
        if (this.actorId) {
            this.accountService.getById(this.actorId)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
            this.accountService.getCurrentRolesInMovies(this.actorId)
                .pipe(first())
                .subscribe(x => {
                    this.currentRolesMovies = x as Array<Movie>;
                });
            this.accountService.getAllMovies()
                .pipe(first())
                .subscribe(movies => this.availableMovies = movies as Array<Movie>);
        }
    }

    deleteCurrentRolesMovies(id: number) {
        // const currentRolesMovies = this.currentRolesMovies!.find(x => x.id === id);
        // if(currentRolesMovies) {
        // currentRolesMovies.isDeleting = true;
        // this.accountService.deleteCurrentRolesMovies(id)
        //     .pipe(first())
        //     .subscribe(() => this.currentRolesMovies = this.currentRolesMovies!.filter(x => x.id !== id));
        // }
    }
    sendMovieRequest(id: number) {
        // const currentRolesMovies = this.currentRolesMovies!.find(x => x.id === id);
        // if(currentRolesMovies) {
        // currentRolesMovies.isDeleting = true;
        // this.accountService.deleteSentMovieRequest(id)
        //     .pipe(first())
        //     .subscribe(() => this.currentRolesMovies = this.currentRolesMovies!.filter(x => x.id !== id));
        // }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        return this.actorId
            ? this.accountService.update(this.actorId!, this.form.value)
            : this.accountService.register(this.form.value);
    }

    public isExpired(movie: Movie) {
        if (movie.start) {
            return !(new Date(movie.start).getTime() < new Date().getTime());
        }
        return true;
    }
}

function moment(experationDate: any) {
    throw new Error('Function not implemented.');
}
