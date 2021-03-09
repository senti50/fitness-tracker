import {Component, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../model/exercise';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises!: Exercise[];
  exercisesSubscription: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {
  }

  fetchExercises(): void {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
       // this.isLoading = false;
        this.exercises = exercises;
      });
    this.trainingService.fetchAvailableExercise();
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.fetchExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }

  // ngOnDestroy(): void {
  //   this.exercisesSubscription?.unsubscribe();
  // }

}
