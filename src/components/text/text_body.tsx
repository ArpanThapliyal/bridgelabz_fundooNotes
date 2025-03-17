// text_body.tsx
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Text_Body = ({
  title,
  setTitle,
  description,
  setDescription,
  textInputRef,
  textdatedate,
  texttime,
  openReminderModal,
}) => {
  return (
    <View style={styles.main}>
      <TextInput
        style={styles.textbox1}
        placeholder="Title"
        placeholderTextColor="#b3b3b3"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={() => {
          textInputRef.current.focus();
        }}
      />
      <TextInput
        style={styles.textbox2}
        placeholder="Note"
        placeholderTextColor="#b3b3b3"
        multiline
        value={description}
        onChangeText={setDescription}
        ref={textInputRef}
      />
      { textdatedate && texttime && (
        <TouchableOpacity 
          style={styles.reminderContainer}
          onPress={openReminderModal}
        >
          <MaterialIcons name="alarm" size={16} color="#858a90" />
          <Text style={styles.text}>{textdatedate}</Text>
          <Text style={styles.text}>{texttime}</Text> 
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Text_Body;

const styles = StyleSheet.create({
  main: {},
  textbox1: {
    color: 'white',
    fontSize: 24,
  },
  textbox2: {
    color: 'white',
    fontSize: 16,
    maxHeight: 380,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#30353f',
    alignSelf: 'flex-start',
  },
  text: {
    color: '#858a90',
    marginLeft: 5,
  },
});
