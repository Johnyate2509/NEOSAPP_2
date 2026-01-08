import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import colors from '../theme/colors';

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10
  }
});
