import { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet } from 'react-native';
import { searchMovies } from '../services/omdb';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<{ imdbID: string; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (term: string) => {
    try {
      setLoading(true);
      const data = await searchMovies(term);
      console.log('Filmes retornados:', data); // debug
      setMovies(data || []);
    } catch (err) {
      console.error('Erro ao buscar filmes', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar lista inicial com filmes de ação
  useEffect(() => {
    fetchMovies('action');
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar filmes..."
        placeholderTextColor="#999"
        style={styles.input}
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        onSubmitEditing={() => fetchMovies(searchTerm)}
      />

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
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
  loading: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});
