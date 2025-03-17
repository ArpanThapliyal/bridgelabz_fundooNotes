
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const PushNotification = ({ title, description, onCancel, onReminderSet }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  // Schedules the notification using the combined date and time
  const scheduleTodoNotification = async (scheduledDate) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: description,
        },
        trigger: scheduledDate,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed' || selectedDate === undefined) {
      setShowPicker(false);
      if (onCancel) {
        onCancel();
      }
      return;
    }

    if (pickerMode === 'date') {
      setDate(selectedDate);
      setPickerMode('time');
      if (Platform.OS === 'android') {
        setShowPicker(false);
        setTimeout(() => {
          setShowPicker(true);
        }, 0);
      }
    } else if (pickerMode === 'time') {
      const selectedTime = selectedDate;
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      // newDate.setSeconds(selectedTime.getSeconds());
      setDate(newDate);
      scheduleTodoNotification(newDate);
      setShowPicker(false);
      // Pass the formatted date and time back to the parent
      if (onReminderSet) {
        // Format the time without seconds.
        const formattedTime = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        onReminderSet(newDate.toLocaleDateString(), formattedTime);
      }
      
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Schedule Notification</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setPickerMode('date');
            setShowPicker(true);
          }}
        >
          <Text style={styles.buttonText}>Pick Date & Time</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode={pickerMode}
            display="default"
            onChange={onChange}
            style={styles.picker}
          />
        )}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setShowPicker(false);
            if (onCancel) {
              onCancel();
            }
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PushNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2', 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E94B3C', 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    backgroundColor: '#FFF',
  },
});
