import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output()
  closeSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {
  }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onCloseSidenav(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }


}
