import {AuthData} from './model/auth-data';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UIService} from '../shered/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shered/ui.actions';
import {SetAuthenticated, SetUnauthenticated} from '../auth/auth.actions';

@Injectable()
export class AuthService {
  // authSubject = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<{ ui: fromRoot.State }>
  ) {
  }

  initAuthListener(): void {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authSubject.next(true);
        this.store.dispatch(new SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authSubject.next(false);
        this.store.dispatch(new SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(() => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 4000);
    });
  }

  login(authData: AuthData): void {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth.signInWithEmailAndPassword(authData.email, authData.password).then(() => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 4000);
    });
  }

  logout(): void {
    this.angularFireAuth.signOut();
  }

  // isAuth(): boolean {
  //   return this.isAuthenticated;
  // }


}
