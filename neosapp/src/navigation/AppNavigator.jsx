import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.jsx';
import ProductsScreen from '../screens/ProductsScreen.jsx';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Productos" component={ProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
