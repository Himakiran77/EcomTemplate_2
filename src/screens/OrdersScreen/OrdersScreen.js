import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, 
  Dimensions, Animated, Platform, ActivityIndicator 
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const OrdersScreen = () => {
  const navigation = useNavigation();
  const orders = useSelector(state => state.orders.orders);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [height * 0.25, height * 0.15],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const renderOrderItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp"
      delay={index * 100}
      style={styles.orderCard}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{item.orderId?.split('-')[1] || 'N/A'}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        {item.items.slice(0, 3).map((product, i) => (
          <View key={`${item.id}-${i}`} style={styles.productPreview}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage} 
              resizeMode="cover"
            />
            {i === 2 && item.items.length > 3 && (
              <View style={styles.moreItemsOverlay}>
                <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>${item.total.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => navigation.navigate('OrderDetail', { orderId: item.orderId })}
        >
          <Text style={styles.detailButtonText}>View Details ➜</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'processing': return '#FFA50020';
      case 'shipped': return '#1E90FF20';
      case 'delivered': return '#32CD3020';
      case 'cancelled': return '#FF000020';
      default: return '#6200EE20';
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <View style={styles.menuIcon}>
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                  </View>
                </TouchableOpacity>  
        </View> */}
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders placed</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.bagEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>Your completed orders will appear here</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#00eda6',
    borderBottomWidth: 1,
    borderBottomColor: '#00eda6',
  },
  menuIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  
  menuLine: {
    width: 22,
    height: 2,
    backgroundColor: '#333',
    marginVertical: 2,
    borderRadius: 1,
  },
  header: {
    backgroundColor: '#00eda6',
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: width * 0.04,
    // color: 'rgba(255,255,255,0.8)',
    color: 'black',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  listContent: {
    padding: width * 0.04,
    paddingBottom: height * 0.1,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderBody: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  moreItemsOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bagEmoji: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  shopButton: {
    backgroundColor: '#00eda6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen;
