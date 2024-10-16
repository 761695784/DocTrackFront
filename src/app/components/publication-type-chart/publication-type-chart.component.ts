import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-publication-type-chart',
  standalone: true,
  imports: [],
  templateUrl: './publication-type-chart.component.html',
  styleUrls: ['./publication-type-chart.component.css']
})
export class PublicationTypeChartComponent implements OnInit {

  public chart: Chart | null = null; // Type explicite pour le graphique

  constructor(private publicationService: PublicationsService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.publicationService.getPublicationsByType().subscribe((data: any) => {
      console.log(data); // Vérifiez ce que vous recevez du backend
      const publicationTypes: string[] = data.data.map((item: any) => item.typeName);
      const publicationCounts: number[] = data.data.map((item: any) => item.count);

      // Définir les couleurs pour chaque type de document
      const colors: string[] = [
        'rgba(184, 41, 41, 0.944)', // Carte nationale d'identité
        'rgba(54, 162, 235, 1)', // Passeport
        'rgba(255, 206, 86, 0.2)', // Carte grise
        'rgba(75, 192, 192, 1)', // Diplômes Baccalauréat
        'rgba(153, 102, 255, 1)', // Carte bancaire
        'rgba(255, 159, 64, 1)', // Attestation d'assurance
        'rgba(255, 99, 132, 1)' // Carte d'étudiant
      ];

      // Créer un tableau de couleurs basé sur le nombre de publications
      const datasetColors: string[] = publicationCounts.map((_, index: number) => colors[index % colors.length]);

      this.chart = new Chart('publicationTypeChart', {
        type: 'bar',
        data: {
          labels: publicationTypes,
          datasets: [{
            label: 'Nombre de publications',
            data: publicationCounts,
            backgroundColor: datasetColors,
            borderColor: datasetColors.map(color => color.replace('0.944', '1')), // Ajuste la transparence pour la bordure
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
