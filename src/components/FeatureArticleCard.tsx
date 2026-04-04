import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
      activeOpacity={0.95}
      style={styles.card}
    >
      <Image
        source={{ uri: article.image_url || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
        locations={[0.3, 0.7, 1]}
        style={styles.gradient}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 240, // Increased height slightly for a more premium feel
    borderRadius: 32, // Smooth rounded corners as seen in your screenshot
    marginRight: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0, // Makes the gradient container fill the entire card
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 24, // Generous padding for the text
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800', // Extra bold like the screenshot
    lineHeight: 28,
    letterSpacing: -0.5,
  },
});

export default FeaturedArticleCard;