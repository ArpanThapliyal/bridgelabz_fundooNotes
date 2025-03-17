import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {MaterialIcons,Octicons} from '@expo/vector-icons';
import { router } from 'expo-router';


const Text_footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.secondcontainer}>
        <TouchableOpacity style={styles.icons}>
        <Octicons
                name='diff-added'
                size={24}
                color={'white'}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icons}>
        <MaterialIcons
                name='color-lens'
                size={24}
                color={'white'}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icons}>
        <MaterialIcons
                name='format-color-text'
                size={24}
                color={'white'}
            />
        </TouchableOpacity>
        <Text style={{color:'white',marginHorizontal:8}}>Edited just now</Text>
      </View>
      <View style={styles.firstcontainer}>
        <TouchableOpacity>
            <MaterialIcons
                name='more-vert'
                size={24}
                color={'white'}
            />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Text_footer;

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:8,
    },
    firstcontainer:{},
    secondcontainer:{
        flexDirection:'row',
    },
    icons:{
        marginHorizontal:10
    }
})