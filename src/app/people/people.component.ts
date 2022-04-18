import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from './people.model';
import { PeopleService } from './people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  person$!: Observable<Person>

  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.person$ = this.peopleService.timer();
  }

  changePerson() {
    this.person$ = this.peopleService.timer();
  }

  stopPerson() {
    this.peopleService.stop()
  }

  startPerson() {
    this.peopleService.start()
  }
}
