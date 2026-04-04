import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle } from "./NewsService";

const SAVED_ARTICLES_KEY = '@saved-article'

export const toggleSaveArticle = async (article: NewsArticle): Promise<boolean> => {
  const saved = await getSavedArticles();
  const isSaved = saved.find(a => a.article_id === article.article_id);
  
  let newSaved;
  if (isSaved) {
    newSaved = saved.filter(a => a.article_id !== article.article_id);
  } else {
    newSaved = [article, ...saved];
  }
  
  await AsyncStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(newSaved));
  return !isSaved; 
};

export const getSavedArticles = async (): Promise<NewsArticle[]> => {
  const data = await AsyncStorage.getItem(SAVED_ARTICLES_KEY);
  return data ? JSON.parse(data) : [];
};