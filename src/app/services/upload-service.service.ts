import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadServiceService {
  constructor(private storage: Storage) {}

  uploadFile(file: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const upload = from(uploadBytes(storageRef, file));

    return upload.pipe(switchMap((res) => getDownloadURL(res.ref)));
  }
}
