import React, { useCallback, useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  Text, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NewsArticle } from '../../api/NewsService';
import { getSavedArticles } from '../../api/ArticleService';
import ArticleCard from '../../components/ArticleCard';

const SavedScreen = () => {
  const navigation = useNavigation<any>();
  const [savedItems, setSavedItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getSavedArticles()
        .then(setSavedItems)
        .finally(() => setLoading(false));
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-4">
        <Text className="text-3xl font-extrabold text-black tracking-tighter">
          Saved
        </Text>
      </View>
      
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color="#FF8C00" className="mt-20" />
        ) : savedItems.length > 0 ? (
          savedItems.map((item) => (
            <ArticleCard 
              key={item.article_id} 
              article={item} 
              // onPress={() => navigation.navigate('Content', { article: item })}
            />
          ))
        ) : (
          <View className="mt-20 items-center px-4">
            <View className="w-16 h-16 bg-zinc-100 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">🔖</Text>
            </View>
            <Text className="text-zinc-400 text-center font-medium italic">
              Your saved collection is empty.
            </Text>
            <Text className="text-zinc-300 text-center text-xs mt-2">
              Tap the bookmark on any article to see it here!
            </Text>
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedScreen;