// app/create_new_label.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { db } from '../firebaseConfig';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Create_new_label() {
  const [labelName, setLabelName] = useState('');
  const [labels, setLabels] = useState([]);
  const router = useRouter();

  // Listen for labels from Firestore
  useEffect(() => {
    const labelsRef = collection(db, 'Labels');
    const unsubscribe = onSnapshot(labelsRef, (snapshot) => {
      const labelData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLabels(labelData);
    });
    return () => unsubscribe();
  }, []);

  // Add a new label to Firestore
  const handleAddLabel = async () => {
    if (labelName.trim()) {
      try {
        const labelsRef = collection(db, 'Labels');
        await addDoc(labelsRef, {
          labelName: labelName.trim(),
        });
        setLabelName('');
      } catch (error) {
        console.log('Error adding label:', error);
      }
    }
  };

  // Navigate to the dedicated label screen
  const handleLabelPress = (item) => {
    router.push({
      pathname: '/(hidden)/labelled',
      params: {
        labelId: item.id,
        labelName: item.labelName,
      },
    });
  };

  const renderLabelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.labelItem}
      onPress={() => handleLabelPress(item)}
    >
      <MaterialIcons name="label" size={24} color="white" />
      <Text style={styles.labelText}>{item.labelName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header area (optional: you can customize further) */}
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={()=>{router.back()}}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Labels</Text>
        <Text style={styles.headerEdit}>Edit</Text>
      </View>

      {/* Input row to create a new label */}
      <View style={styles.inputRow}>
        <MaterialIcons name="add" size={24} color="white" />
        <TextInput
          style={styles.textInput}
          placeholder="Create new label"
          placeholderTextColor="#AAAAAA"
          value={labelName}
          onChangeText={setLabelName}
        />
        <TouchableOpacity onPress={handleAddLabel}>
          <MaterialIcons name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* List of labels */}
      <FlatList
        data={labels}
        keyExtractor={(item) => item.id}
        renderItem={renderLabelItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
  },
  headerEdit: {
    color: 'white',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  labelText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
});
