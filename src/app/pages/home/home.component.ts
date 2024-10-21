import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country, Participation } from 'src/app/core/models/olympic.model';  
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  public olympics$: Observable<Country[]> = of([]);
  public chartData: any[] = [];

  constructor(private olympicService: OlympicService,private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data: Country[]) => {
      this.chartData = data.map(country => ({
        name: country.country,
        value: country.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)
      }));
    });
  }
  onChartSelect(event: any): void {
    console.log(event);  
  
    this.router.navigate(['/details', event.name]); 
  }
  
}
