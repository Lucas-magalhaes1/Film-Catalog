import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@filmes_favoritos';

export const getFavorites = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const isFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(id);
};

export const addFavorite = async (id: string) => {
  const favorites = await getFavorites();
  if (!favorites.includes(id)) {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, id]));
  }
};

export const removeFavorite = async (id: string) => {
  const favorites = await getFavorites();
  const updated = favorites.filter((favId) => favId !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};
