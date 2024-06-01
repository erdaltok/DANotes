import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
  
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNoteList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
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

  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
    this.unsubMarkedNotes();
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
    const q = query(this.getNotesRef(),limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
  //     list.docChanges().forEach((change) => {
  //   if (change.type === "added") {
  //       console.log("New note: ", change.doc.data());
  //   }
  //   if (change.type === "modified") {
  //       console.log("Modified note: ", change.doc.data());
  //   }
  //   if (change.type === "removed") {
  //       console.log("Removed note: ", change.doc.data());
  //   }
  // });
    });
  }

  // subNoteList() {
  //   let ref = collection(this.firestore, "notes/o4a1Yu3jxEMML9QCr1dm/notesExtra"); // Für DA Bubble ggf. benötigt
  //   const q = query(ref,limit(100));
  //   return onSnapshot(q, (list) => {
  //     this.normalNotes = [];
  //     list.forEach(element => {
  //       this.normalNotes.push(this.setNoteObject(element.data(), element.id));         
  //     })
  //   });    
  // }





  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true),  limit(100));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));        
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
