import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useRouter,router } from 'expo-router';


const PRODUCT_MEDIA_BASE_URL = 'https://omanphone.smsoman.com/pub/media/catalog/product/';
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth) / 2; // 2 columns with margin

interface Product {
    name: string;
    id: string;
    image: string;
    price: number;
    storage: string | false;
    product_tag: string | null;
    preorder: string;
    rating?: number;
    old_price?: number;
}

interface ProductListSection {
    title: string;
    items: Product[];
}

export default function ProductGridSection() {
    const [sections, setSections] = useState<ProductListSection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await axios.get('http://omanphone.smsoman.com/api/homepage');
                const rawData = res.data;

                const productSections: ProductListSection[] = rawData
                    .filter((block: any) => block.type === 'productlist' && block.data.items.length > 0)
                    .map((block: any) => ({
                        title: block.data.title,
                        items: block.data.items,
                    }));

                setSections(productSections);
            } catch (error) {
                console.error('Failed to load homepage products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#d90000" />
            </View>
        );
    }

    const renderProductItem = (item: Product) => (
        <TouchableOpacity style={styles.card} key={item.id}
        onPress={()=>router.push(`/Product/${item.id}`)}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: PRODUCT_MEDIA_BASE_URL + item.image.replace(/^\/+/, '') }}
                    style={styles.image}
                    resizeMode="contain"
                />
                {item.storage && (
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.storage}</Text>
                    </View>
                )}
                {item.rating && (
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>OMR {item.price.toFixed(3)}</Text>
                {item.old_price && (
                    <Text style={styles.oldPrice}>OMR {item.old_price.toFixed(3)}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderProductRow = (products: Product[]) => {
        return (
            <View style={styles.productRow} key={`row-${products[0].id}`}>
                {products.map(renderProductItem)}
            </View>
        );
    };

    const renderProductGrid = (items: Product[]) => {
        const rows = [];
        for (let i = 0; i < items.length; i += 2) {
            const rowProducts = items.slice(i, i + 2);
            rows.push(renderProductRow(rowProducts));
        }
        return rows;
    };

    return (
        <View style={styles.container}>
            {sections.map((section, index) => (
                <View key={`section-${index}`}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                            {section.title}
                        </Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAll}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productsContainer}>
                        {renderProductGrid(section.items)}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingBottom: 0,
    },
    sectionHeader: {
        marginTop: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        marginRight: 8,
    },
    viewAllButton: {
        width: 80,
        alignItems: 'center',
        backgroundColor:"red",
        paddingVertical:6,
        borderRadius:6
    },
    viewAll: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
    productsContainer: {
        // paddingHorizontal: 12,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        // borderRadius: 8,
        overflow: 'hidden',
        elevation: 1,
    },
    imageWrapper: {
        position: 'relative',
        backgroundColor: '#f8f8f8',
    },
    image: {
        width: '100%',
        height: 130,
    },
    tag: {
        position: 'absolute',
        right: 6,
        bottom: 6,
        backgroundColor: 'white',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },
    tagText: {
        fontSize: 10,
        color: 'red',
        fontWeight: 'bold',
    },
    ratingBadge: {
        position: 'absolute',
        left: 6,
        top: 6,
        backgroundColor: '#ffc107',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    ratingText: {
        fontSize: 10,
        color: '#000',
    },
    name: {
        fontSize: 13,
        fontWeight: '500',
        padding: 8,
        paddingBottom: 2,
        color: '#333',
        minHeight: 40,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 10,
    },
    price: {
        fontSize: 13,
        color: '#d90000',
        fontWeight: 'bold',
    },
    oldPrice: {
        fontSize: 11,
        color: '#888',
        marginLeft: 6,
        textDecorationLine: 'line-through',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});  