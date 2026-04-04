import { supabase } from '../lib/supabase';
import { NewsArticle } from './NewsService';

export const toggleSaveArticle = async (article: NewsArticle): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: existing } = await supabase
    .from('saved_articles')
    .select('id')
    .eq('user_id', user.id)
    .eq('article_id', article.article_id)
    .single();

  if (existing) {
   const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('saved_articles')
      .insert({
        user_id: user.id,
        article_id: article.article_id,
        article_data: article,
      });
    if (error) throw error;
    return true; 
  }
};

export const getSavedArticles = async (): Promise<NewsArticle[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_articles')
    .select('article_data')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return data?.map(row => row.article_data) || [];
};

export const isArticleSaved = async (articleId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count, error } = await supabase
    .from('saved_articles')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('article_id', articleId);

  if (error) throw error;
  return (count ?? -1) > 0;
};