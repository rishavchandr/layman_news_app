import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsArticle } from '../api/NewsService';
import { RootStackParamList } from '../routes/MainRouteNavigator';

const { width } = Dimensions.get('window');
export const CAROUSEL_ITEM_WIDTH = width - 48; 

type CarouselNavProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

type FeaturedCardProps = {
  article: NewsArticle;
};

const FeaturedArticleCard = ({ article }: FeaturedCardProps) => {
  const navigation = useNavigation<CarouselNavProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ArticleDetails', { article })}
      activeOpacity={0.9}
      className="rounded-[28px] mr-4 overflow-hidden bg-zinc-200"
      style={{
        width: CAROUSEL_ITEM_WIDTH,
        height: 220,
        shadowColor: '#1A1008',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <Image
        source={{ uri: article.image_url || 'https://via.placeholder.com/400' }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}
      >
        {article.category?.[0] && (
          <View
            className="self-start px-3 py-1 rounded-full mb-2"
            style={{ backgroundColor: '#E8572A' }}
          >
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
              {article.category[0]}
            </Text>
          </View>
        )}
        <Text
          className="text-white font-bold leading-snug"
          style={{ fontSize: 16 }}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        
        <Text className="text-white/60 text-[11px] mt-1 font-medium">
          {article.source_name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default FeaturedArticleCard;