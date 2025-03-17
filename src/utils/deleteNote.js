// src/utils/deleteNote.js
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // adjust the relative path as needed

export const deleteNote = async (noteId) => {
  const noteRef = doc(db, "Notes", noteId);
  await updateDoc(noteRef, { deleted: true });
};
