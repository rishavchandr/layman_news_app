import React from 'react';
import { View, StyleSheet } from 'react-native';

const DotIndicator = ({ total, active }: { total: number; active: number }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === active ? '#E8572A' : '#D4D4D8',
              width: i === active ? 20 : 6,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
});

export default DotIndicator;