import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteRevenues } from 'src/app/interface/deleteRevenues';
import { ListRevenues } from 'src/app/interface/listRevenues';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { StoreService } from 'src/app/shared/store.service';
import { AddRevenuesComponent } from '../add-revenues/add-revenues.component';
import { UpdateRevenuesComponent } from '../update-revenues/update-revenues.component';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.scss']
})
export class RevenuesComponent implements OnInit, AfterViewInit{

  monthSelected!: string;
  user!: string;
  loading: boolean = false; 
  emptyResult: boolean = false;
  arrRevenues: any[] = [];
  displayedColumns: string[] = [
    "tipoReceita",
    "valor",
    "dataEntrada",
    "_id",
    "acoes"
  ];
  public dataSource = new MatTableDataSource<any>();
  totalRevenues!: any;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private storeService: StoreService,
    private localStorageService: LocalstorageService,
    private apiService: ApiService    
    ) {

  }

  ngOnInit() {
    this.defineInitMonth();
    this.storeService.getStoreRevenues().subscribe({
      next: res => {
        if(res) {
          this.getRegisterRevenues(this.monthSelected)
        }
      }
    });

    
  }

  ngAfterViewInit() {
    this.storeService.getStoreMonth().subscribe({
      next: res => {
        this.monthSelected = res;
      }
    });

    this.getRegisterRevenues(this.monthSelected);

    this.storeService.getSearchRevenuesByMonth().subscribe({
      next: (res: boolean) => {
        if(res) {
          this.getRegisterRevenues(this.monthSelected);
        }
      }
    });

    
  }

  getRegisterRevenues(monthSelected: string) {
    this.user = this.localStorageService.getLocalStorage('user');
    this.apiService.getRegisterRevenues(monthSelected, this.user)
      .subscribe({
        next: (res: ListRevenues) => {
          this.loading = true;

          let arr: any[] = [];

          if(res.result.length === 0) {
            this.emptyResult = true;
            this.arrRevenues = [];
            this.totalExpense();
          } else {
            this.emptyResult = false;
            this.arrRevenues = arr;

            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            }, 2001);

            let e = (element: any) => {
              arr.push(element.user.month.listMonth);
            }

            res.result.forEach(e);
            this.totalExpense()
          }

          setTimeout(() => {
            this.dataSource.data = arr;
            this.dataSource.paginator = this.paginator;
            this.loading = false;
          }, 2000);
        }
      });
  }

  openDialog() {
    this.dialog.open(AddRevenuesComponent, {
      width: '600px',
      data: {
        any: ''
      }
    });
  }

  applyFilter(event: any) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValues.trim().toLocaleLowerCase();
  }

  selectAction(action: string, element: any) {
    if(action.indexOf('edit.png') != -1) {
      this.dialog.open(UpdateRevenuesComponent, {
        width: '600px',
        data: {
          data: element
        }
      })
    } else {
      const question = confirm("Tem certeza que deseja excluir essa receita?");

      if(question) {
        this.apiService.deleteRevenues(element._id)
          .subscribe({
            next: (res: DeleteRevenues) => {
              if(res) {
                this.storeService.setStoreRevenues(true);
              }
            }
          });
      }
    }
  }

  defineInitMonth() {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'});
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1);
    this.monthSelected == undefined ? (this.monthSelected = letterDateString) : this.monthSelected;
  }

  generateTotalExpenseArray() {
    let total = this.arrRevenues.map(total => Number(total.value));
    return total;
  }

  totalExpense() {
    let totalArr = this.generateTotalExpenseArray();
    this.totalRevenues = totalArr.reduce((total, num) => total + num, 0);
    
    const dataBalanceRevenues = {
      data: {
        title: 'Total Receitas',
        total: this.totalRevenues
      }
    }

    this.storeService.setBalanceRevenuesTotal(dataBalanceRevenues)
  }
}
