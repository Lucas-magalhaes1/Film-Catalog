// src/storage/reviews.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEWS_KEY = '@avaliacoes_filmes';

export interface Review {
  name: string;
  message: string;
  rating: number;
  date: string;
}

export const getReviews = async (id: string): Promise<Review[]> => {
  const raw = await AsyncStorage.getItem(REVIEWS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  return all[id] || [];
};

export const addReview = async (id: string, review: Review) => {
  const raw = await AsyncStorage.getItem(REVIEWS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  const existing = all[id] || [];
  const updated = [...existing, review];
  all[id] = updated;
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
};

export const getAverageRating = async (id: string): Promise<number> => {
  const reviews = await getReviews(id);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
};
