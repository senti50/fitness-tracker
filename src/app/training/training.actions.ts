import {Action} from '@ngrx/store';
import {Exercise} from './model/exercise';

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available Training';
export const SET_FINISHED_TRAININGS = '[Auth] Set Finished Training';
export const START_TRAINING = '[Auth] Start Training';
export const STOP_TRAINING = '[Auth] Stop Training';

export class SetAvailableTraining implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;

  constructor(public payload: Exercise[]) {
  }
}

export class SetFinishedTraining implements Action {
  readonly type = SET_FINISHED_TRAININGS;

  constructor(public payload: Exercise[]) {
  }
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public payload: string) {
  }
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions = SetAvailableTraining | SetFinishedTraining |StartTraining | StopTraining;

