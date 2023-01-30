import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Movie } from '@app/_models/movie';
import { User } from '@app/_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    title?: string;
    movie = new Movie();
    allActors = new Array<User>();
    actorsOnMovie = new Array<User>();
    actorsRequest = new Array<User>();
    loading = false;
    submitting = false;
    submitted = false;
    budgetBalance = 0;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.movie.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: [],
            duration: [],
            budget: [],
            start: [],
            end: [],
        });

        this.title = 'Add Movie';
        if (this.movie.id) {
            // edit mode
            this.title = 'Edit Movie';
            this.loading = true;
            this.accountService.getMovieById(this.movie.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
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
        this.saveMovie()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Movie saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/directors');
                },
                error: (error: string) => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveMovie() {
        // create or update movie based on id param
        return this.movie.id
            ? this.accountService.updateMovie(this.movie.id!, this.form.value)
            : this.accountService.addMovie(this.form.value);
    }

    public addActor(actor: User) {
        this.actorsOnMovie.push(actor);
        this.allActors.splice(this.allActors?.findIndex(actor => actor.id === actor.id), 1)
        this.budgetBalance = this.budgetBalance - actor.budget;
    }

    public removeActor(actor: User) {
        this.allActors.push(actor);
        this.actorsOnMovie.splice(this.allActors?.findIndex(actor => actor.id === actor.id), 1)
        this.budgetBalance = this.budgetBalance + actor.budget;
    }

    public confirmActorRequest(actor: User) {
        this.actorsOnMovie.push(actor);
        this.actorsRequest.splice(this.allActors?.findIndex(actor => actor.id === actor.id), 1)
        this.budgetBalance = this.budgetBalance - actor.budget;
    }

    public removeActorRequest(actor: User) {
        this.allActors.push(actor);
        this.actorsRequest.splice(this.allActors?.findIndex(actor => actor.id === actor.id), 1)
    }
}