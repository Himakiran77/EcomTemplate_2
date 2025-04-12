import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  TextInput, 
  Dimensions, 
  Platform, 
  Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Images from '../../assets/Images';
import { addOrder, clearOrders } from '../../redux/orderSlice';
// import { clearCart, clearBuyNowItem } from '../../redux/cartSlice'; // Import cart actions
import { clearCart, clearBuyNow } from '../../redux/cartSlice';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get both cart items and buyNowItem from Redux store
  const { items: cartItems, buyNowItem } = useSelector(state => state.cart);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  // Determine which items to display based on flow
  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;
  
  // Calculate order totals
  const subtotal = itemsToCheckout.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    Alert.alert(
      'Confirm Order',
      `Total: $${total.toFixed(2)}\n\nProceed with payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const orderData = {
              orderId: `ORD-${Date.now()}`,
              date: new Date().toISOString(),
              items: itemsToCheckout.map(item => ({
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                description: item.description || '',
                category: item.category || '',
              })),
              subtotal: subtotal,
              shipping: shipping,
              tax: tax,
              total: total,
              status: "processing",
              paymentMethod: paymentMethod,
              deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            };

            dispatch(addOrder(orderData));
            
            if (buyNowItem) {
              dispatch(clearBuyNow());
            } else {
              dispatch(clearCart());
            }

            navigation.navigate('OrderConfirmation', {
              order: orderData,
              isBuyNowFlow: !!buyNowItem
            });
          }
        }
      ]
    );
  };

  // Validate card details when payment method is card
  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvv || !name) {
        Alert.alert('Error', 'Please fill all card details');
        return false;
      }
      if (cardNumber.length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
    }
    return true;
  };

  const handlePaymentAndPlaceOrder = () => {
    if (!validatePayment()) return;
    handlePlaceOrder();
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

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {buyNowItem ? 'Your Item' : `Order Items (${itemsToCheckout.length})`}
          </Text>
          {itemsToCheckout.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </Text>
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
                maxLength={16}
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
                  maxLength={3}
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
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={handlePaymentAndPlaceOrder}
        >
          <Text style={styles.checkoutButtonText}>
            {buyNowItem ? 'Buy Now' : 'Place Order'}
          </Text>
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
    color: '#0000FF',
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
    borderColor: '#6200ee',
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
    backgroundColor: '#6200ee',
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
    color: '#0000FF',
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
    backgroundColor: '#0000FF',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  checkoutButtonPrice: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;