import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor(private firestore: Firestore) {}

  addLogsService(activity: any, userName: any, campus: any, idNumber: any) {
    const date = new Date();
    let logs = {
      activity: activity,
      userName: userName,
      campus: campus,
      timeCreated: date.toDateString(),

      idNumber: idNumber,
    };
    const dbinstance = collection(this.firestore, 'logs');
    addDoc(dbinstance, logs)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
