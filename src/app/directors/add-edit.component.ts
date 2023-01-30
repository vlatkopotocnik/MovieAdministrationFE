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

            var m = new Movie();
            m.id = 1;
            m.budget = 60000;
            this.budgetBalance = m.budget;
            m.description = "Description";
            m.end = "2019-01-16";  
            m.start = "2019-01-16";  
            m.name = "Die Easy";
            m.duration = new Date().toLocaleTimeString();;
            this.loading = false;
            this.form.patchValue(m);
            // this.accountService.getMovieById(this.movie.id)
            //     .pipe(first())
            //     .subscribe(x => {
            //         this.form.patchValue(x);
            //         this.loading = false;
            //     });
            var a = new User();
            a.firstName = "FristName";
            a.id = 1;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 10000;
            this.allActors?.push(a);            var a = new User();
            a.firstName = "FristName";
            a.id = 2;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 10000;
            this.allActors?.push(a);            var a = new User();
            a.firstName = "FristName";
            a.id = 3;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 10000;
            this.allActors?.push(a);            var a = new User();
            a.firstName = "FristName";
            a.id = 4;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 10000;
            this.allActors?.push(a);
            var a = new User();
            a.firstName = "FristName";
            a.id = 5;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 10000;
            this.allActors?.push(a);
            var a = new User();
            a.firstName = "FristName";
            a.id = 6;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 20000;
            this.actorsRequest?.push(a);
            var a = new User();
            a.firstName = "FristName";
            a.id = 7;
            a.isActing = false;
            a.lastName = "LastName";
            a.budget = 40000;
            this.actorsRequest?.push(a);
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