import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Share,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { RootStackParamList } from '../routes/MainRouteNavigator';
import { toggleSaveArticle, isArticleSaved } from '../api/ArticleService'
import DotIndicator from '../components/DotIndicator';
import { NewsArticle } from '../api/NewsService';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 48;

type ArticleDetailsNav = NativeStackNavigationProp<RootStackParamList, 'ArticleDetails'>;
type ArticleDetailsRoute = RouteProp<RootStackParamList, 'ArticleDetails'>;


const IconBtn = ({
  name,
  onPress,
  active,
}: {
  name: any;
  onPress: () => void;
  active?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: active ? '#FFF0EB' : '#F4F4F5',
      borderRadius: 20,
      borderWidth: active ? 1 : 0,
      borderColor: active ? '#E8572A' : 'transparent',
    }}
  >
    <FontAwesome
      name={name}
      size={20}
      color={active ? '#E8572A' : '#3F3F46'}
    />
  </TouchableOpacity>
);

const splitIntoCards = (text: string): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const third = Math.ceil(sentences.length / 3);
  return [
    sentences.slice(0, third).join(' ').trim(),
    sentences.slice(third, third * 2).join(' ').trim(),
    sentences.slice(third * 2).join(' ').trim(),
  ].filter(Boolean).concat(
    Array(3).fill('More details coming soon.')
  ).slice(0, 3);
};

const ArticleDetailsScreen = () => {
  const navigation = useNavigation<ArticleDetailsNav>();
  const route = useRoute<ArticleDetailsRoute>();
  const { article } = route.params;
  const [showWebView, setShowWebView] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const laymanCards: string[] = splitIntoCards(article.description) ?? [
    "xAI, Elon Musk's AI company, just raised $6 billion from big investors. They'll use the money to buy thousands of powerful chips and build an AI smarter than ChatGPT.",
    "xAI, Elon Musk's AI company, just raised $6 billion from big investors. They'll use the money to buy thousands of powerful chips and build an AI smarter than ChatGPT."
  ];
  const validCards = laymanCards.filter(card => card && card.trim().length > 0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16));
      setActiveIndex(index);
    },
    []
  );

  useEffect(() => {
    handleSave(article)
  }, [])

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nRead on Layman`,
        url: article.link,
      });
    } catch { }
  };

  const handleSave = async (articles: NewsArticle) => {
    const isSaved = await isArticleSaved(articles.article_id)
    setSaved(isSaved)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row justify-between items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F4F5',
            borderRadius: 20,
          }}
        >
          <FontAwesome name="chevron-left" size={15} color="#3F3F46" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <IconBtn name="link" onPress={() => setShowWebView(true)} />

          <IconBtn
            name={saved ? "bookmark" : "bookmark-o"}
            onPress={() => toggleSaveArticle(article)}
            active={saved}
          />
          <IconBtn name="share-alt" onPress={handleShare} />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >

        <View className="px-5 mt-2 mb-5" style={{ height: 72 }}>
          <Text
            style={{ fontSize: 24, fontWeight: '800', lineHeight: 36, color: '#18181B' }}
            numberOfLines={2}
          >
            {article.title}
          </Text>
        </View>

        <View className="px-5 mb-6">
          <Image
            source={{ uri: article.image_url || 'https://via.placeholder.com/400x240' }}
            style={{ width: '100%', height: 220, borderRadius: 28 }}
            className="bg-zinc-200"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {validCards.map((text, index) => (
            <View key={index} style={{
                width: CARD_WIDTH,
                marginRight: 16,
                height: 210,
                backgroundColor: '#FAFAFA',
                borderRadius: 28,
                borderWidth: 1,
                borderColor: '#F0F0F0',
                padding: 24,
                justifyContent: 'space-between',
                shadowColor: '#1A1008',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <Text numberOfLines={6} 
              style={{
                  fontSize: 16,
                  lineHeight: 26,
                  color: '#27272A',
                  fontWeight: '500',
                  flex: 1,
                  marginTop: 14,
                  }}
                  >
                {text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <DotIndicator total={validCards.length} active={activeIndex} />
      </ScrollView>

      <View
        className="px-5 pb-6 pt-3 bg-white"
        style={{ borderTopWidth: 1, borderTopColor: '#F4F4F5' }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AskLayman', { article })
          }
          activeOpacity={0.88}
          style={{
            height: 58,
            borderRadius: 99,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: '#E8572A',
            shadowColor: '#E8572A',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>✦</Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: '800',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Ask Layman
          </Text>
        </TouchableOpacity>
      </View>


      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWebView(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#F4F4F5',
            }}
          >
            <Text
              style={{ flex: 1, fontSize: 12, color: '#71717A', fontWeight: '500' }}
              numberOfLines={1}
            >
              {article.link}
            </Text>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={{ color: '#E8572A', fontWeight: '700', fontSize: 15, marginLeft: 12 }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <WebView
            source={{ uri: article.link }}
            style={{ flex: 1 }}
            startInLoadingState
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ArticleDetailsScreen;