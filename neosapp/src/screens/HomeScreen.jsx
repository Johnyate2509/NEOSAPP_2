import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        DISTRIBUCIÓN{'\n'}DE BELLEZA
      </Text>

      <Text style={styles.text}>
        Productos premium para el cuidado personal.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Productos')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>VER PRODUCTOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 30,
    justifyContent: 'center'
  },
  title: {
    color: colors.gold,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20
  },
  text: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 30
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 15,
    width: 200,
    borderRadius: 8
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
