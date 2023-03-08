import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastrService: ToastrService) { }

  showSuccess(message: string) {
    this.toastrService.success(message);
  }

  showError(message: string) {
    this.toastrService.error(message);
  }
}
