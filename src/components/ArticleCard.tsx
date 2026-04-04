import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NewsArticle } from '../api/NewsService';

const ArticleCard = ({ article, onPress }: { article: NewsArticle; onPress?: () => void }) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate('ArticleDetails', { article });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.card}
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: article.image_url || 'https://via.placeholder.com/100' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.meta}>
          {article.source_name} · {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  image: { width: 75, height: 75, borderRadius: 15, backgroundColor: '#eee' },
  content: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '600', color: '#000', lineHeight: 20 },
  meta: { fontSize: 10, color: '#a1a1aa', marginTop: 6, fontWeight: '700', textTransform: 'uppercase' }
});

export default ArticleCard;