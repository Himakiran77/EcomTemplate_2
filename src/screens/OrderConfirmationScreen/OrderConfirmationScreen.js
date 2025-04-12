import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, clearBuyNow } from "../../redux/cartSlice";
import { useNavigation, useRoute } from "@react-navigation/native";

const OrderConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get parameters from route with proper default values
  const { order = null, isBuyNowFlow = false } = route.params || {};
  
  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const buyNowItem = useSelector((state) => state.cart.buyNowItem);
  
  // Safely generate display items
  const displayItems = order?.items || (isBuyNowFlow && buyNowItem ? [buyNowItem] : cartItems || []);
  
  // Safely generate order data
  const displayOrderData = order || {
    orderId: generateOrderNumber(),
    subtotal: calculateSubtotal(displayItems),
    shipping: 5.99,
    tax: calculateSubtotal(displayItems) * 0.1,
    total: calculateSubtotal(displayItems) * 1.1 + 5.99,
    paymentMethod: "Credit Card",
    status: "processing",
    date: new Date().toISOString()
  };

  // Helper function to safely generate order numbers
  const generateOrderNumber = () => {
    const numbers = Math.floor(10000 + Math.random() * 90000);
    const letters = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${numbers}-${letters}`;
  };

  // Helper function to safely calculate subtotal
  const calculateSubtotal = (items) => {
    return items?.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 1), 0) || 0;
  };

  // Render each product item with proper null checks
  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image 
        source={{ uri: item?.image || '' }} 
        style={styles.productImage} 
        // defaultSource={require('../../assets/placeholder-image.png')}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item?.title || 'Unknown Product'}</Text>
        <Text style={styles.productQuantity}>Quantity: {item?.quantity || 1}</Text>
        <Text style={styles.productTotal}>
          Total: ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Safely format dates
  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return dateString ? new Date(dateString).toLocaleDateString("en-US", options) : 'Not available';
    } catch {
      return 'Not available';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.card}>
          {/* Checkmark Animation */}
          <Animatable.View
            animation="zoomIn"
            delay={500}
            style={styles.checkmarkCircle}
          >
            <Text style={styles.checkmark}>✓</Text>
          </Animatable.View>

          {/* Title and Subtitle */}
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            {displayOrderData?.status === 'processing' 
              ? "Thank you for your purchase! Your order is being processed." 
              : "Your order is on its way!"}
          </Text>

          {/* Order Details */}
          <View style={styles.orderDetails}>
            <Text style={styles.orderTitle}>Order Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Number:</Text>
              <Text style={styles.detailValue}>{displayOrderData?.orderId || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(displayOrderData?.date)}
              </Text>
            </View>
            
            {/* Products List with safe keyExtractor */}
            <Text style={styles.productsTitle}>Products ({displayItems?.length || 0}):</Text>
            <FlatList
              data={displayItems}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => item?.id?.toString() || `item-${index}`}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items in this order</Text>
              }
            />
            
            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subtotal:</Text>
                <Text style={styles.detailValue}>${(displayOrderData?.subtotal || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shipping:</Text>
                <Text style={styles.detailValue}>${(displayOrderData?.shipping || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tax:</Text>
                <Text style={styles.detailValue}>${(displayOrderData?.tax || 0).toFixed(2)}</Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={[styles.detailLabel, styles.totalLabel]}>Total:</Text>
                <Text style={[styles.detailValue, styles.totalValue]}>
                  ${(displayOrderData?.total || 0).toFixed(2)}
                </Text>
              </View>
            </View>
            
            {/* Payment Method */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>
                {displayOrderData?.paymentMethod || "Not specified"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.buttonText}>View Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                isBuyNowFlow ? dispatch(clearBuyNow()) : dispatch(clearCart());
                navigation.navigate("MainApp");
              }}
            >
              <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  checkmark: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  orderDetails: {
    marginBottom: 30,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  summarySection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  actions: {
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default OrderConfirmationScreen;