import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private apiService: ApiService,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const { _id } = this.localStorageService.getLocalStorage('userInfo');
    console.log(_id)
    this.apiService.getUser(_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          console.log(res)
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
}
}
