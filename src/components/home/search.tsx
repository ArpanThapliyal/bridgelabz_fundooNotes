import React, { useState } from "react";
import { 
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, DrawerActions } from "@react-navigation/native";

export default function Search({tog,pressed}) {
  const [val, setval] = useState('');
  const navigation = useNavigation();

  return (
    <View>
      <TextInput
        style={style.searchbar}
        value={val}
        onChangeText={setval}
        placeholder="Search your notes"
        placeholderTextColor={'#d6d6c2'}
      />
      <View style={style.icons}>
        <TouchableOpacity  
          style={style.menu_icon}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <MaterialIcons name="menu" size={26} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity style={style.menu_changer} onPress={()=>{tog(!pressed)}}>
          <MaterialIcons name="view-agenda" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={style.menu_gmail}>
          <Image
            style={style.image}
            source={require('../../assets/gmail.jpeg')}
            placeholder='no-img'
            contentFit="cover"
            transition={1000}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    backgroundColor: 'black',
  },
  searchbar: {
    borderWidth: 0.3,
    borderColor: 'white',
    backgroundColor: '#454545',
    borderRadius: 40,
    height: 50,
    paddingLeft: 60,
    fontSize: 16,
    color: 'white'
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 30
  },
  // icons style
  icons: {
    flexDirection: 'row',
    marginTop: -40
  },
  menu_icon: {
    marginLeft: 18
  },
  menu_changer: {
    marginLeft: 220
  },
  menu_gmail: {
    marginTop: -5,
    marginLeft: 20
  }
});
