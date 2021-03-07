import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../model/exercise';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];
  exercisesSubscription: Subscription;

  constructor(private trainingService: TrainingService) {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => this.exercises = exercises);
    this.trainingService.fetchAvailableExercise();
  }

  ngOnInit(): void {
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }

}
