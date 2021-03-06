import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StopTrainingComponent} from '../stop-training.component';
import {TrainingService} from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  @Output()
  trainingExit = new EventEmitter();
  progress = 0;
  timer!: number;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {
    this.startOrResumeTimer();
  }

  ngOnInit(): void {
  }

  startOrResumeTimer(): void {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      if (this.progress >= 100) {
        clearInterval(this.timer);
      } else {
        this.progress = this.progress + 20;
      }
    }, step);
  }

  onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {progress: this.progress}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingExit.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }

}
