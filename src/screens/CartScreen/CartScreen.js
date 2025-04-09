import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, incrementQuantity, decrementQuantity } from '../../redux/cartSlice';
import Images from '../../assets/Images';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.total);
  const navigation = useNavigation();

  const handleNavigateCheckout = () => {
    navigation.navigate('Checkout', {
      cartItems: cartItems,
      totalAmount: totalAmount,
      shippingFee: 5.99,
      grandTotal: totalAmount + 5.99
    });
  }

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeFromCart(itemId)), style: 'destructive' },
      ]
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: () => dispatch(clearCart()), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => dispatch(decrementQuantity(item.id))}
            disabled={item.quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => dispatch(incrementQuantity(item.id))}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Image source={Images.Delete} style={styles.deleteIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}></Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Add some products to get started</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>$5.99</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${(totalAmount + 5.99).toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleNavigateCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    paddingBottom: width * 0.03,
    // backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    color: '#FF6347',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1,
  },
  emptyIcon: {
    fontSize: width * 0.2,
    marginBottom: height * 0.02,
  },
  emptyText: {
    fontSize: width * 0.05,
    color: '#666',
    fontWeight: '500',
    marginBottom: height * 0.01,
  },
  emptySubText: {
    fontSize: width * 0.04,
    color: '#999',
    textAlign: 'center',
    marginHorizontal: width * 0.1,
  },
  continueShoppingButton: {
    marginTop: height * 0.03,
    backgroundColor: '#00eda6',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.02,
  },
  continueShoppingText: {
    color: 'black',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  listContent: {
    padding: width * 0.04,
    paddingBottom: height * 0.5,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.005,
  },
  itemPrice: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: height * 0.01,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginHorizontal: width * 0.04,
    color: '#333',
  },
  deleteButton: {
    padding: width * 0.02,
    alignSelf: 'flex-start',
  },
  deleteIcon: {
    width: width * 0.06,
    height: width * 0.06,
    // tintColor: '#FF6347',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
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
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
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
    color: 'green',
  },
  checkoutButton: {
    backgroundColor: '#00eda6',
    borderRadius: width * 0.02,
    paddingVertical: height * 0.02,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default CartScreen;