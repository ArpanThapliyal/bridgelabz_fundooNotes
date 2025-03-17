// app/_layout.jsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: '#0d0d0d' }}
    >
      <View style={styles.drawerHeaderContainer}>
        <Text style={styles.drawerHeaderText}>Google Keep</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.main}>
      <Drawer
        initialRouteName="(hidden)/signup"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
            backgroundColor: '#0d0d0d',
          },
          drawerActiveBackgroundColor: '#004080',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: 'white',
          drawerLabelStyle: {
            color: 'white',
          },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: 'Notes',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="lightbulb" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="archive"
          options={{
            drawerLabel: 'Archive',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="archive" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="reminders"
          options={{
            drawerLabel: 'Reminder',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="notifications" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="create_new_label"
          options={{
            drawerLabel: 'Labels',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="add" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="deleted"
          options={{
            drawerLabel: 'Deleted',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="delete" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: 'Settings',
            title: 'Overview',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
        {/* Hidden screens */}
        <Drawer.Screen name="(hidden)/text" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/drawing" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/addImage" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/pushNotification" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/label" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/index" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/list" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/login" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(hidden)/signup" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  drawerHeaderContainer: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 16,
  },
  drawerHeaderText: {
    fontSize: 24,
    color: 'white',
  },
});
