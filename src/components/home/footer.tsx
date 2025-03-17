import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const data = [
  { label: 'List', icon: 'check-box' },
  { label: 'Text', icon: 'text-fields' },
  { label: 'Image', icon: 'image' },
  { label: 'Drawing', icon: 'brush' },
];

export default function Footer() {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.spring(animation, {
      toValue: open ? 0 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  return (
    <View style={styles.container}>

      {data.map((item, index) => {
        // For each button, move it further up by 60px * index
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -((index + 1) * 60)],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const animatedStyle = {
          transform: [{ translateY }, { scale }],
          opacity,
        };

        //handel button navigation
        function handeltouches(label:any): void {
          switch (label) {
            case 'List': router.push('/list');
              
              break;
            case 'Text': {
              toggleMenu();
              router.push('/text');
            }
              break;
            case 'Image': {
              toggleMenu();
              router.push('/addImage');
            }
              
              break;
            case 'Drawing': router.push('/drawing');
              
              break;
          
            default:
              break;
          }
        }

        return (
          <Animated.View
            key={item.label}
            style={[styles.secondaryButtonContainer, animatedStyle]}
          >
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handeltouches(item.label)}
            >
              <Text style={styles.buttonLabel}>{item.label}</Text>
              <MaterialIcons
                name={item.icon}
                size={26}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* button */}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Ionicons name={open ? 'close' : 'add'} size={34} color="#e6ffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,  
    right: 30,   
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#89CFF0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  secondaryButtonContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9ccaff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 10, 
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight:"bold"
  },
});
