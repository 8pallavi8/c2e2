import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { ARIA_LIVE_DELAY } from '@ng-bootstrap/ng-bootstrap/util/accessibility/live';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { ToolsService } from 'src/app/shared/services/tools.service';



@Component({
  selector: 'app-gendetails',
  templateUrl: './gendetails.component.html',
  styleUrls: ['./gendetails.component.scss']
})
export class GendetailsComponent implements OnInit {
  formGroup: FormGroup;
  inputTableDataSource: any;
  inputDisplayedColumns: string[] = ['option','select']
  dialogref: any;
  units:string = "squarefeet";
  textBoxData: string[] = ["bowling Aalley", "game arcades", "health club",
    "swimming", "disco", "gym", "gambling"];
  selecteditems: string[];


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private DialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.formGroup = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', Validators.compose([Validators.required])],
      ProjectName: ['', Validators.compose([Validators.required])],
      Country: ['', Validators.compose([Validators.required])],
      Province: ['', Validators.compose([Validators.required])],
      Location: ['', Validators.compose([Validators.required])],
      Buildingtype: ['', Validators.compose([Validators.required])],
      Categories: ['', Validators.compose([Validators.required])],
      Yearofconstruction: ['', Validators.compose([Validators.required])],
      Buildinggrossarea: ['', Validators.compose([Validators.required])],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors: ['', Validators.compose([Validators.required])],
      Occupanyhoursperweek: ['', Validators.compose([Validators.required])],
      Occupancypeople: new FormControl('', Validators.required),
      Electricitycost: ['', Validators.compose([Validators.required])],
      Fuelcost: ['', Validators.compose([Validators.required])]
    });
  }

  

  
  opendialog(): void {
    this.dialogref = this.dialog.open(DialogComponent, {
      width: '80%',
      autoFocus: false,
      data: {
        textBoxData: this.textBoxData,
        title: "sports"
      }
    }
    );
    this.dialogref.afterClosed().subscribe(result => {
      if (result.length > 0) {
        this.selecteditems = result;
      }

    }
    )

  }

}