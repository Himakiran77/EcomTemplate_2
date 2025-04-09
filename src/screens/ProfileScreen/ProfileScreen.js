import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Dimensions,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Images from '../../assets/Images';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const TotalOrders = useSelector(state => state.orders.orders);
  const OrderCount = TotalOrders.length;
  const wishlistItems = useSelector(state => state.wishlist.items);
  const wishlistItemsCount = wishlistItems.length;
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(height * 0.1))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.profileHeader}>
          <View style={styles.avatarBackground}>
            <View style={styles.avatarContainer}>
              <Image 
                source={Images.YellowProfile}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editIcon}>
                <Text style={styles.editIconText}>✎</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.userName}>Mudambi Himakiran</Text>
          <Text style={styles.userEmail}>himakiranmudambi@gmail.com</Text>
          
          <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.statNumber}>{OrderCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Wishlist')}>
              <Text style={styles.statNumber}>{wishlistItemsCount}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Coupons</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>
          
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => handleNavigate('Orders')}
          >
            <View style={styles.infoContent}>
              <Image 
                source={Images.User}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Your Orders</Text>
            </View>
            <Image 
              source={Images.RightArrow}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoItem}
            // onPress={() => handleNavigate('Addresses')}
          >
            <View style={styles.infoContent}>
              <Image 
                source={Images.Location}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Your Addresses</Text>
            </View>
            <Image 
              source={Images.RightArrow}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>OTHER INFORMATION</Text>
          
          <TouchableOpacity 
            style={styles.infoItem}
            // onPress={() => handleNavigate('Notifications')}
          >
            <View style={styles.infoContent}>
              <Image 
                source={Images.Notification}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Notifications</Text>
            </View>
            <Image 
              source={Images.RightArrow}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoItem}
            // onPress={() => handleNavigate('Privacy')}
          >
            <View style={styles.infoContent}>
              <Image 
                source={Images.Lock}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Account Privacy</Text>
            </View>
            <Image 
              source={Images.RightArrow}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoItem}
            // onPress={() => handleNavigate('Terms')}
          >
            <View style={styles.infoContent}>
              <Image 
                source={Images.Terms}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Terms of Services</Text>
            </View>
            <Image 
              source={Images.RightArrow}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>


        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: height * 0.05,
  },
  profileHeader: {
    alignItems: 'center',
    padding: width * 0.05,
    paddingTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  avatarBackground: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: '#00eda6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#03DAC5',
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIconText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  userEmail: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.03,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    height: '60%',
    marginVertical: height * 0.01,
  },
  statNumber: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#00eda6',
  },
  statLabel: {
    fontSize: width * 0.035,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: width * 0.04,
    tintColor: '#00eda6',
    width: width * 0.05,  
    height: width * 0.05, 
    maxWidth: 24,         
    maxHeight: 24,        
    minWidth: 16,        
    minHeight: 16,       
    resizeMode: 'contain'
  },
  infoText: {
    fontSize: width * 0.045,
    color: '#333',
  },
  arrowIcon: {
    width: width * 0.05,  
    height: width * 0.05, 
    maxWidth: 24,         
    maxHeight: 24,        
    minWidth: 16,        
    minHeight: 16,       
    tintColor: '#999',
    resizeMode: 'contain' 
},
  logoutButton: {
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: '#ff4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;