import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/MainRouteNavigator';
import { NewsArticle, searchArticles} from '../api/NewsService';
import ArticleCard from '../components/ArticleCard';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

 const performSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const articles = await searchArticles(query);
      setResults(articles);
      if (articles.length === 0 && !loading) {
      }
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query]);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-2 border-b border-zinc-100">
        <Text className="text-3xl font-black text-black tracking-tighter mb-3">
          Search Articles
        </Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-zinc-100 rounded-full px-5 py-3 text-base"
            placeholder="Enter keywords..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={performSearch}
            returnKeyType="search"
            autoFocus
            placeholderTextColor="#a1a1aa"
          />
          <TouchableOpacity
            onPress={performSearch}
            className="bg-orange-500 rounded-full px-5 py-3"
          >
            <Text className="text-white font-bold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {loading && (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        )}

        {error && (
          <View className="mt-20 items-center">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity onPress={performSearch} className="mt-4 bg-orange-50 px-6 py-2 rounded-full">
              <Text className="text-orange-600 font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && results.length === 0 && query === '' && (
          <View className="mt-20 items-center">
            <Text className="text-zinc-400 text-center">Enter a keyword to search for news.</Text>
          </View>
        )}

        {!loading && !error && results.length === 0 && query !== '' && (
          <View className="mt-20 items-center">
            <Text className="text-zinc-400 text-center">No results found for "{query}".</Text>
          </View>
        )}

        {results.map((article) => (
          <ArticleCard
            key={article.article_id}
            article={article}
            onPress={() => navigation.navigate('ArticleDetails', { article })}
          />
        ))}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;