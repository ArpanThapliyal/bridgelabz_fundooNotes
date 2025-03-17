import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const UseAnywhereBar = ({ selected, setSelected, set_Close_Selected }) => {
  // Soft deletion: mark each selected note as deleted
  const handleDeletion = async () => {
    try {
      for (let noteId of selected) {
        const docRef = doc(db, 'Notes', noteId);
        await updateDoc(docRef, { deleted: true });
      }
      Alert.alert(`${selected.length} document(s) marked as deleted`);
    } catch (error) {
      console.error("Error during deletion:", error);
      Alert.alert("Unsuccessful deletion");
    }
  };

  // Archive selected notes: mark each selected note as archived
  const handleArchive = async () => {
    try {
      for (let noteId of selected) {
        const docRef = doc(db, 'Notes', noteId);
        await updateDoc(docRef, { archived: true });
      }
      Alert.alert(`${selected.length} document(s) archived`);
    } catch (error) {
      console.error("Error during archiving:", error);
      Alert.alert("Unsuccessful archiving");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstcontainer}>
        <TouchableOpacity
          onPress={() => { 
            set_Close_Selected(true);
            setSelected([]);
          }}
        >
          <MaterialIcons name="close" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.text}>{selected.length}</Text>
      </View>
      <View style={styles.secondcontainer}>
        <TouchableOpacity style={styles.icons}>
          <MaterialIcons name="push-pin" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icons}
          onPress={() => {
            set_Close_Selected(true);
            setSelected([]);
            handleDeletion();
          }}
        >
          <MaterialIcons name="delete" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icons}
          onPress={() => {
            set_Close_Selected(true);
            setSelected([]);
            handleArchive();
          }}
        >
          <MaterialIcons name="archive" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icons}>
          <MaterialIcons name="color-lens" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UseAnywhereBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  firstcontainer: {
    flexDirection: 'row',
  },
  secondcontainer: {
    flexDirection: 'row',
  },
  icons: {
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
    marginLeft: 14,
    fontSize: 18,
  },
});
