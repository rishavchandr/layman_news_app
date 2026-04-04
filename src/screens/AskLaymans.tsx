import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp,useNavigation,useRoute } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { RootStackParamList } from '../routes/MainRouteNavigator';
import { sendGrokMessage, generateGrokSuggestions, GrokMessage } from '../api/GrokAIService';

type AskLaymanNav = NativeStackNavigationProp<RootStackParamList, 'AskLayman'>;
type AskLaymanRoute = RouteProp<RootStackParamList, 'AskLayman'>;

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const TypingDots = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(dot, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 }}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: '#A1A1AA',
            transform: [{ translateY: dot }],
          }}
        />
      ))}
    </View>
  );
};

const Bubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';
  return (
    <View style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '80%', marginBottom: 10 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
          borderBottomRightRadius: isUser ? 4 : 20,
          borderBottomLeftRadius: isUser ? 20 : 4,
          backgroundColor: isUser ? '#E8572A' : '#F4F4F5',
        }}
      >
        <Text style={{ fontSize: 15, lineHeight: 22, color: isUser ? '#fff' : '#18181B', fontWeight: '500' }}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const Chip = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 99,
      borderWidth: 1.5,
      borderColor: '#E8572A',
      backgroundColor: '#FFF8F5',
      marginBottom: 8,
      alignSelf: 'flex-start',
    }}
  >
    <Text style={{ fontSize: 13, color: '#E8572A', fontWeight: '600' }}>{text}</Text>
  </TouchableOpacity>
);


const AskLaymans = () => {
    const navigation = useNavigation<AskLaymanNav>();
  const route = useRoute<AskLaymanRoute>();
  const { article } = route.params;

  const articleContext = {
    title: article.title,
    summary: [
      article.description ?? 'No summary available for this article.',
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi, I'm Layman! What do you want to know about this article?",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionsReady, setSuggestionsReady] = useState(false);

  const history = useRef<GrokMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    generateGrokSuggestions(articleContext.title, articleContext.summary)
      .then(qs => setSuggestions(qs))
      .catch(() =>
        setSuggestions([
          "What's the main takeaway?",
          'Who does this affect?',
          'What happens next?',
        ])
      )
      .finally(() => setSuggestionsReady(true));
  }, []);

  const scrollToEnd = () =>
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

  const handleSend = useCallback(
    async (text?: string) => {
      const userText = (text ?? input).trim();
      if (!userText || loading) return;

      setInput('');
      setSuggestions([]);

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userText,
      };
      setMessages(prev => [...prev, userMsg]);
      history.current.push({ role: 'user', content: userText });
      scrollToEnd();

      setLoading(true);
      try {
        const reply = await sendGrokMessage(userText, articleContext, history.current);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
        };
        setMessages(prev => [...prev, botMsg]);
        history.current.push({ role: 'assistant', content: reply });
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Something went wrong — try asking again?',
          },
        ]);
      } finally {
        setLoading(false);
        scrollToEnd();
      }
    },
    [input, loading, articleContext]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#F4F4F5',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F4F5',
            borderRadius: 19,
          }}
        >
          <FontAwesome6 name="xmark" size={15} color="#3F3F46" iconStyle="solid" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#18181B' }}>Ask Layman</Text>
          <Text style={{ fontSize: 11, color: '#A1A1AA', marginTop: 1 }}>Powered by Grok</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <View
          style={{
            backgroundColor: '#FFF8F5',
            borderRadius: 99,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#FFE0D6',
          }}
        >
          <Text style={{ fontSize: 12, color: '#E8572A', fontWeight: '600' }} numberOfLines={1}>
            {article.title}
          </Text>
        </View>
      </View>

      {/* Message list */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <Bubble message={item} />}
          ListFooterComponent={
            <>
              {loading && (
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#F4F4F5',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 20,
                    borderBottomLeftRadius: 4,
                    marginBottom: 10,
                  }}
                >
                  <TypingDots />
                </View>
              )}
              {suggestionsReady && suggestions.length > 0 && !loading && (
                <View style={{ marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#A1A1AA',
                      fontWeight: '600',
                      marginBottom: 10,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Try asking
                  </Text>
                  {suggestions.map((s, i) => (
                    <Chip key={i} text={s} onPress={() => handleSend(s)} />
                  ))}
                </View>
              )}
            </>
          }
        />

        {/* Input bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 12,
            paddingBottom: Platform.OS === 'ios' ? 24 : 14,
            borderTopWidth: 1,
            borderTopColor: '#F4F4F5',
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              backgroundColor: '#F4F4F5',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
              gap: 8,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 15,
                color: '#18181B',
                maxHeight: 100,
                minHeight: 22,
                lineHeight: 22,
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type your question..."
              placeholderTextColor="#A1A1AA"
              multiline
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <FontAwesome6 name="microphone" size={15} color="#A1A1AA" iconStyle="solid" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: input.trim() && !loading ? '#E8572A' : '#E4E4E7',
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <FontAwesome6 name="arrow-up" size={16} color="#fff" iconStyle="solid" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AskLaymans;