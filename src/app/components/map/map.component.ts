import { AfterViewInit, Component } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  private map!: maplibregl.Map;

  constructor(private publicationsService: PublicationsService) {}

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    this.map = new maplibregl.Map({
      container: 'map', // ID de l'élément HTML où la carte sera rendue
      style: 'https://demotiles.maplibre.org/style.json', // URL du style de carte MapLibre
      center: [-17.4467, 14.6928], // Longitude et latitude pour centrer la carte sur le Sénégal
      zoom: 6 // Niveau de zoom initial
    });

    // Récupérer et afficher les publications par région
    this.publicationsService.getPublicationsByLocation().subscribe(data => {
      data.forEach(location => {
        new maplibregl.Marker()
          .setLngLat([+location.longitude, +location.latitude])
          .setPopup(new maplibregl.Popup().setHTML(`<h5>${location.name}</h5><p>Publications: ${location.publications}</p>`))
          .addTo(this.map);
      });
    });
  }

}
