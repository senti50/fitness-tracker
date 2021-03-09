import {Exercise} from './model/exercise';
import {Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UIService} from '../shered/ui.service';
import * as fromTraining from './training.reducer';
import * as UI from '../shered/ui.actions';
import {Store} from '@ngrx/store';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {
  }

  fetchAvailableExercise(): void {
    this.store.dispatch(new UI.StartLoading());
    this.firebaseSubscriptions.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray: any[]) => {
          return docArray.map((doc) => {
            return {
              ...(doc.payload.doc.data() as Exercise),
              id: doc.payload.doc.id
            };
          });
        })
      ).subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTraining(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 4000);
      }));
  }

  fetchCompletedOrCanceledExercise(): void {
    this.firebaseSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTraining(exercises));
      }));
  }

  completedExercise(): void {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
    });
    this.store.dispatch(new Training.StopTraining());
  }

  canceledExercise(progress: number): void {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'cancelled',
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100)
        });
        this.store.dispatch(new Training.StopTraining());
      }
    );
  }

  startExercise(selectedId: string): void {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  private addDataToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions(): void {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
