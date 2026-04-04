import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  fetchFeaturedNews,
  fetchTodaysPicks,
  NewsArticle,
} from '../../api/NewsService';
import ArticleCard from '../../components/ArticleCard';
import FeaturedArticleCard from '../../components/FeatureArticleCard';

const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width - 40;

const HomeScreen = () => {
  const [featured, setFeatured] = useState<NewsArticle[]>([]);
  const [picks, setPicks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [featuredData, picksData] = await Promise.all([
        fetchFeaturedNews().catch(() => []),
        fetchTodaysPicks().catch(() => []),
      ]);

      setFeatured(Array.isArray(featuredData) ? featuredData : []);
      setPicks(Array.isArray(picksData) ? picksData : []);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FFF5F0]">
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#FFF5F0', '#FFFFFF']} className="flex-1">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* Header - Fixed with Nativewind */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-zinc-100">
          <Text className="text-3xl font-[900] text-black tracking-tighter">
            Layman
          </Text>

          <TouchableOpacity 
            activeOpacity={0.8} 
            className="flex-row items-center bg-white rounded-full px-4 h-10 w-[45%] justify-between border border-zinc-100 shadow-sm"
          >
            <Text className="text-zinc-400 text-xs font-medium">Search</Text>
            <View className="w-4 h-4 rounded-full border-2 border-zinc-200" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF8C00" />
          }
        >
          {/* Featured Carousel */}
          {featured.length > 0 && (
            <View className="py-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CAROUSEL_ITEM_WIDTH + 16}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 20 }}
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

          {/* Today's Picks */}
          <View className="px-5 mt-2">
            <View className="flex-row justify-between items-end mb-5">
              <Text className="text-2xl font-black text-zinc-900">Today's Picks</Text>
              <TouchableOpacity>
                <Text className="text-orange-600 font-bold text-sm">View All</Text>
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
              <View className="bg-white/60 rounded-[32px] p-10 border border-zinc-100 items-center border-dashed">
                <Text className="text-zinc-400 text-center font-semibold text-base">
                  No picks available right now.
                </Text>
                <TouchableOpacity 
                  onPress={loadData} 
                  className="mt-4 bg-orange-50 px-6 py-2 rounded-full"
                >
                  <Text className="text-orange-600 font-bold">Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;