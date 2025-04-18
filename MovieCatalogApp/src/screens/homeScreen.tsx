import { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { searchMovies } from '../services/omdb';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<{ imdbID: string; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);

  const fetchMovies = async (term: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchMovies(term);
      if (data.length === 0) {
        setError('Nenhum filme encontrado.');
      }
      setMovies(data || []);
    } catch (err) {
      console.error('Erro ao buscar filmes', err);
      setError('Erro ao buscar filmes. Tente novamente.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies('action');
  }, []);

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchMovies('action');
      } else {
        fetchMovies(searchTerm);
      }
    }, 500);

    setDebounceTimeout(timeout);
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar filmes..."
        placeholderTextColor="#999"
        style={styles.input}
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
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
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
