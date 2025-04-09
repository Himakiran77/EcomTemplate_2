import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ScrollView
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OrderConfirmationScreen = ({ route }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.total);
  const dispatch = useDispatch();
  const { orderData } = route.params || {}; 
  const navigation = useNavigation();

  const handlenavigateOrders = () => {
    navigation.navigate('Orders');
  }

  const generateOrderNumber = () => {
    const numbers = Math.floor(10000 + Math.random() * 90000);
    const letters = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${numbers}-${letters}`;
  };

  const [orderNumber] = useState(orderData?.orderId || generateOrderNumber());

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.productTotal}>
          Total: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView>
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1000} style={styles.card}>
        {/* Checkmark Circle */}
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
          Thank you for your purchase. Your order is on its way!
        </Text>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.orderTitle}>Order Summary</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Number:</Text>
            <Text style={styles.detailValue}>{orderNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ordered on:</Text>
            <Text style={styles.detailValue}>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
          
          {/* Products List */}
          <Text style={styles.productsTitle}>Products:</Text>
          <FlatList
            data={orderData?.items || cartItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
          
          {/* Order Summary */}
          <View style={styles.summarySection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subtotal:</Text>
              <Text style={styles.detailValue}>${orderData?.subtotal?.toFixed(2) || totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipping:</Text>
              <Text style={styles.detailValue}>${orderData?.shipping?.toFixed(2) || 5.99.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax:</Text>
              <Text style={styles.detailValue}>${orderData?.tax?.toFixed(2) || (totalAmount * 0.1).toFixed(2)}</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={[styles.detailLabel, styles.totalLabel]}>Total:</Text>
              <Text style={[styles.detailValue, styles.totalValue]}>
                ${orderData?.total?.toFixed(2) || (totalAmount + 5.99 + (totalAmount * 0.1)).toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Payment Method */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{orderData?.paymentMethod || "Credit Card"}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlenavigateOrders}
          >
            <Text style={styles.buttonText}>Track Your Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              navigation.navigate("HomeDrawer");
              dispatch(clearCart());
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
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  orderDetails: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 30,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  secondaryButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // Responsive adjustments
  "@media (maxWidth: 400)": {
    card: {
      padding: 20,
    },
    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 14,
    },
    actions: {
      flexDirection: "column",
    },
    primaryButton: {
      marginRight: 0,
      marginBottom: 10,
    },
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: "#666",
  },
  productQuantity: {
    fontSize: 13,
    color: "#666",
  },
  productTotal: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  summarySection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalValue: {
    fontWeight: "600",
    color: "#4caf50",
  },
});

export default OrderConfirmationScreen;