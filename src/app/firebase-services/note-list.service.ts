import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  items$; // Dollarzeichen schreiben Entwicklung um es kennzeichen zu können, dass es ein "observable" ist (Beobachter). Man könnte genausogut auch einen anderen Buchstanben nehmen...
  items;


  firestore: Firestore = inject(Firestore);


  constructor() {
    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);        
      });
    })
    this.items.unsubscribe();
   }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colID: string, docId:string) {
    return doc(collection(this.firestore, colID), docId);
  }

}
