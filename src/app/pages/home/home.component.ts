import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country, Participation } from 'src/app/core/models/olympic.model';  
import { Router } from '@angular/router';

// Définir une interface pour le type de données du graphique
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
  public chartData: ChartData[] = []; // Typage du tableau chartData
  private subscription: Subscription = new Subscription();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    const olympicsSubscription = this.olympicService.loadInitialData().subscribe(() => {
      const dataSubscription = this.olympicService.getOlympics().subscribe((data: Country[] | undefined) => {
        if (data) {
          this.chartData = data.map(country => ({
            name: country.country,
            value: country.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)
          }));
        } else {
          console.warn('Aucune donnée disponible.');
        }
      });
      this.subscription.add(dataSubscription);
    });
    this.subscription.add(olympicsSubscription);
  }

  onChartSelect(event: { name: string }): void { // Typage de l'événement
    this.router.navigate(['/details', event.name]); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
