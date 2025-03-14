import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const StepCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  const [lastAcceleration, setLastAcceleration] = useState({ x: 0, y: 0, z: 0 });

  let subscription: { remove: () => void } | null = null;

  useEffect(() => {
    const subscribe = () => {
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const accelerationChange =
          Math.abs(x - lastAcceleration.x) +
          Math.abs(y - lastAcceleration.y) +
          Math.abs(z - lastAcceleration.z);

        if (accelerationChange > 1.2) {
          setStepCount(prevStepCount => prevStepCount + 1);
        }

        setLastAcceleration({ x, y, z });
      });

      Accelerometer.setUpdateInterval(500); 
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [lastAcceleration]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Steps Taken: {stepCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default StepCounter;
