import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { onSnapshot, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Deleted = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

  // Query for notes that are marked as deleted
  const colRef = collection(db, "Notes");
  const q = query(colRef, where("deleted", "==", true));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setDeletedNotes(notesList);
    });
    return () => unsubscribe();
  }, []);

  // Toggle selection for a note
  const toggleSelection = (noteId) => {
    if (selectedItems.includes(noteId)) {
      setSelectedItems(selectedItems.filter((id) => id !== noteId));
    } else {
      setSelectedItems([...selectedItems, noteId]);
    }
  };

  // Permanently delete the selected notes
  const handlePermanentDeletionMultiple = () => {
    if (selectedItems.length === 0) return;
    Alert.alert(
      "Permanent Delete",
      `Are you sure you want to permanently delete ${selectedItems.length} selected note?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              for (let noteId of selectedItems) {
                await deleteDoc(doc(db, "Notes", noteId));
              }
              Alert.alert("Selected notes permanently deleted");
              setSelectedItems([]); // Clear selection after deletion
            } catch (error) {
              console.error("Error deleting notes permanently", error);
              Alert.alert("Error", "Failed to permanently delete selected notes.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  // Cancel selection mode
  const cancelSelection = () => {
    setSelectedItems([]);
  };

  // Render each note item with multi-selection support
  const noteItems = deletedNotes.map((note) => {
    const isSelected = selectedItems.includes(note.id);
    return (
      <TouchableOpacity
        key={note.id}
        style={[styles.noteContainer, isSelected && styles.selected]}
        onLongPress={() => toggleSelection(note.id)}
        onPress={() => {
          // If in selection mode, toggle selection; otherwise, do nothing 
          if (selectedItems.length > 0) {
            toggleSelection(note.id);
          }
        }}
      >
        <View>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.description}>{note.description}</Text>
          {note.date && note.time && (
            <View style={styles.reminderContainer}>
              <MaterialIcons name="alarm" size={12} color="#7f828a" />
              <Text style={styles.reminderText}>  {note.date}</Text>
              <Text style={styles.reminderText}>  {note.time}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        {selectedItems.length > 0 ? (
          <View style={styles.actionBar}>
            <TouchableOpacity onPress={cancelSelection}>
              <MaterialIcons name="close" style={styles.menuIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{selectedItems.length} Selected</Text>
            <TouchableOpacity onPress={handlePermanentDeletionMultiple}>
              <MaterialIcons name="delete" style={styles.menuIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalHeader}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <MaterialIcons name="menu" style={styles.menuIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Deleted</Text>
          </View>
        )}
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        {deletedNotes.length > 0 ? (
          noteItems
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="delete-outline" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No notes in Recycle Bin</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Deleted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
    backgroundColor: '#000',
  },
  normalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    fontSize: 28,
    color: '#fff',
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  noteContainer: {
    backgroundColor: 'black',
    borderWidth: 0.4,
    borderColor: 'white',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
  },
  selected: {
    borderColor: '#a0c6f4',
    borderWidth: 2.5,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 6,
  },
  description: {
    color: 'white',
    fontSize: 14,
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
  reminderText: {
    color: '#7f828a',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    color: '#fff',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
  },
});
