import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getFavorites } from '../storage/favorites';
import { getMovieDetails } from '../services/omdb';
import MovieCard from '../components/MovieCard';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';


export default function FavoritesScreen() {
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const ids = await getFavorites();
      const movies = await Promise.all(ids.map(id => getMovieDetails(id)));
      const validMovies = movies.filter(movie => movie?.Response === 'True');
      setFavoriteMovies(validMovies);
    } catch (error) {
      console.error('Erro ao buscar filmes favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando favoritos...</Text>
        </View>
      ) : favoriteMovies.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum filme favoritado ainda.</Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => <MovieCard movie={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
    flex: 1,
  },
  loading: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
