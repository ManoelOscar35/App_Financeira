import { Component } from '@angular/core';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-months-debts',
  templateUrl: './months-debts.component.html',
  styleUrls: ['./months-debts.component.scss']
})
export class MonthsDebtsComponent {

  month!: string;
  arrowLeft = '../../../assets/images/arrow-left.png';
  arrowRight = '../../../assets/images/arrow-right.png';
  months: string[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  i!: number;

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.getMonthCurrent();

    this.storeService.getDebtsPrev().subscribe({
      next: res => {
        if(res) {
          this.prevWithoutRevenues();
        }
      }
    });

    this.storeService.getDebtsNext().subscribe({
      next: res => {
        if(res) {
          this.nextWithoutRevenues();
        }
      }
    });
    
  }

  findIndexElement() {
    let returnIndex = this.months.findIndex(item => item === this.month);
    this.i = returnIndex;
  }

  getMonthCurrent() {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'});
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1);
    this.month = letterDateString;
    this.storeService.setStoreMonth(this.month);
  }

  prev() {
    this.findIndexElement();
    if(this.i === 0) {
      this.i = 12 - 1;
    } else {
      this.i = this.i - 1;
    }
    this.month = this.months[this.i];
    this.storeService.setStoreMonth(this.months[this.i]);
    this.storeService.setSearchDebtsByMonth(true);
    this.storeService.setRevenuesPrev(true);
  }

  prevWithoutRevenues() {
    this.findIndexElement();
    if(this.i === 0) {
      this.i = 12 - 1;
    } else {
      this.i = this.i - 1;
    }
    this.month = this.months[this.i];
    this.storeService.setStoreMonth(this.months[this.i]);
    this.storeService.setSearchDebtsByMonth(true);
    this.storeService.setSearchRevenuesByMonth(true);
  }

  next() {
    this.findIndexElement();
    if(this.i === 11) {
      this.i = 0;
    } else {
      this.i = this.i + 1;
    }
    this.month = this.months[this.i];
    this.storeService.setStoreMonth(this.months[this.i]);
    this.storeService.setSearchDebtsByMonth(true);
    this.storeService.setRevenuesNext(true);
  }

  nextWithoutRevenues() {
    this.findIndexElement();
    if(this.i === 11) {
      this.i = 0;
    } else {
      this.i = this.i + 1;
    }
    this.month = this.months[this.i];
    this.storeService.setStoreMonth(this.months[this.i]);
    this.storeService.setSearchDebtsByMonth(true);
    this.storeService.setSearchRevenuesByMonth(true);
  }
}
