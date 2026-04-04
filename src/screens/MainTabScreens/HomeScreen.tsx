import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ArticleCard from '../../components/ArticleCard';
import FeaturedArticleCard, { CAROUSEL_ITEM_WIDTH } from '../../components/FeatureArticleCard';
import DotIndicator from '../../components/DotIndicator';
import { useFocusEffect } from '@react-navigation/native';
import { NewsArticle , fetchFeaturedNews , fetchTodaysPicks } from '../../api/NewsService';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { RootStackParamList } from '../../routes/MainRouteNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const HomeScreen = () => {
  const [featured, setFeatured] = useState<NewsArticle[]>([]);
  const [picks, setPicks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / (CAROUSEL_ITEM_WIDTH + 16));
      setActiveIndex(Math.min(index, featured.length - 1));
    },
    [featured.length]
  );

  const loadData = useCallback(async () => {
  if (!refreshing) setLoading(true);
  try {
    const [featuredData, picksData] = await Promise.all([
      fetchFeaturedNews(),
      fetchTodaysPicks(),
    ]);
    setFeatured(featuredData);
    setPicks(picksData);
  } catch (error) {
    
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [refreshing]);

useFocusEffect(
  useCallback(() => {
    loadData();
  }, [loadData])
);

const onRefresh = () => {
  setRefreshing(true);
  loadData();
};

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#FFF5F0', '#FFFFFF']} style={styles.gradient}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Layman</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.searchButton} onPress={() => navigation.navigate('SearchScreen')}>
            <FontAwesome name='search' color="#e4e4e7" size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF8C00" />
          }
        >
          {/* Featured Carousel */}
          {featured.length > 0 && (
            <View style={styles.carouselContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CAROUSEL_ITEM_WIDTH + 16}
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.carouselContent}
              >
                {featured.map((item) => (
                  <FeaturedArticleCard
                    key={`feat-${item.article_id}`}
                    article={item}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Dot Indicator */}
          <DotIndicator total={featured.length} active={activeIndex} />

          {/* Today's Picks */}
          <View style={styles.picksContainer}>
            <View style={styles.picksHeader}>
              <Text style={styles.picksTitle}>Today's Picks</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {picks.length > 0 ? (
              picks.map((item) => (
                <ArticleCard
                  key={`pick-${item.article_id}`}
                  article={item}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No picks available right now.</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
searchButton: {
    width: 44, 
    height: 44,
    borderRadius: 22, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#f4f4f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  carouselContainer: {
    paddingVertical: 24,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  picksContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  picksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  picksTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#18181b',
  },
  viewAllText: {
    color: '#ea580c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#a1a1aa',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
  },
  retryText: {
    color: '#ea580c',
    fontWeight: 'bold',
  },
});

export default HomeScreen;