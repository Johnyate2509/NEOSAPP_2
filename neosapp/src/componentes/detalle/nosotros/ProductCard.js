import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function ProductCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    flex: 1,
    margin: 10,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center'
  },
  imagePlaceholder: {
    width: 80,
    height: 120,
    backgroundColor: '#111',
    marginBottom: 15,
    borderRadius: 8
  },
  name: {
    color: colors.text,
    fontWeight: 'bold'
  },
  price: {
    color: colors.gold,
    marginTop: 5,
    fontSize: 16
  }
});
