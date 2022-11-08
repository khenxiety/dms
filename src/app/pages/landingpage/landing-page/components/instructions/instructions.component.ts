import { Component, OnInit } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  providers: [MarkdownService],
})
export class InstructionsComponent implements OnInit {
  aboutContent: Array<any> = [];
  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const aboutContent = collection(this.firestore, 'about');

    getDocs(aboutContent).then((res) => {
      this.aboutContent = [
        ...res.docs.map((doc: any) => {
          return { id: doc.id, ...doc.data() };
        }),
      ];
    });
  }
}
