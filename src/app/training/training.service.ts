import {Exercise} from './model/exercise';
import {Subject} from 'rxjs';

export class TrainingService {
  private availableExercise: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  ];
  private runningExercise!: Exercise;
  exerciseChanged = new Subject<Exercise>();

  getAvailableExercise(): Exercise[] {
    return this.availableExercise.slice();
  }

  getRunningExercise(): Exercise {
    return {...this.runningExercise};
  }

  startExercise(selectedId: string): void {
    this.runningExercise = (this.availableExercise.find(ex => ex.id === selectedId) as Exercise);
    this.exerciseChanged.next({...this.runningExercise});
  }
}
