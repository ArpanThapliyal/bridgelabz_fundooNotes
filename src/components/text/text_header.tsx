// text_header.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PushNotification from '../../../app/(hidden)/pushNotification';
import { router } from 'expo-router';

const Text_Header = ({
  handleSubmit,
  title,
  description,
  onReminderSet,
  modalVisible,
  setModalVisible,
  clearValues, // received from parent
}) => {
  const handleGoBack = () => {
    clearValues(); // clear state values

    // Navigate back if possible, otherwise navigate to home
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstcontainer}>
        <TouchableOpacity
          onPress={() => {
            handleSubmit();
            handleGoBack(); // clear and navigate
          }}
        >
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.secondcontainer}>
        <TouchableOpacity style={styles.icons}>
          <MaterialIcons name="push-pin" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.icons} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add-alert" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icons}>
          <MaterialIcons name="archive" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal styled as a pop-up */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <PushNotification 
              title={title} 
              description={description} 
              onCancel={() => setModalVisible(false)}
              onReminderSet={onReminderSet}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Text_Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  firstcontainer: {},
  secondcontainer: {
    flexDirection: 'row',
  },
  icons: {
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: 300,
    width: 300,
    borderRadius: 10,
  },
});
