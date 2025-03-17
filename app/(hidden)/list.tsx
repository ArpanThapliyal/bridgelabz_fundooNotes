import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';

const Review = () => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSend = () => {
    setData([...data, inputText]);
    setInputText('');

    setTimeout(() => {
      setShowFeedback(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Enter text here"
          value={inputText}
          onChangeText={setInputText}
          style={styles.textbox}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.feedbackContainer}>
          <View style={styles.userfeed}>
            <Text style={styles.text}>{item}</Text>
          </View>
          {showFeedback && (
            <View style={styles.thankyou}>
              <Text>Thank you for the feedback</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  textbox: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 14,
    borderRadius: 4,
    fontSize: 20,
    width: '70%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  feedbackContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
  },
  userfeed: {
    marginBottom: 8,
  },
  text: {
    fontSize: 20
  },
  thankyou: {
    backgroundColor: '#d4edda',
    padding: 5,
    borderRadius: 4,
  },
});
