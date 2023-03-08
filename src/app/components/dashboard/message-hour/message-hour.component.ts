import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-hour',
  templateUrl: './message-hour.component.html',
  styleUrls: ['./message-hour.component.scss']
})
export class MessageHourComponent implements OnInit {

  @Output() messageHour = new EventEmitter();

  ngOnInit() {
    this.message();
  }

  message() {
    let hour = new Date().getHours();

    if(hour <= 5) {
      this.messageHour.emit("Boa madrugada!")
    } else if ( hour < 12) {
      this.messageHour.emit("Bom dia!")
    } else if ( hour < 18) {
      this.messageHour.emit("Boa tarde!")
    } else {
      this.messageHour.emit("Boa noite!")
      
    }
  }
}
