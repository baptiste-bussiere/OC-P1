import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Participation } from 'src/app/core/models/olympic.model';

// Définir une interface pour représenter les données d'un pays
interface CountryData {
  country: string;
  participations: Participation[];
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit, OnDestroy {
  public countryData: CountryData | undefined;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('name');
    this.olympicService.loadInitialData().subscribe(() => {
      const olympicsSubscription = this.olympicService.getOlympics().subscribe((data: CountryData[] | undefined) => {
        this.countryData = data?.find((country) => country.country === countryName);
        if (this.countryData && this.countryData.participations) {
          this.totalMedals = this.countryData.participations.reduce(
            (acc: number, participation: Participation) => acc + participation.medalsCount,
            0
          );
          this.totalAthletes = this.countryData.participations.reduce(
            (acc: number, participation: Participation) => acc + participation.athleteCount,
            0
          );
        }
        this.cdr.markForCheck();
        // this.cdr.detectChanges();
      });
      this.subscription.add(olympicsSubscription);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  getCountryParticipationData() {
    if (!this.countryData || !this.countryData.participations) return [];
    const series = this.countryData.participations.map((participation: Participation) => ({
      name: participation.year.toString(),
      value: participation.medalsCount,
    }));
    return [{ name: this.countryData.country, series }];
  }
}
