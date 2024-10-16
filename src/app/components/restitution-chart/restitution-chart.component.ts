import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-restitution-chart',
  standalone: true,
  imports: [],
  templateUrl: './restitution-chart.component.html',
  styleUrl: './restitution-chart.component.css'
})
export class RestitutionChartComponent implements OnInit {

  public chart: any;

  constructor(private publicationService: PublicationsService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.publicationService.getRestitutionData().subscribe((data: any) => {
      const restitutionCount = data.restitutionCount;
      const publicationCount = data.publicationCount;

      this.chart = new Chart('restitutionChart', {
        type: 'pie', // Utiliser 'pie' pour un graphique circulaire
        data: {
          labels: ['Demandes de restitution', 'Publications restantes'],
          datasets: [{
            label: 'Ratio demandes de restitution',
            data: [restitutionCount, publicationCount - restitutionCount], // Évaluer le pourcentage de demandes
            backgroundColor: [
              'rgba(12, 209, 31, 0.944)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            }
          }
        }
      });
    });
  }

}
