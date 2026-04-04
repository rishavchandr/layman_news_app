import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NewsArticle } from '../../api/NewsService';
import { getSavedArticles } from '../../api/ArticleService';
import ArticleCard from '../../components/ArticleCard';
import { RootStackParamList } from '../../routes/MainRouteNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const SavedScreen = () => {
  const [savedItems, setSavedItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const inputRef = useRef<TextInput>(null);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return savedItems;
    const query = searchQuery.toLowerCase();
    return savedItems.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.source_name?.toLowerCase().includes(query)
    );
  }, [savedItems, searchQuery]);

  const fetchSavedArticles = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getSavedArticles();
      setSavedItems(items);
    } catch (error) {
      console.error('Failed to load saved articles', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsSearching(false);
      setSearchQuery('');
      fetchSavedArticles();
    }, [fetchSavedArticles])
  );

  useEffect(() => {
    if (isSearching) {
      inputRef.current?.focus();
    }
  }, [isSearching]);

  const handleSearchToggle = () => {
    setIsSearching(true);
  };

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with dynamic content */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        {!isSearching ? (
          <>
            <Text className="text-3xl font-extrabold text-black tracking-tighter">
              Saved
            </Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.searchButton}onPress={handleSearchToggle} className="p-2">
                <FontAwesome name='search' size={20} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="flex-1 flex-row items-center bg-zinc-100 rounded-full px-5 py-2 mr-3">
              <TextInput
                ref={inputRef}
                placeholder="Search saved articles..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-base"
                placeholderTextColor="#a1a1aa"
                autoFocus
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text className="text-zinc-400 mr-2">✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleCloseSearch} className="p-2">
              <Text className="text-orange-600 font-bold">Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#FF8C00" className="mt-20" />
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((item) => (
            <ArticleCard
              key={item.article_id}
              article={item}
              onPress={() => navigation.navigate('ArticleDetails', { article: item })}
            />
          ))
        ) : (
          <View className="mt-20 items-center px-4">
            <View className="w-16 h-16 bg-zinc-100 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">🔖</Text>
            </View>
            <Text className="text-zinc-400 text-center font-medium italic">
              {searchQuery
                ? 'No saved articles match your search.'
                : 'Your saved collection is empty.'}
            </Text>
            {!searchQuery && !isSearching && (
              <Text className="text-zinc-300 text-center text-xs mt-2">
                Tap the bookmark on any article to see it here!
              </Text>
            )}
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  }
})

export default SavedScreen;