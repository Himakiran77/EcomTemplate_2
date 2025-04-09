// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SplashScreen from './src/screens/SplashScreen/SplashScreen';
// import LoginScreen from './src/screens/LoginScreen/LoginScreen';
// import OtpScreen from './src/screens/OtpScreen/OtpScreen';
// import ForgotPassword from './src/screens/ForgotPassword/ForgotPassword';
// import SignUpScreen from './src/screens/SignUpScreen/SignUpScreen';
// import HomeScreen from './src/screens/HomeScreen/HomeScreen';
// import ProductDetails from './src/screens/ProductDetails/ProductDetails';
// import CartScreen from './src/screens/CartScreen/CartScreen';

// const Stack = createNativeStackNavigator();


// const AuthStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
//     <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//     <Stack.Screen name='Otp' component={OtpScreen} options={{headerShown: true, title: 'OTP', headerStyle: { backgroundColor: '#F8FAFC' }}} />
//     <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true, title: 'Forgot Password', headerStyle: { backgroundColor: '#F8FAFC' } }} />
//     <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true, title: 'Sign Up', headerStyle: { backgroundColor: '#F8FAFC' } }} />
//   </Stack.Navigator>
// );

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name='Auth' component={AuthStack} options={{ headerShown: false }} />
//         <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
//         <Stack.Screen name="ProductDetails" component={ProductDetails} />
//         <Stack.Screen name="Cart" component={CartScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import OtpScreen from './src/screens/OtpScreen/OtpScreen';
import ForgotPassword from './src/screens/ForgotPassword/ForgotPassword';
import SignUpScreen from './src/screens/SignUpScreen/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import ProductDetails from './src/screens/ProductDetails/ProductDetails';
import CartScreen from './src/screens/CartScreen/CartScreen';
import WishlistScreen from './src/screens/WishlistScreen/WishlistScreen';
import OrdersScreen from './src/screens/OrdersScreen/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import CheckoutScreen from './src/screens/CheckoutScreen/CheckoutScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name='Otp' component={OtpScreen} options={{ headerShown: true, title: 'OTP', headerStyle: { backgroundColor: '#F8FAFC' }}} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true, title: 'Forgot Password', headerStyle: { backgroundColor: '#F8FAFC' } }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true, title: 'Sign Up', headerStyle: { backgroundColor: '#F8FAFC' } }} />
    <Stack.Screen name="HomeDrawer" component={DrawerStack} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
    <Stack.Screen name='Wishlist' component={WishlistScreen} />
    <Stack.Screen name='Cart' component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true }} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
    <Stack.Screen name='Orders' component={OrdersScreen} options={{title: 'My Orders'}} />
  </Stack.Navigator>
);

const DrawerStack = () => (
  <Drawer.Navigator screenOptions={{ headerStyle: { backgroundColor: '#F8FAFC' }, drawerActiveTintColor: '#007BFF', drawerLabelStyle: { fontSize: 16 }, }}>
    <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="Cart" component={CartScreen} options={{title: 'My Cart'}} />
    <Drawer.Screen name='Wishlist' component={WishlistScreen} />
    <Drawer.Screen name='Orders' component={OrdersScreen} options={{title: 'My Orders'}}  />
    <Drawer.Screen name='Profile' component={ProfileScreen} options={{title: 'My Profile'}} />
    <Drawer.Screen name='Logout' component={LoginScreen} options={{headerShown: false}} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Auth' component={AuthStack} />
        <Stack.Screen name="MainApp" component={DrawerStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
