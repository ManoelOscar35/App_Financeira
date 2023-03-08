import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-balance-total-card',
  templateUrl: './balance-total-card.component.html',
  styleUrls: ['./balance-total-card.component.scss']
})
export class BalanceTotalCardComponent implements OnInit {

  totalRevenues!: number;
  totalDebts!: number;
  isPositive = true;
  isNegative = true;
  balanceTotalMinus: any;
  balanceTotalPlus: any;
  showBalanceTotal: any;
  balanceTotalZero: any;

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.getRevenuesTotal();
  }

  getRevenuesTotal() {
    this.storeService.getRevenuesTotal().subscribe({
      next: res => {
        this.totalRevenues = res;
        if(this.totalRevenues !== null) {
          this.getDebtsTotal();
        }
      }
    });
  }

  getDebtsTotal() {
    this.storeService.getDebtsTotal().subscribe({
      next: res => {
        this.totalDebts = res;
        if(this.totalDebts !== null) {
          this.getBalanceTotal();
        }
      }
    });
  }

  getBalanceTotal() {
    this.storeService.getBalanceTotal().subscribe({
      next: res => {
        if(res) {
          if(this.totalDebtLessThanIcome()) {
            const result = Number(this.totalDebts) - Number(this.totalRevenues);
            this.isPositive = true;
            this.isNegative = false;
            this.setDebtMinusIcome(result);
            this.setDebtMinusIcomeVariable();
          } else if(this.totalDebtGreaterThanIcome()) {
            const result = Number(this.totalDebts) - Number(this.totalRevenues);
            this.isNegative = true;
            this.isPositive = false;
            this.setDebtPlusIcome(result);
            this.setDebtPlusIcomeVariable();
          } else if(this.totalDebtEqualRevenues()) {
            this.isNegative = false;
            this.isPositive = false;
            this.setDebtBalanceZero();
            this.setDebtBalanceZeroVariable(); 
          } else if(this.totalEqualsZero()) {
            this.isNegative = false;
            this.isPositive = false;
            this.setDebtBalanceZero();
            this.setDebtBalanceZeroVariable(); 
          }
        }
      }
    });
  }

  setDebtMinusIcome(value: number) {
    this.balanceTotalMinus = {
      title: 'Saldo Total',
      value: Math.abs(value)
    }
  }

  setDebtMinusIcomeVariable() {
    this.showBalanceTotal = this.balanceTotalMinus;
  }

  setDebtPlusIcome(value: number) {
    this.balanceTotalPlus = {
      title: 'Saldo Total',
      value: -Math.abs(value)
    }

    
  }

  setDebtPlusIcomeVariable() {
    this.showBalanceTotal = this.balanceTotalPlus;
  }

  setDebtBalanceZero() {
    this.balanceTotalZero = {
      title: 'Saldo Total',
      value: 0
    }

       
  }

  setDebtBalanceZeroVariable() {
    this.showBalanceTotal = this.balanceTotalZero;
  }

  totalDebtGreaterThanIcome(): any {
    if(this.totalDebts > this.totalRevenues) {
      return true;
    } else {
      return false;
    }
  }

  totalDebtLessThanIcome(): any {
    if(this.totalDebts < this.totalRevenues) {
      return true;
    } else {
      return false;
    }
  }

  totalEqualsZero(): any {
    this.totalDebts = 0;
    this.totalRevenues = 0;
    if(this.totalDebts == 0 && this.totalRevenues == 0) {
      return true;
    } else {
      return false;
    }
  }

  totalDebtEqualRevenues() {
    if(this.totalDebts == this.totalRevenues) {
      return true;
    } else {
      return false;
    }
      
  }
}
