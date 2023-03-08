import { DialogRef } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/interface/category';
import { UpdateRevenues } from 'src/app/interface/updateRevenues';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-update-revenues',
  templateUrl: './update-revenues.component.html',
  styleUrls: ['./update-revenues.component.scss']
})
export class UpdateRevenuesComponent {

  form!: FormGroup;
  typeRevenue!: string;
  month!: string;
  categories!: Category[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private apiService: ApiService,
    private storeService: StoreService,
    private dialogRef: DialogRef<UpdateRevenuesComponent>
  ) {

  }

  ngOnInit() {
    console.log(this.data);
    this.initForm();
    this.fillData();
    this.preventFutureDate();

    this.categories = [
      {
        name: 'Investimento'
      },
      {
        name: 'Outros'
      },
      {
        name: 'Férias'
      },
      {
        name: '13° Salário'
      },
      {
        name: 'PLR'
      },
      {
        name: 'Aposentadoria'
      },
      {
        name: 'Salário'
      }
    ]

    this.storeService.getStoreMonth().subscribe({
      next: (res: any) => {
        this.month = res;
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      typeRevenue: [null, Validators.required],
      value: [null, Validators.required],
      dateEntry: [null, Validators.required]
    })
  }

  fillData() {
    if(this.data) {
      this.typeRevenue = this.data.data?.typeRevenue;
      this.form.patchValue({
        typeRevenue: this.data.data?.typeRevenue,
        value: this.data.data?.value,
        dateEntry: this.data.data?.dateEntry
      });
    }
  }

  preventFutureDate() {
    const inputDate = this.document.querySelector('#dateEntry');
    
    let date = new Date();

    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    let year: any = date.getFullYear();

    if(month < 10) {
      month = '0' + month.toString();
    }

    if(day < 10) {
      day = '0' + day.toString()
    }

    let maxDate = year + '-' + month + '-' + day;
    inputDate.max = maxDate;
  }

  submit() {
    const categoryInput = this.getValueControl(this.form, 'typeRevenue');

    if(!categoryInput) {
      this.form.patchValue({
        typeRevenue: this.typeRevenue
      })
    }

    if(this.isValidForm()) {
      let typeRevenue = this.getValueControl(this.form, 'typeRevenue');
      let value = this.getValueControl(this.form, 'value');
      let dateEntry = this.getValueControl(this.form, 'dateEntry');
      let user = this.localStorageService.getLocalStorage('user');

      const payload = {
        user: {
          title: user,
          month: {
            title: this.month,
            listMonth: {
              typeRevenue,
              value,
              dateEntry
            }
          }
        }
      }

      this.apiService.updateRevenues(this.data.data._id, payload)
        .subscribe({
          next: (res: UpdateRevenues) => {
            if(res) {
              this.storeService.setStoreRevenues(true)
            } 
          }
        });
    }

    this.dialogRef.close();
  }

  getValueControl(form: FormGroup, control: string) {
    return form.controls[control].value;
  }

  isValidForm(): boolean {
    return this.form.valid;
  }
}
