import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, Platform, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist } from '../../redux/wishlistSlice';
import Images from '../../assets/Images';

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeFromWishlist(itemId)), style: 'destructive' },
      ]
    );
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;
    
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: () => dispatch(clearWishlist()), style: 'destructive' },
      ]
    );
  };

  const navigateToProductDetails = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const renderItem = ({ item }) => (
    <ScrollView>
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigateToProductDetails(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Image source={Images.Delete} style={styles.deleteIcon} resizeMode="contain" />
      </TouchableOpacity>
    </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}></Text>
        {wishlistItems.length > 0 && (
          <TouchableOpacity onPress={handleClearWishlist}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubText}>Add items to your wishlist to see them here</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    color: '#ccc',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  continueShoppingButton: {
    marginTop: 30,
    backgroundColor: '#00eda6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteIcon: {
    width: Dimensions.get('window').width * 0.06,
    height: Dimensions.get('window').width * 0.06,
    minWidth: 20,
    maxWidth: 30,
    minHeight: 20,
    maxHeight: 30,
  },
});

export default WishlistScreen;