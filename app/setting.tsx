import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation();

  // State variables to control the toggles
  const [addToBottom, setAddToBottom] = useState(true);
  const [moveTickedToBottom, setMoveTickedToBottom] = useState(true);
  const [richLinkPreviews, setRichLinkPreviews] = useState(true);
  const [enableSharing, setEnableSharing] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Display options */}
      <Text style={styles.sectionTitle}>Display options</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Add new items to bottom</Text>
        <Switch
          value={addToBottom}
          onValueChange={(value) => setAddToBottom(value)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Move ticked items to bottom</Text>
        <Switch
          value={moveTickedToBottom}
          onValueChange={(value) => setMoveTickedToBottom(value)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Display rich link previews</Text>
        <Switch
          value={richLinkPreviews}
          onValueChange={(value) => setRichLinkPreviews(value)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Theme</Text>
        <Text style={styles.subLabel}>System default</Text>
      </View>

      {/* Reminder defaults */}
      <Text style={styles.sectionTitle}>Reminder defaults</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Morning</Text>
        <Text style={styles.subLabel}>8:00 am</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Afternoon</Text>
        <Text style={styles.subLabel}>1:00 pm</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Evening</Text>
        <Text style={styles.subLabel}>6:00 pm</Text>
      </View>

      {/* Sharing */}
      <Text style={styles.sectionTitle}>Sharing</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Enable sharing</Text>
        <Switch
          value={enableSharing}
          onValueChange={(value) => setEnableSharing(value)}
        />
      </View>

      {/* Reload my account */}
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={() => {
          // Handle reload logic here
        }}
      >
        <Text style={styles.reloadButtonText}>Reload my account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Sections
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  subLabel: {
    color: '#888', 
    fontSize: 14,
  },
  // Reload button
  reloadButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
