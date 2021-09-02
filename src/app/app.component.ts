import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from './shared/services/confirmation-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }
  title = 'c2e2';
}
