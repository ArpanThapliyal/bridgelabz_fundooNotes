
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import Header from '../text/text_header';
import Body from '../text/text_body';
import Footer from '../text/text_footer';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Text = () => {
  const router = useRouter();
  // Extract parameters using the new hook
  const { noteId, title: paramTitle, description: paramDescription, date: paramDate, time: paramTime } = useLocalSearchParams();

  // State variables for text values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const textInputRef = useRef(null);

  // Populate state if noteId exists (i.e. editing an existing note)
  useEffect(() => {
    if (noteId) {
      setTitle(paramTitle || '');
      setDescription(paramDescription || '');
      setReminderDate(paramDate || '');
      setReminderTime(paramTime || '');
    }
  }, [noteId, paramTitle, paramDescription, paramDate, paramTime]);

  // Callback to update reminder values
  const handleReminderSet = (dateStr, timeStr) => {
    setReminderDate(dateStr);
    setReminderTime(timeStr);
  };

  // Handle submission: update if noteId exists, else add new note.
  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Please set all the values');
      return;
    }
    try {
      if (noteId) {
        const docRef = doc(db, 'Notes', noteId);
        await updateDoc(docRef, {
          title,
          description,
          date: reminderDate,
          time: reminderTime,
        });
        Alert.alert('Note updated successfully!');
      } else {
        await addDoc(collection(db, 'Notes'), {
          title,
          description,
          date: reminderDate,
          time: reminderTime,
          deleted: false,   // default: not deleted
          archived: false,  // default: not archived
        });
        Alert.alert('Note added successfully!');
      }
    } catch (error) {
      console.error('Error storing data', error);
      Alert.alert('Error, failed!');
    }
  };

  // Function to clear text fields when navigating back
  const clearValues = () => {
    setTitle('');
    setDescription('');
    setReminderDate('');
    setReminderTime('');
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Header 
          handleSubmit={handleSubmit} 
          title={title} 
          description={description}
          onReminderSet={handleReminderSet}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          clearValues={clearValues} // pass clear function to header
        />
      </View>
      <View style={styles.subpart}>
        <ScrollView>
          <Body
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            textInputRef={textInputRef}
            textdatedate={reminderDate}
            texttime={reminderTime}
            openReminderModal={() => setModalVisible(true)}
          />
        </ScrollView>
        <Footer />
      </View>
    </View>
  );
};

export default Text;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black'
  },
  header: {
    marginBottom: 30
  },
  subpart: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});
