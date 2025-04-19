import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { getFavorites } from '../storage/favorites';
import { getMovieDetails } from '../services/omdb';
import MovieCard from '../components/MovieCard';
import { useFocusEffect } from 'expo-router';

export default function FavoritesScreen() {
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const ids = await getFavorites();
      const movies = await Promise.all(ids.map((id) => getMovieDetails(id)));
      const validMovies = movies.filter((movie) => movie?.Response === 'True');
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
      <Text style={styles.header}>💖 Seus Filmes Favoritos</Text>
      <Text style={styles.subheader}>Todos os filmes que você marcou com ❤️</Text>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Carregando favoritos...</Text>
        </View>
      ) : favoriteMovies.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Você ainda não favoritou nenhum filme.</Text>
          <Text style={styles.emptyTip}>Explore e toque no ❤️ para salvar seus favoritos!</Text>
        </View>
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
    backgroundColor: '#0e0e0e',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 16,
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
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyTip: {
    color: '#FFA500',
    fontSize: 14,
    textAlign: 'center',
  },
});
