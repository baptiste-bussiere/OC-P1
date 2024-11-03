import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Country } from 'src/app/core/models/olympic.model'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Country[] | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error('Erreur de chargement des données:', error);
        this.olympics$.next([]); 
        return of([]); 
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
