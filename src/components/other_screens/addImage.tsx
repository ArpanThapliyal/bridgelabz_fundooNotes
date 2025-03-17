import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AddImage() {
  const [modalVisible, setModalVisible] = useState(true);
  const [image, setImage] = useState(null);
  const router = useRouter();

  // Take a photo using the device camera
  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access permission required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    // Close the modal
    setModalVisible(false);
    router.back();
  };

  // Choose an image from the library
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    // Close the modal
    setModalVisible(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        
        <View style={styles.modalBackground}>
          
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add image</Text>
            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromCamera}>
              <MaterialIcons name="photo-camera" size={24} color="#fff" />
              <Text style={styles.modalOptionText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromGallery}>
              <MaterialIcons name="image" size={24} color="#fff" />
              <Text style={styles.modalOptionText}>Choose image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  modalOptionText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 16
  }
});
