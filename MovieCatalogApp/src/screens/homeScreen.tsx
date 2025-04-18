import { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet } from 'react-native';
import { searchMovies } from '../services/omdb';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('marvel');
  const [movies, setMovies] = useState<{ imdbID: string; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (term: string) => {
    try {
      setLoading(true);
      const data = await searchMovies(term);
      setMovies(data || []);
    } catch (err) {
      console.error('Erro ao buscar filmes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar filmes..."
        style={styles.input}
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        onSubmitEditing={() => fetchMovies(searchTerm)}
      />

      {loading ? (
        <Text style={{ marginTop: 20 }}>Carregando...</Text>
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
});
