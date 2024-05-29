import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  
  firestore: Firestore = inject(Firestore);


  constructor() {
    this.unsubNotes = this.subNoteList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colID: 'notes' | 'trash', docId: string) {
    console.log(this.deleteNote);    
    await deleteDoc(this.getSingleDocRef(colID, docId)).catch(
      (err) => {
        console.log(err);}
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
      (err) => {
        console.log(err);
      }
    ).then(() => {
      
    });
    }
  }


  getCleanJson(note: Note) {
    return {
    type: note.type,
    title: note.title,
    content: note.content,
    marked: note.marked,
    }
  }

  getColIdFromNote(note: Note) {
      if (note.type == 'note') {
        return 'notes'
      } else {
        return 'trash'
      }
  }

  async addNote(item: Note, colID: "notes" | "trash") {
    if (colID == 'notes') {
      await addDoc(this.getNotesRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef);
        });
    } else {
      await addDoc(this.getTrashRef(), item);
    }
      
  }

  setNoteObject(obj: any, id: string): Note {
    return {
    id: id || "",
    type: obj.type || "note",
    title: obj.title || "",
    content: obj.content || "",
    marked: obj.marked || false,
    }
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();    
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));        
      })
    });
  }

  subNoteList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));        
      })
    });
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
