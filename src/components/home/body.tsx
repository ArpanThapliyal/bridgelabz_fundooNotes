import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { router } from 'expo-router';

export default function Body({ pressed, setSelected, close_selected, set_Close_Selected }) {
  const [visible, setVisible] = useState(true);
  const [notes, setNotes] = useState([]);
  const [selectedItemsList, setSelectedItemsList] = useState([]);

  // Query for active notes (only those not marked as deleted)
  const colRef = collection(db, 'Notes');
  const q = query(
    colRef,
    where("deleted", "==", false),
    where("archived", "==", false)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.size > 0) {
        setVisible(false);
        const notesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotes(notesList);
      } else {
        setVisible(true);
        setNotes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Clear selection when close_selected flag is set
  useEffect(() => {
    if (close_selected) {
      setSelectedItemsList([]);
      setSelected([]);
      set_Close_Selected(false);
    }
  }, [close_selected, setSelected, set_Close_Selected]);

  const selectedItem = (id) => {
    if (close_selected) return;
    setSelectedItemsList((prevList) => {
      const newList = prevList.includes(id)
        ? prevList.filter((item) => item !== id)
        : [...prevList, id];
      setSelected(newList);
      return newList;
    });
  };

  // Render each note
  const noteItems = notes.map((note) => (
    <TouchableOpacity
      key={note.id}
      style={[
        pressed ? styles.notelist2 : styles.notelist1,
        selectedItemsList.includes(note.id) && styles.selected
      ]}
      onPress={() => {
        router.push({
          pathname: '/text',
          params: { 
            noteId: note.id, 
            title: note.title, 
            description: note.description,
            date: note.date,
            time: note.time
          }
        });
      }}
      onLongPress={() => selectedItem(note.id)}
      delayLongPress={400}
    >
      <View>
        <Text style={[{ color:'white', fontSize: 18, fontWeight: "500", marginBottom: 6 }]}>
          {note.title}
        </Text>
        <Text style={{ color:'white', fontSize: 14 }}>{note.description}</Text>
        {note.date && note.time && (
          <View style={styles.reminderContainer}>
            <MaterialIcons name="alarm" size={12} color="#7f828a" />
            <Text style={styles.text}>  {note.date}</Text>
            <Text style={styles.text}>  {note.time}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ));

  return (
    <View style={pressed ? styles.main2 : styles.main1}>
      {visible ? (
        <View style={styles.watermark}>
          <ImageBackground
            style={styles.image}
            source={require('../../assets/google_keep.png')}
          />
          <Text style={styles.text}>Notes you add appear here</Text>
        </View>
      ) : (
        noteItems
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  main2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  watermark: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  image: {
    marginTop: 250,
    height: 160,
    width: 140,
  },
  text: {
    color: '#858a90',
    fontSize: 12,
  },
  notelist1: {
    backgroundColor: 'black',
    borderWidth: 0.4,
    borderColor: 'white',
    padding: 14,
    margin: 6,
    width: '45%',
    borderRadius: 10,
  },
  notelist2: {
    backgroundColor: 'black',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 14,
    margin: 6,
    width: '95%',
    borderRadius: 10,
  },
  selected: {
    borderColor: '#a0c6f4',
    borderWidth: 2.5,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#30353f',
    alignSelf: 'flex-start'
  },
});
