import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDebts } from 'src/app/interface/deleteDebts';
import { ListDebts } from 'src/app/interface/listDebts';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { StoreService } from 'src/app/shared/store.service';
import { AddDebtsComponent } from '../add-debts/add-debts.component';
import { UpdateDebtsComponent } from '../update-debts/update-debts.component';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent implements OnInit, AfterViewInit {

  user!: string;
  loading: boolean = false;
  emptyResult: boolean = false;
  arrDebts: any[] = [];
  monthSelected!: string;
  displayedColumns: string[] = [
    'divida',
    'categoria',
    'valor',
    'dataVencimento',
    '_id',
    'acoes'
  ];

  public dataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator;
  totalDebts!: any;

  constructor(
    private dialog: MatDialog,
    private localStorageService:  LocalstorageService,
    private apiService: ApiService,
    private storeService: StoreService
    
  ) {}

  ngOnInit() {
    this.defineInitMonth();
    this.storeService.getStoreMonth().subscribe({
      next: res => {
        if(res) {
          this.monthSelected = res;
        }
      }
    });

    this.storeService.getStoreDebts().subscribe({
      next: res => {
        if(res) {
          this.getRegisterDebts(this.monthSelected)
        }
      }
    });
  }

  
  ngAfterViewInit() {
    this.getRegisterDebts(this.monthSelected);

    this.storeService.getSearchDebtsByMonth().subscribe({
      next: (res: boolean) => {
        if(res) {
          this.getRegisterDebts(this.monthSelected);

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 3000);
        }
      }
    });
  }

  openDialog() {
    this.dialog.open(AddDebtsComponent, {
      width: '600px'
    });
  }

  getRegisterDebts(monthSelected: string) {
    this.user = this.localStorageService.getLocalStorage('user');
    this.apiService.getRegisterDebts(monthSelected, this.user)
      .subscribe({
        next: (res: ListDebts) => {
          this.loading = true;

          let arr: any[] = [];

          if(res.result.length === 0) {
            this.emptyResult = true;
            this.arrDebts = [];
            this.totalExpense();
          } else {
            this.emptyResult = false;
            this.arrDebts = arr;

            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            }, 2001);

            let e = (element: any) => {
              arr.push(element.user.month.listMonth);
            }

            res.result.forEach(e);

            this.totalExpense();
          }

          setTimeout(() => {
            this.dataSource.data = arr;
            this.dataSource.paginator = this.paginator;
            this.loading = false;
          }, 2000);
        }
      });
  }

  defineInitMonth() {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'});
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1);
    this.monthSelected == undefined ? (this.monthSelected = letterDateString) : this.monthSelected;
  }

  applyFilter(event: any) {
    const filesValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filesValues.trim().toLocaleLowerCase();
  }

  selectAction(action: string, element: any) {
    if(action.indexOf('edit.png') != -1) {
      this.dialog.open(UpdateDebtsComponent, {
        width: '600px',
        data: {
          data: element
        }
      })
    } else {
      const question = confirm("Tem certeza que deseja excluir essa dívida?");

      if(question) {
        this.apiService.deleteDebts(element._id)
          .subscribe({
            next: (res: DeleteDebts) => {
              if(res) {
                this.storeService.setStoreDebts(true);
              }
            }
          });
      }
    }
  }

  generateTotalExpenseArray() {
    let total = this.arrDebts.map((total: any) => Number(total.value));
    return total;
  }

  totalExpense() {
    let totalArr = this.generateTotalExpenseArray();
    this.totalDebts = totalArr.reduce((total: any, num: any) => total + num, 0);
    
    const dataBalanceDebts = {
      data: {
        title: 'Total Dívidas',
        total: this.totalDebts
      }
    }

    this.storeService.setBalanceDebtsTotal(dataBalanceDebts)
  }
}
