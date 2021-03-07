import {AuthData} from './model/auth-data';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UIService} from '../shered/ui.service';

@Injectable()
export class AuthService {
  authSubject = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
  ) {
  }

  initAuthListener(): void {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authSubject.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authSubject.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true);
    this.angularFireAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(() => {
      this.uiService.loadingStateChanged.next(false);
    }).catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null as any, 4000);
    });
  }

  login(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true);
    this.angularFireAuth.signInWithEmailAndPassword(authData.email, authData.password).then(() => {
      this.uiService.loadingStateChanged.next(false);
    }).catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null as any, 4000);
    });
  }

  logout(): void {
    this.angularFireAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }


}
