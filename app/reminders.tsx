import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Reminders = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [reminderNotes, setReminderNotes] = useState([]);

  // Query for active notes that have a non-empty "date" field (i.e. reminders are set)
  const colRef = collection(db, 'Notes');
  const q = query(
    colRef, 
    where("deleted", "==", false), 
    where("date", "!=", "") // Only notes with reminders
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setReminderNotes(notesList);
    });
    return () => unsubscribe();
  }, []);

  // Render reminder note items
  const renderReminderNotes = () => {
    return reminderNotes.map(note => (
      <TouchableOpacity 
        key={note.id} 
        style={styles.noteContainer}
        onPress={() => {
          // Navigate to the Text screen for editing or viewing the note
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
        }}
      >
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.description}>{note.description}</Text>
        <View style={styles.reminderContainer}>
          <MaterialIcons name="alarm" size={16} color="#7f828a" />
          <Text style={styles.reminderText}> {note.date} {note.time}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <MaterialIcons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <View style={styles.rightIconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="view-agenda" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {reminderNotes.length > 0 ? (
          renderReminderNotes()
        ) : (
          <View style={styles.centerContent}>
            <MaterialIcons name="add-alert" size={60} color="#ffffff" />
            <Text style={styles.infoText}>
              Notes with upcoming reminders appear here
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/text')}
      >
        <MaterialIcons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default Reminders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    height: 56,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
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
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
