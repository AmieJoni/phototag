import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Cartesian3, Color, PinBuilder } from 'cesium';
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';
import { Observable } from 'rxjs';
import { Photo } from './photo';

@Injectable({
  providedIn: 'root',
})
export class CesiumService {
  private viewer: Viewer | undefined;

  constructor(private firestore: Firestore) {}

  register(viewer: Viewer) {
    this.viewer = viewer;
  }

  private getPhotos(): Observable<Photo[]> {
    const photosRef = collection(this.firestore, 'photos');
    return collectionData(photosRef, { idField: 'id' }) as Observable<Photo[]>;
  }

  addPhotos() {
    const pinBuilder = new PinBuilder();

    this.getPhotos().subscribe((photos) => {
      photos.forEach((photo) => {
        const entity = {
          position: Cartesian3.fromDegrees(photo.lng, photo.lat),
          billboard: {
            image: pinBuilder
              .fromColor(Color.fromCssColorString('#de6b45'), 48)
              .toDataURL(),
          },
          description: `<img width="100%" style="margin:auto;display: block;" src="${photo.url}"/>`,
        };
        this.viewer?.entities.add(entity);
      });
    });
  }
}
