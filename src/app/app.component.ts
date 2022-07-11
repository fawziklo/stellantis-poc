import { Component, OnInit } from '@angular/core';
import { AzureSearchService } from 'src/services/azure-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() { }
  title = 'Stellantis Search Engine';

  ngOnInit(): void {
  }
}
