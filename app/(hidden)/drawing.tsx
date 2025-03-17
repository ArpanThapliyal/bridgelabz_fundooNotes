import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, Entypo } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { router } from 'expo-router';

// Example color palette
const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FFA500', '#800080', '#00FFFF',
  '#FF00FF', '#C0C0C0'
];

const SvgDrawingCanvas = () => {
  // Current pen color
  const [selectedColor, setSelectedColor] = useState('#000000');
  // Ref to always hold the latest color value
  const selectedColorRef = useRef(selectedColor);
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  // Current pen width
  const [penWidth, setPenWidth] = useState(3);
  // Ref to always hold the latest width value
  const penWidthRef = useRef(penWidth);
  useEffect(() => {
    penWidthRef.current = penWidth;
  }, [penWidth]);

  // Store an array of strokes; each stroke has { color, points, width }
  const [strokes, setStrokes] = useState([]);

  // Create PanResponder to handle drawing events
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      // When the user first touches down, start a new stroke
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        console.log('Starting new stroke with color:', selectedColorRef.current, 'and width:', penWidthRef.current);
        setStrokes((prev) => [
          ...prev,
          {
            color: selectedColorRef.current,
            points: `${locationX},${locationY}`,
            width: penWidthRef.current
          }
        ]);
      },

      // As the user moves their finger, append new points to the current stroke
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setStrokes((prev) => {
          const updatedStrokes = [...prev];
          const lastStrokeIndex = updatedStrokes.length - 1;
          const lastStroke = updatedStrokes[lastStrokeIndex];
          lastStroke.points += ` ${locationX},${locationY}`;
          updatedStrokes[lastStrokeIndex] = lastStroke;
          return updatedStrokes;
        });
      },

      // When the user lifts their finger
      onPanResponderRelease: () => {
        console.log('Stroke finished');
      },
    })
  ).current;

  // Clear the canvas (remove all strokes)
  const handleClear = () => {
    setStrokes([]);
  };

  // Eraser sets the pen color to white (assuming canvas background is white)
  const handleEraser = () => {
    setSelectedColor('#FFFFFF');
  };

  return (
    <View style={styles.container}>
      {/* Header with Back, Title, and Clear button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drawing</Text>
        <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
          <Text style={{ color: 'red', fontSize: 16 }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Drawing Canvas */}
      <View style={styles.canvas} {...panResponder.panHandlers}>
        <Svg style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, index) => (
            <Polyline
              key={index}
              points={stroke.points}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              fill="none"
            />
          ))}
        </Svg>
      </View>

      {/* Tools: Stroke Width Selector, Eraser, and Color Palette */}
      <View style={styles.tools}>
        {/* Stroke Width Selector */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Stroke Width: {penWidth}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={penWidth}
            onValueChange={(value) => setPenWidth(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#CCCCCC"
          />
        </View>

        {/* Tools Row */}
        <View style={styles.toolRow}>
          {/* Visual indicator of current color */}
          <View style={[styles.selectedColorIndicator, { backgroundColor: selectedColor }]} />
          <TouchableOpacity style={styles.toolButton} onPress={handleEraser}>
            <Entypo name="eraser" size={24} color="black" />
          </TouchableOpacity>
          {/* Color Palette */}
          <View style={styles.colorPalette}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorSwatch, { backgroundColor: c }]}
                onPress={() => {
                  console.log('Selected color:', c);
                  setSelectedColor(c);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SvgDrawingCanvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // Header styling
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#EEE',
    justifyContent: 'space-between',
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Canvas styling
  canvas: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // Tools container styling
  tools: {
    padding: 10,
    backgroundColor: '#EEE',
  },
  sliderContainer: {
    marginBottom: 5,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  toolButton: {
    marginRight: 10,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
});
