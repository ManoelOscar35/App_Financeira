import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DownloadImage } from 'src/app/interface/downloadImage';
import { ApiService } from 'src/app/services/api.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  messageHour!: string;
  showNameUser!: string;
  isDefaultImage = '../../../../../assets/images/default.png';
  imageUser!: SafeResourceUrl;
  imageBase64!: string;

  constructor(
      private localStorageService: LocalstorageService,
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router
    ) {

  }

  ngOnInit() {
    this.getNameUser();
    this.getImageUser();
  }

  getMessageHour(message: string) {
    this.messageHour = message;
  }

  getNameUser() {
    const nameUser = this.localStorageService.getLocalStorage('userInfo')
    this.showNameUser = nameUser.name;
  }

  getImageUser() {
    const nameImage = this.localStorageService.getLocalStorage('userInfo');
    this.apiService.downloadImage(nameImage.image).subscribe({
      next: (res: DownloadImage) => {
        this.imageBase64 = res.image;
        let url = 'data:image/jpg;base64,' + res.image;
        this.imageUser = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }

  logout() {
    this.localStorageService.removeLocalStorage('token');
    this.router.navigate(['/']);
  }
}
