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
import { searchMovies } from '../services/omdb';
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
  const years = Array.from({ length: 20 }, (_, i) => `${2025 - i}`);

  const fetchMovies = async (term: string, year?: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchMovies(term, year);
      if (!data || data.length === 0) {
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

  useFocusEffect(
    useCallback(() => {
      fetchMovies(searchTerm || 'movie', selectedYear);
    }, [selectedYear])
  );

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchMovies('movie', selectedYear);
      } else {
        fetchMovies(searchTerm, selectedYear);
      }
    }, 500);
    setDebounceTimeout(timeout);
  }, [searchTerm, selectedYear]);

  return (
    <View style={styles.container}>
      {/* Header de filtro */}
      <View style={styles.yearHeader}>
        <Text style={styles.yearTitle}>🎬 Selecionar ano</Text>
        <Text style={styles.yearSubtitle}>Veja os top filmes lançados em:</Text>

        <Pressable style={styles.yearButton} onPress={() => setShowYears(!showYears)}>
          <Text style={styles.yearButtonText}>{selectedYear || 'Todos os anos'}</Text>
        </Pressable>
      </View>

      {/* Lista de anos */}
      {showYears && (
        <FlatList
          style={styles.yearList}
          data={years}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedYear(item);
                setShowYears(false);
              }}
              style={styles.yearItem}
            >
              <Text style={styles.yearItemText}>{item}</Text>
            </Pressable>
          )}
          ListFooterComponent={() => (
            <Pressable
              onPress={() => {
                setSelectedYear(undefined);
                setShowYears(false);
              }}
              style={styles.yearItem}
            >
              <Text style={[styles.yearItemText, { fontStyle: 'italic' }]}>Todos os anos</Text>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Campo de busca */}
      <TextInput
        placeholder="Buscar filmes..."
        placeholderTextColor="#999"
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Resultado */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
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
  yearHeader: {
    marginBottom: 12,
    alignItems: 'center',
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  yearSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  yearButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  yearButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  yearList: {
    maxHeight: 200,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  yearItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  yearItemText: {
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
    backgroundColor: '#2c0000',
    borderRadius: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
});