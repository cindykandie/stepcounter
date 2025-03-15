import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

/**
 * StepCounter Component - Tracks user's steps using the device's accelerometer.
 */
const StepCounter = () => {
  // State to keep track of step count
  const [stepCount, setStepCount] = useState(0);

  // State to track the last known acceleration values
  const [lastAcceleration, setLastAcceleration] = useState({ x: 0, y: 0, z: 0 });

  // Variable to store the accelerometer subscription
  let subscription: { remove: () => void } | null = null;

  /**
   * useEffect Hook - Runs once when the component mounts.
   * - Subscribes to the accelerometer sensor
   * - Listens for changes and updates step count
   * - Cleans up when the component unmounts
   */
  useEffect(() => {
    // Function to start listening to accelerometer changes
    const subscribe = () => {
      subscription = Accelerometer.addListener(accelerometerData => {
        // Extract x, y, z acceleration values
        const { x, y, z } = accelerometerData;

        // Calculate the total change in acceleration
        const accelerationChange =
          Math.abs(x - lastAcceleration.x) +
          Math.abs(y - lastAcceleration.y) +
          Math.abs(z - lastAcceleration.z);

        // If acceleration change is significant, count as a step
        if (accelerationChange > 1.2) {
          setStepCount(prevStepCount => prevStepCount + 1);
        }

        // Update last known acceleration
        setLastAcceleration({ x, y, z });
      });

      // Set the accelerometer update interval (every 500ms)
      Accelerometer.setUpdateInterval(500);
    };

    // Start listening to accelerometer data
    subscribe();

    // Cleanup function to remove subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [lastAcceleration]); // Dependency array ensures effect runs when acceleration changes

  /**
   * Render UI - Displays step count on the screen
   */
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Steps Taken: {stepCount}</Text>
    </View>
  );
};

/**
 * Styles for the UI
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full screen space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#f5f5f5', // Light background
  },
  text: {
    fontSize: 24, // Large text size
    fontWeight: 'bold', // Bold text for emphasis
  },
});

// Export the StepCounter component so it can be used in App.js
export default StepCounter;
