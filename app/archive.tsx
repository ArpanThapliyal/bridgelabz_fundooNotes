import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const Archive = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const colRef = collection(db, 'Notes');
  const q = query(colRef, where("archived", "==", true));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setArchivedNotes(notesList);
    });
    return () => unsubscribe();
  }, []);

  const toggleSelection = (noteId) => {
    if (selectedItems.includes(noteId)) {
      setSelectedItems(selectedItems.filter(id => id !== noteId));
    } else {
      setSelectedItems([...selectedItems, noteId]);
    }
  };

  const handleUnarchiveMultiple = async () => {
    if (selectedItems.length === 0) return;
    Alert.alert(
      "Unarchive Notes",
      `Are you sure you want to unarchive ${selectedItems.length} note(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unarchive", 
          onPress: async () => {
            try {
              for (let noteId of selectedItems) {
                await updateDoc(doc(db, 'Notes', noteId), { archived: false });
              }
              Alert.alert("Notes unarchived successfully");
              setSelectedItems([]);
            } catch (error) {
              console.error("Error unarchiving notes:", error);
              Alert.alert("Error", "Failed to unarchive selected notes");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const renderArchivedNotes = () => {
    return archivedNotes.map(note => {
      const isSelected = selectedItems.includes(note.id);
      return (
        <TouchableOpacity 
          key={note.id} 
          style={[styles.noteContainer, isSelected && styles.selectedNote]}
          onPress={() => {
            // If in selection mode, toggle selection instead of normal navigation
            if (selectedItems.length > 0) {
              toggleSelection(note.id);
            } else {
              router.push({
                pathname: '/text', 
                params: {
                  noteId: note.id,
                  title: note.title,
                  description: note.description,
                  date: note.date,
                  time: note.time,
                },
              });
            }
          }}
          onLongPress={() => {
            toggleSelection(note.id);
          }}
        >
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteDescription}>{note.description}</Text>
          {note.time !== '' && (
            <View style={styles.archivedContainer}>
              <MaterialIcons name="alarm" size={16} color="#7f828a" />
              <Text style={styles.archivedText}> {note.date} {note.time}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        {selectedItems.length > 0 ? (
          <View style={styles.actionBar}>
            <TouchableOpacity onPress={() => setSelectedItems([])}>
              <MaterialIcons name="close" size={26} color="white" />
            </TouchableOpacity>
            <Text style={styles.actionText}>{selectedItems.length} Selected</Text>
            <TouchableOpacity onPress={handleUnarchiveMultiple}>
              <MaterialIcons name="unarchive" size={26} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalHeader}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Archive</Text>
            <View style={styles.rightIconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="search" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="view-agenda" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {archivedNotes.length > 0 ? (
          renderArchivedNotes()
        ) : (
          <View style={styles.centerContent}>
            <MaterialIcons name="archive" size={60} color="#ffffff" />
            <Text style={styles.infoText}>Your archived notes appear here</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Archive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
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
  actionText: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 16,
    flex: 1,
  },
  rightIconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  contentContainer: {
    padding: 10,
  },
  centerContent: {
    flex: 1,
    height:700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  noteContainer: {
    backgroundColor: 'black',
    borderWidth: 0.4,
    borderColor: 'white',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
  },
  selectedNote: {
    borderColor: '#a0c6f4',
    borderWidth: 2.5,
  },
  noteTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 6,
  },
  noteDescription: {
    color: 'white',
    fontSize: 14,
  },
  archivedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#30353f',
    alignSelf: 'flex-start'
  },
  archivedText: {
    color: '#7f828a',
    fontSize: 12,
  },
});
