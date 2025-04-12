import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Images from '../../assets/Images';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const isSmallDevice = width < 375;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = products.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((item) => 
        item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const formatCategoryName = (category) => {
    if (category === "men's clothing") return "Men";
    if (category === "women's clothing") return "Women";
    if (category === "jewelery") return "Jewelry";
    return category;
  };

  const handlenavigateToProfile = () => {
    navigation.navigate('Profile');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>

          {/* Logo */}
          <TouchableOpacity onPress={handlenavigateToProfile}>
          <Image 
            source={Images.KalaiLogo} 
            style={styles.KalaiLogoHeader}
          />
          </TouchableOpacity>

          {/* Search Input */}
          <View style={styles.searchWrapper}>
            <Image 
              source={Images.Search} 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Products..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              clearButtonMode="while-editing"
            />
          </View>
        </View>


      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScrollContent}
        >
          {['All', 'Electronics','jewelery', "men's clothing", "women's clothing"].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
                isSmallDevice && styles.categoryButtonSmall
              ]}
              onPress={() => filterByCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
                isSmallDevice && styles.categoryTextSmall
              ]}>
                {formatCategoryName(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading and Error States */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchProducts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noResultsText}>No products found</Text>
        </View>
      ) : (
        <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}  // This ensures a 2-column grid layout
        style={styles.FlatList}
        renderItem={({ item }) => (
            <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  
  KalaiLogoHeader: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    paddingHorizontal: 10,
    flex: 1,
  },
  
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#6c757d',
    marginRight: 6,
  },
  
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#212529',
    paddingVertical: 0,
  },
  
  categoryFilterContainer: {
    paddingVertical: '2%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryScrollContent: {
    paddingHorizontal: '3%',
    paddingVertical: 5,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: Dimensions.get('window').width < 375 ? 12 : 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007bff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: Dimensions.get('window').width < 375 ? 13 : 14,
    fontWeight: '600',
    color: '#495057',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  FlatList: {
    paddingHorizontal: '2%',
    paddingTop: '2%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  errorText: {
    color: '#dc3545',
    fontSize: Dimensions.get('window').width < 375 ? 14 : 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  noResultsText: {
    color: '#6c757d',
    fontSize: Dimensions.get('window').width < 375 ? 15 : 17,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;