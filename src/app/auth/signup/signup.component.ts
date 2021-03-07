import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UIService} from '../../shered/ui.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription = new Subscription();

  maxDate: Date;

  constructor(private authService: AuthService, private uiService: UIService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading =>
      this.isLoading = isLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
    console.log(form);
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

}
