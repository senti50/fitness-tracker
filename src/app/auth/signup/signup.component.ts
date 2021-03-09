import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UIService} from '../../shered/ui.service';
import {Observable} from 'rxjs';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading$: Observable<boolean>;
  // private loadingSubscription = new Subscription();

  maxDate: Date;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading =>
    //   this.isLoading = isLoading);
    this.store.select(fromRoot.getIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
    console.log(form);
  }

  // ngOnDestroy(): void {
  //   this.loadingSubscription?.unsubscribe();
  // }

}
