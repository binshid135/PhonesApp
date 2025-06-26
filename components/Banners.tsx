import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const { width: viewportWidth } = Dimensions.get('window');
const BANNER_HEIGHT = viewportWidth * 0.7; // Increased height (70% of screen width)

interface BannerItem {
  image: string;
  type: string;
  id: string;
  sort_order: string;
}

const Banners = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://omanphone.smsoman.com/api/configuration');
        if (response.data?.status === 'success') {
          const sliderData = response.data?.data?.slider || [];
          setBanners(sliderData.filter((item: BannerItem) => item?.image));
        } else {
          setError('Failed to load banners');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (banners.length > 1) {
      autoScrollInterval.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * viewportWidth,
          animated: true,
        });
      }, 5000);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [banners.length, currentIndex]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / viewportWidth);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { height: BANNER_HEIGHT }]}>
        <ActivityIndicator size="large" color="#d90000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { height: BANNER_HEIGHT }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height: BANNER_HEIGHT }]}>
        <Text style={styles.emptyText}>No banners available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: BANNER_HEIGHT }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
      >
        {banners.map((item, index) => (
          <TouchableOpacity
            key={`banner-${index}`}
            activeOpacity={0.9}
            onPress={() => console.log(`Navigate to type: ${item.type}, id: ${item.id}`)}
          >
            <Image
              source={{ uri: item.image }}
              style={[styles.image, { height: BANNER_HEIGHT }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: viewportWidth,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e3e5',
  },
  errorText: {
    color: '#721c24',
    textAlign: 'center',
    padding: 10,
  },
  emptyText: {
    color: '#383d41',
    textAlign: 'center',
    padding: 10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: '#d90000',
  },
});

export default Banners;