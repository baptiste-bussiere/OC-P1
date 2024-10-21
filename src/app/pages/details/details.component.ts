import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Participation } from 'src/app/core/models/olympic.model';  

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public countryData: any;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('name');
    this.olympicService.getOlympics().subscribe((data: any[]) => {
      this.countryData = data.find(country => country.country === countryName);
    });

  }

  getCountryParticipationData() {
    return this.countryData.participations.map((participation: Participation) => ({ 
      name: participation.year.toString(),  
      value: participation.medalsCount  
    }));
  }
  
  
}
