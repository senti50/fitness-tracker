import {Exercise} from './model/exercise';
import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UIService} from '../shered/ui.service';

@Injectable()
export class TrainingService {
  private availableExercise: Exercise[] = [];
  private runningExercise!: Exercise | null;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchAvailableExercise(): void {
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
        this.availableExercise = exercises;
        this.exercisesChanged.next([...this.availableExercise]);
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 4000);
        this.exercisesChanged.next(null);
      }));
  }

  fetchCompletedOrCanceledExercise(): void {
    this.firebaseSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: any) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  getRunningExercise(): Exercise {
    return {...this.runningExercise} as Exercise;
  }

  completedExercise(): void {
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'} as Exercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null as any);
  }

  canceledExercise(progress: number): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'cancelled',
      duration: this.runningExercise!.duration * (progress / 100),
      calories: this.runningExercise!.calories * (progress / 100)
    } as Exercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null as any);

  }

  startExercise(selectedId: string): void {
    // this.db.doc('availableExercises' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = (this.availableExercise.find(ex => ex.id === selectedId) as Exercise);
    this.exerciseChanged.next({...this.runningExercise});
  }

  private addDataToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions(): void {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
