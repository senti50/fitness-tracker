import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UIService {
  // loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {
  }

  showSnackbar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
