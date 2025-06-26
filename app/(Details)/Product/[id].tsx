import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useCart } from '../../../context/CartContext';

type ProductImage = string[];

interface ProductSpec {
    icon: string;
    value: string;
    title: string;
}

interface ProductAttrs {
    color?: string;
    specs?: ProductSpec[];
}

interface Product {
    id: string;
    name: string;
    price: string;
    original_price?: string;
    image: ProductImage;
    short_description?: string;
    description?: string;
    attrs?: ProductAttrs;
    rating?: number;
}

interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string[];
    quantity: number;
}

const Product = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const { width } = useWindowDimensions();
    const { addToCart, cartCount } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    const { width: windowWidth } = Dimensions.get('window');

    const handleImageScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / windowWidth);
        setCurrentImageIndex(currentIndex);
    };

    const scrollToIndex = (index: number) => {
        const scrollViewRef: any = imageScrollRef.current;
        scrollViewRef.scrollTo({ x: windowWidth * index, animated: true });
        setCurrentImageIndex(index);
    };

    const imageScrollRef = React.useRef(null);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`https://omanphone.smsoman.com/api/productdetails?id=${id}`);
            const data: Product = await response.json();
            setProduct(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        const cartItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        };

        addToCart(cartItem);
        setAddedToCart(true);
    };

    const handleGoToCart = () => {
        router.push('/Cart');
    };

    const renderStarRating = (rating: number) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 4, fontWeight: 'bold' }}>{rating.toFixed(1)}</Text>
                <Ionicons name="star" size={16} color="#FFD700" />
            </View>
        );
    };

    const cleanHtmlDescription = (html: string) => {
        return html
            .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
            .replace(/<p>\s*<\/p>/g, '')
            .replace(/<strong>/g, '<b>')
            .replace(/<\/strong>/g, '</b>');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E53E3E" />
                    <Text>Loading product details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text>Product not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Item Details</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => router.push('/Cart')}
                    >
                        <FontAwesome name="shopping-cart" size={24} color="white" />

                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <ScrollView
                        ref={imageScrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleImageScroll}
                        scrollEventThrottle={16}
                        style={styles.horizontalScroll}
                    >
                        {product.image.map((img, index) => (
                            <View key={index} style={[styles.imageWrapper, { width: windowWidth }]}>
                                <Image
                                    source={{ uri: img }}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color="#999" />
                    </TouchableOpacity>

                    {product.image && product.image.length > 1 && (
                        <View style={styles.imageIndicators}>
                            {product.image.map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        currentImageIndex === index && styles.activeIndicator
                                    ]}
                                    onPress={() => scrollToIndex(index)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>

                    {product.rating && (
                        <View style={styles.ratingContainer}>
                            <View style={styles.stars}>
                                {renderStarRating(product.rating)}
                            </View>
                        </View>
                    )}

                    <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>OMR {product.price}</Text>
                        {product.original_price && (
                            <Text style={styles.originalPrice}>OMR {product.original_price}</Text>
                        )}
                    </View>

                    {product.attrs?.color && (
                        <View style={styles.colorContainer}>
                            <Text style={styles.sectionLabel}>color</Text>
                            <View style={styles.colorSection}>
                                <Image
                                    source={{ uri: product.attrs.color }}
                                    style={styles.colorSwatch}
                                />
                            </View>
                        </View>
                    )}

                    {product.attrs?.specs && (
                        <View style={styles.specsContainer}>
                            {product.attrs.specs.map((spec, index) => (
                                <View key={index} style={styles.specItem}>
                                    <Image
                                        source={{ uri: spec.icon }}
                                        style={styles.specIcon}
                                    />
                                    <Text style={styles.specValue}>{spec.value}</Text>
                                    <Text style={styles.specTitle}>{spec.title}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.aboutSection}>
                        <Text style={styles.aboutTitle}>About product</Text>
                    </View>

                    {product.short_description && (
                        <View style={styles.descriptionContainer}>
                            <RenderHtml
                                contentWidth={width}
                                source={{ html: cleanHtmlDescription(product.short_description) }}
                                baseStyle={styles.description}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.viewDetailsContainer}
                        onPress={() => setShowFullDescription(!showFullDescription)}
                    >
                        <Text style={styles.viewDetailsText}>
                            {showFullDescription ? 'Hide details' : 'View details...'}
                        </Text>
                    </TouchableOpacity>

                    {showFullDescription && product.description && (
                        <View style={styles.fullDescriptionContainer}>
                            <RenderHtml
                                contentWidth={width}
                                source={{ html: cleanHtmlDescription(product.description) }}
                                baseStyle={styles.fullDescriptionText}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.addToCartContainer}>
                {addedToCart ? (
                    <TouchableOpacity
                        style={[styles.addToCartButton, styles.goToCartButton]}
                        onPress={handleGoToCart}
                    >
                        <Text style={styles.addToCartText}>GO TO CART</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={handleAddToCart}
                    >
                        <Text style={styles.addToCartText}>ADD TO CART</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    horizontalScroll: {
        flex: 1,
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: 'rgb(230, 0, 0)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    headerIcon: {
        padding: 4,
        marginLeft: 8,
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        paddingVertical: 20,
        position: 'relative',
    },
    productImage: {
        width: 200,
        height: 300,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageIndicators: {
        flexDirection: 'row',
        marginTop: 20,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#E53E3E',
    },
    productInfo: {
        padding: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    ratingContainer: {
        marginBottom: 12,
    },
    stars: {
        flexDirection: 'row',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    currentPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E53E3E',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    colorSection: {
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: '#666',
        marginBottom: 8,
        textTransform: 'capitalize',
        margin: 10
    },
    colorContainer: {
        flexDirection: 'row',
        backgroundColor: "rgb(220, 220, 220)",
        alignItems: "center"
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    specsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    specItem: {
        alignItems: 'center',
        width: '30%',
        marginBottom: 16,
    },
    specIcon: {
        width: 24,
        height: 24,
        marginBottom: 4,
    },
    specValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    specTitle: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    aboutSection: {
        marginBottom: 4,
    },
    aboutTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    viewDetailsContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    viewDetailsText: {
        fontSize: 14,
        color: '#E53E3E',
        fontWeight: '500',
        textAlign: 'center',
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    fullDescriptionContainer: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    fullDescriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    addToCartContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addToCartButton: {
        backgroundColor: 'rgb(230, 0, 0)',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#E53E3E',
        fontSize: 12,
        fontWeight: 'bold',
    },
    goToCartButton: {
        backgroundColor: '#4CAF50',
    },
});

export default Product;