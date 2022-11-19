import { Injectable } from '@angular/core';
import { addDoc, Firestore } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import {
  collection,
  CollectionReference,
  DocumentData,
} from '@firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photoCollection: CollectionReference<DocumentData>;
  constructor(private firestore: Firestore, private storage: Storage) {
    this.photoCollection = collection(this.firestore, 'photos');
  }

  private async getLocation() {
    const location = await Geolocation.getCurrentPosition();
    return location.coords;
  }

  async takePhoto() {
    const { latitude, longitude } = await this.getLocation();
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });
    await this.savePhoto(cameraPhoto.dataUrl!, latitude, longitude);
  }

  private async savePhoto(data: string, latitude: number, longitude: number) {
    const name = new Date().getUTCMilliseconds().toString();
    console.log(name, latitude, longitude);
    const uploadRef = ref(this.storage, name);
    console.log(data);
    const upload = await uploadString(uploadRef, data, 'data_url');
    const photoUrl = await getDownloadURL(uploadRef);

    addDoc(this.photoCollection, {
      url: photoUrl,
      lat: latitude,
      lng: longitude,
    });
  }
}
