import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import Search from "../src/components/home/search";
import Body from "../src/components/home/body";
import Footer from "../src/components/home/footer";
import UseAnywhereBar from "../src/components/use_anywhere_bar";

export default function Home() {
  const [pressed, setPressed] = useState(false);
  const [selected, setSelected] = useState([]);
  const [close_selected, set_Close_Selected] = useState(false);
  
  // Function to update the pressed state
  const togglepress = (val) => {
    setPressed(val);
  };

  // Render Search bar if no note is selected, otherwise render the UseAnywhereBar
  const selectedComponent = () => {
    return (selected.length <= 0)
      ? (<Search tog={togglepress} pressed={pressed} />)
      : (<UseAnywhereBar selected={selected} setSelected={setSelected} set_Close_Selected={set_Close_Selected} />);
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        {selectedComponent()}
      </View>
      <ScrollView>
        <View style={styles.body}>
          <Body 
            pressed={pressed} 
            setSelected={setSelected} 
            close_selected={close_selected}
            set_Close_Selected={set_Close_Selected}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    marginHorizontal: 15,
    marginVertical: 12,
  },
  body: {
    flex: 1,
    marginTop: 10,
  },
  footer: {
    padding: 20,
  },
});
