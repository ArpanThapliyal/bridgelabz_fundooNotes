
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function LabelScreen() {
  const { labelId, labelName } = useLocalSearchParams();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!labelId) return;
    const colRef = collection(db, 'Notes');
    const q = query(colRef, where('labelId', '==', labelId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
    });
    return () => unsubscribe();
  }, [labelId]);

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteContainer}
      onPress={() => {
        router.push({
          pathname: '/text',
          params: {
            noteId: item.id,
            title: item.title,
            description: item.description,
            date: item.date,
            time: item.time,
            labelId: labelId,
          },
        });
      }}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <MaterialIcons name="menu" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{labelName || 'Label'}</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="label-outline" size={60} color="#ffffff" />
          <Text style={styles.emptyText}>No notes with this label yet</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          router.push({
            pathname: '/text',
            params: { labelId: labelId },
          });
        }}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  noteContainer: {
    backgroundColor: '#111',
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  noteTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  noteDescription: {
    color: 'white',
    fontSize: 14,
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
