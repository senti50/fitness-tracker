import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output()
  closeSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.authSubscription = this.authService.authSubject.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnInit(): void {
  }

  onCloseSidenav(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
