import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, filter, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country, Participation } from 'src/app/core/models/olympic.model';
import { Router } from '@angular/router';

interface ChartData {
  name: string;
  value: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public chartData$!: Observable<ChartData[]>;
  private subscriptions: Subscription[] = [];

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {

    this.chartData$ = this.olympicService.getOlympics().pipe(
      filter((data: Country[]) => data.length > 0),
      map((data: Country[]) => (data.map(country => ({
        name: country.country,
        value: country.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)
      }))
      )));
    }


  onChartSelect(event: { name: string }): void {
    this.router.navigate(['/details', event.name]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
