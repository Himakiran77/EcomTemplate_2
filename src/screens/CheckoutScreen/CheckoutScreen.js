import React,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Dimensions, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Images from '../../assets/Images';
import { useDispatch } from 'react-redux';
import { addOrder, clearOrders } from '../../redux/orderSlice';
import { clearCart } from '../../redux/cartSlice';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = (route) => {
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart.items);
  const subtotal = useSelector(state => state.cart.total);
  const totalAmount = useSelector(state => state.cart.total);
  const shipping = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;
  const dispatch = useDispatch();
  

  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [name, setName] = React.useState('');

  // const handlePlaceOrder = () => {
  //   Alert.alert(
  //     'Confirm Order',
  //     `Total: ${total.toFixed(2)}\n\nProceed with Payment?`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'ok',
  //       onPress: () => {
  //         navigation.navigate('OrderConfirmation', {
  //           cartItems: cartItems,
  //           totalAmount: totalAmount,
  //           shippingFee: 5.99,
  //           grandTotal: totalAmount + 5.99
  //         });
  //       }
  //     }
  //     ]
  //   );
  // };

  // useEffect(() => {
  //   const orderData = {
  //     // id: orderNumber,
  //     date: new Date().toISOString(),
  //     items: cartItems,
  //     subtotal: totalAmount,
  //     shipping: 5.99,
  //     total: totalAmount + 5.99,
  //     status: "processing",
  //     // deliveryDate: deliveryDate.toISOString(),
  //     paymentMethod: "Credit Card" // You can make this dynamic
  //   };

  //   dispatch(addOrder(orderData));
  // }, []);

  // useEffect(() => {
  //   const orderData = {
  //     orderId: `ORD-${Date.now()}`,
  //     date: new Date().toISOString(),
  //     items: cartItems.map(item => ({
  //       productId: item.id,
  //       title: item.title,
  //       price: item.price,
  //       quantity: item.quantity,
  //       image: item.image,
  //       description: item.description || '', 
  //       category: item.category || '', 
  //       brand: item.brand || '', 
  //       color: item.color || '', 
  //       size: item.size || '' 
  //     })),
  //     subtotal: totalAmount,
  //     shipping: shipping,
  //     tax: tax,
  //     total: total,
  //     status: "processing",
  //     paymentMethod: paymentMethod, 
  //     deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
  //   };
  
  //   dispatch(addOrder(orderData));
  //   // dispatch(clearOrders(orderData));
  // }, [cartItems, totalAmount, shipping, tax, total, paymentMethod, dispatch]);

  const handlePlaceOrder = () => {
    Alert.alert(
      'Confirm Order',
      `Total: ${total.toFixed(2)}\n\nProceed with Payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            const orderData = {
              orderId: `ORD-${Date.now()}`,
              date: new Date().toISOString(),
              items: cartItems.map(item => ({
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                description: item.description || '',
                category: item.category || '',
                brand: item.brand || '',
                color: item.color || '',
                size: item.size || ''
              })),
              subtotal: totalAmount,
              shipping: 5.99,
              tax: 0, 
              total: totalAmount + 5.99,
              status: "processing",
              paymentMethod: paymentMethod,
              deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            };
  
            dispatch(addOrder(orderData)); 
            // dispatch(clearCart()); 
  
            navigation.navigate('OrderConfirmation', {
              cartItems: cartItems,
              totalAmount: totalAmount,
              shippingFee: 5.99,
              grandTotal: totalAmount + 5.99
            });
          }
        }
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>John Doe</Text>
            <Text style={styles.addressText}>123 Main Street</Text>
            <Text style={styles.addressText}>New York, NY 10001</Text>
            <Text style={styles.addressText}>United States</Text>
            <Text style={styles.addressText}>+1 (555) 123-4567</Text>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)} × {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('card')}
            >
              <Image source={Images.CreditCard} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>Credit Card</Text>
              {paymentMethod === 'card' && <View style={styles.radioSelected} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'UPI' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('UPI')}
            >
              <Image source={Images.Upi} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>UPI</Text>
              {paymentMethod === 'UPI' && <View style={styles.radioSelected} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'paypal' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Image source={Images.paypal} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>PayPal</Text>
              {paymentMethod === 'paypal' && <View style={styles.radioSelected} />}
            </TouchableOpacity>
          </View>

          {paymentMethod === 'card' && (
            <View style={styles.cardForm}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholderTextColor="#999"
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  value={cvv}
                  onChangeText={setCvv}
                  placeholderTextColor="#999"
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Name on Card"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}>
          <Text style={styles.checkoutButtonText}>Place Order</Text>
          <Text style={styles.checkoutButtonPrice}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: height * 0.12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backIcon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#333',
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: height * 0.02,
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: width * 0.02,
    padding: width * 0.04,
  },
  addressText: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.005,
  },
  changeButton: {
    alignSelf: 'flex-end',
    marginTop: height * 0.01,
  },
  changeButtonText: {
    color: '#00eda6',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethods: {
    marginBottom: height * 0.02,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    position: 'relative',
  },
  paymentOptionSelected: {
    borderColor: '#00eda6',
    backgroundColor: '#f5f0ff',
  },
  paymentIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.03,
    resizeMode: 'contain',
  },
  paymentText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  radioSelected: {
    position: 'absolute',
    right: width * 0.04,
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.02,
    backgroundColor: '#00eda6',
  },
  cardForm: {
    marginTop: height * 0.02,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    fontSize: width * 0.04,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  summaryLabel: {
    fontSize: width * 0.04,
    color: '#666',
  },
  summaryValue: {
    fontSize: width * 0.04,
    color: '#333',
  },
  totalItem: {
    marginTop: height * 0.01,
    paddingTop: height * 0.01,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#00eda6',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButton: {
    backgroundColor: '#00eda6', 
    borderRadius: width * 0.02,
    padding: width * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  checkoutButtonPrice: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;