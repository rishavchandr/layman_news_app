
import {NEWS_API_KEY} from "@env"

const API_KEY = NEWS_API_KEY || 'YOUR_NEWSDATA_API_KEY'; 
const BASE_URL = 'https://newsdata.io/api/1/latest';

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  source_name: string;
  pubDate: string;
  category: string[];
}

export const fetchFeaturedNews = async (): Promise<NewsArticle[]> => {
  const url = `${BASE_URL}?apikey=${API_KEY}&category=technology,business&language=en&image=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
};

export const fetchTodaysPicks = async (): Promise<NewsArticle[]> => {
  const url = `${BASE_URL}?apikey=${API_KEY}&q=startup,funding&language=en&image=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
};