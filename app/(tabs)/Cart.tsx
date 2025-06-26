import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { router } from 'expo-router';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  const handleUpdateQuantity = (productId: string, change: number) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    console.log("checkout")
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          My Cart ({cartCount})
        </Text>
      </View>

      <View style={styles.mainContent}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <View style={styles.detailsContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image[0] }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.cartBottomContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    OMR {(Number(item.price) * item.quantity).toFixed(3)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="black" />
                </TouchableOpacity>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => handleUpdateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                    disabled={item.quantity <= 1}
                  >
                    <Text style={[styles.quantityButtonText, item.quantity <= 1 && styles.disabledButton]}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleUpdateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.totalLabel}>
                TOTAL
              </Text>
              <Text style={styles.totalPrice}>
                OMR {cartTotal.toFixed(3) || 0}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, cartCount === 0 && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={cartCount === 0}
            >
              <Text style={styles.checkoutButtonText}>
                CHECKOUT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  mainContent: {
    flex: 1
  },
  header: {
    backgroundColor: 'rgb(230, 0, 0)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 16
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 100 
  },
  itemContainer: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center'
  },
  cartBottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 4,
  },
  productName: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(230, 0, 0)'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#374151'
  },
  disabledButton: {
    color: '#D1D5DB'
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center'
  },
  bottomSpacer: {
    height: 20
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 90
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(230, 0, 0)'
  },
  checkoutButton: {
    backgroundColor: 'rgb(230, 0, 0)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 4,
    minWidth: 120,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default Cart;