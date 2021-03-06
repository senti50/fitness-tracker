
import {User} from './model/user';
import {AuthData} from './model/auth-data';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  authSubject = new Subject<boolean>();
  private user!: User | null;

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData): void {
    this.user = {email: authData.email, userId: (Math.random() * 1000).toString()};
    this.authSuccessfully();
  }

  login(authData: AuthData): void {
    this.user = {email: authData.email, userId: (Math.random() * 1000).toString()};
    this.authSuccessfully();
  }

  logout(): void {
    this.user = null;
    this.authSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): {} {
    return {...this.user};
  }

  isAuth(): boolean {
    return this.user != null;
  }

  private authSuccessfully(): void{
    this.authSubject.next(true);
    this.router.navigate(['/training']);
  }
}
