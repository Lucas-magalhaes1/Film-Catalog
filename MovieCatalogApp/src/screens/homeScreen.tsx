import { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { searchMovies, getMovieDetails } from '../services/omdb';
import MovieCard from '../components/MovieCard';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<{ imdbID: string; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [showYears, setShowYears] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [showGenres, setShowGenres] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const years = Array.from({ length: 20 }, (_, i) => `${2025 - i}`);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Adventure'];

  const fetchMovies = async (
    term: string,
    year?: string,
    genre?: string,
    newPage: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError('');
      const basicResults = await searchMovies(term, year, newPage);
      if (!basicResults || basicResults.length === 0) {
        if (!append) {
          setError('Nenhum filme encontrado.');
          setMovies([]);
        }
        setHasMore(false);
        return;
      }

      const detailedResults = await Promise.all(
        basicResults.map((movie: { imdbID: string }) => getMovieDetails(movie.imdbID))
      );

      const filtered = genre
        ? detailedResults.filter(
            (movie) =>
              movie?.Genre?.toLowerCase().includes(genre.toLowerCase()) &&
              movie?.Response === 'True'
          )
        : detailedResults.filter((movie) => movie?.Response === 'True');

      if (filtered.length === 0 && !append) {
        setError('Nenhum filme encontrado para esse gênero.');
      }

      setMovies((prev) => (append ? [...prev, ...filtered] : filtered));
      setHasMore(filtered.length >= 10);
    } catch (err) {
      console.error('Erro ao buscar filmes', err);
      setError('Erro ao buscar filmes. Tente novamente.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchMovies(searchTerm || 'movie', selectedYear, selectedGenre, 1);
    }, [selectedYear, selectedGenre])
  );

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      if (searchTerm.trim() === '') {
        fetchMovies('movie', selectedYear, selectedGenre, 1);
      } else {
        fetchMovies(searchTerm, selectedYear, selectedGenre, 1);
      }
    }, 500);
    setDebounceTimeout(timeout);
  }, [searchTerm, selectedYear, selectedGenre]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(searchTerm || 'movie', selectedYear, selectedGenre, nextPage, true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>🎥 Bem-vindo ao Catálogo de Filmes</Text>
      <Text style={styles.slogan}>Descubra, explore e favorite seus filmes favoritos!</Text>

      <View style={styles.filterHeader}>
        <Pressable style={styles.filterButton} onPress={() => setShowYears(!showYears)}>
          <Text style={styles.filterText}>{selectedYear || 'Ano'}</Text>
        </Pressable>
        <Pressable style={styles.filterButtonAlt} onPress={() => setShowGenres(!showGenres)}>
          <Text style={styles.filterText}>{selectedGenre || 'Gênero'}</Text>
        </Pressable>
      </View>

      {showYears && (
        <FlatList
          style={styles.filterList}
          data={years}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedYear(item);
                setShowYears(false);
              }}
              style={styles.filterItem}
            >
              <Text style={styles.filterItemText}>{item}</Text>
            </Pressable>
          )}
          ListFooterComponent={() => (
            <Pressable
              onPress={() => {
                setSelectedYear(undefined);
                setShowYears(false);
              }}
              style={styles.filterItem}
            >
              <Text style={[styles.filterItemText, { fontStyle: 'italic', color: '#FFA500' }]}>
                Todos os anos
              </Text>
            </Pressable>
          )}
        />
      )}

      {showGenres && (
        <FlatList
          style={styles.filterList}
          data={genres}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedGenre(item);
                setShowGenres(false);
              }}
              style={styles.filterItem}
            >
              <Text style={styles.filterItemText}>{item}</Text>
            </Pressable>
          )}
          ListFooterComponent={() => (
            <Pressable
              onPress={() => {
                setSelectedGenre(undefined);
                setShowGenres(false);
              }}
              style={styles.filterItem}
            >
              <Text style={[styles.filterItemText, { fontStyle: 'italic', color: '#FFA500' }]}>
                Todos os gêneros
              </Text>
            </Pressable>
          )}
        />
      )}

      <TextInput
        placeholder="🔍 Buscar filmes..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Carregando filmes...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => <MovieCard movie={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
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
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  filterButtonAlt: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  filterText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  filterList: {
    maxHeight: 180,
    backgroundColor: '#1e1e1e',
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  filterItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterItemText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorBox: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#330000',
    borderRadius: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});
