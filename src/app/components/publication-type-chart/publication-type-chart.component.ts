import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-publication-type-chart',
  standalone: true,
  imports: [],
  templateUrl: './publication-type-chart.component.html',
  styleUrl: './publication-type-chart.component.css'
})
export class PublicationTypeChartComponent implements OnInit {

  public chart: any;

  constructor(private publicationService: PublicationsService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.publicationService.getPublicationsByType().subscribe((data: any) => {
      console.log(data); // Vérifiez ce que vous recevez du backend
      const publicationTypes = data.data.map((item: any) => item.typeName);
      const publicationCounts = data.data.map((item: any) => item.count);

      this.chart = new Chart('publicationTypeChart', {
        type: 'bar',
        data: {
          labels: publicationTypes,
          datasets: [{
            label: 'Nombre de publications',
            data: publicationCounts,
            backgroundColor: 'rgba(184, 41, 41, 0.944)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
