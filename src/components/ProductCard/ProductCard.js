import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions
} from 'react-native';

const ProductCard = ({ product, onPress }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width / 2) - 16; 

  return (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text 
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.title}
        </Text>
        <Text style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4, // Space between cards
  },
  imageContainer: {
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  textContainer: {
    padding: 12,
    paddingTop: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
  },
});

export default ProductCard;
