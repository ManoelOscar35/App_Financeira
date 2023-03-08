import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginUser } from 'src/app/interface/loginUser';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ContinuationRegisterComponent } from '../continuation-register/continuation-register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  formRegister!: FormGroup;
  formLogin!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService,
    private LocalStorageService: LocalstorageService,
    private utilService: UtilsService,
    private router: Router
    ) {

  }

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.formRegister = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      age: [null, Validators.required]
    })

    this.formLogin = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    })
  }

  openDialogRegister() {
    this.dialog.open(ContinuationRegisterComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        data: this.createDataDialog()
      }
    })
  }

  login() {
    if(this.isValidForm()) {
      const { email } = this.createPayload();
      this.apiService.loginUser(this.createPayload())
       .pipe(takeUntil(this.destroy$))
       .subscribe({
        next: (res: LoginUser) => {
          const {token} = res
          this.LocalStorageService.setLocalStorage('token', JSON.stringify(token))
          this.LocalStorageService.setLocalStorage('user', JSON.stringify(email))
          this.utilService.showSuccess('Login realizado com sucesso!')
          this.navigateUrl('dashboard')
        }
       })
    }
  }

  navigateUrl(url: string) {
    this.router.navigate([`/${url}`])
  }

  isValidForm(): boolean {
    return this.formLogin.valid;
  }

  createPayload(
    email = this.getValueControl(this.formLogin, 'email'),
    password = this.getValueControl(this.formLogin, 'password')
  ) {
    const payload = {
      email,
      password
    }

    return payload;
  }

  createDataDialog(
    name = this.getValueControl(this.formRegister, 'name'),
    email = this.getValueControl(this.formRegister, 'email'),
    age = this.getValueControl(this.formRegister, 'age')) {

    const dataDialog = {
      name,
      email,
      age
    }

    return dataDialog;

  }

  getValueControl(form: FormGroup, control: string) {
    return form.controls[control].value;
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
  }

}
