import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { getMovieDetails } from '../services/omdb';

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setError('');
        const data = await getMovieDetails(imdbID as string);
        if (data && data.Response === 'True') {
          setMovie(data);
        } else {
          setError('Detalhes do filme não encontrados.');
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes:', err);
        setError('Erro ao carregar detalhes do filme. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [imdbID]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#ff6b6b', textAlign: 'center', padding: 20 }}>
          {error || 'Erro inesperado ao carregar o filme.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.Poster !== 'N/A' ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>Filme sem cartaz disponível</Text>
        </View>
      )}
      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.label}>Gênero:</Text>
      <Text style={styles.text}>{movie.Genre}</Text>
      <Text style={styles.label}>Diretor:</Text>
      <Text style={styles.text}>{movie.Director}</Text>
      <Text style={styles.label}>Atores:</Text>
      <Text style={styles.text}>{movie.Actors}</Text>
      <Text style={styles.label}>Sinopse:</Text>
      <Text style={styles.text}>{movie.Plot}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
    flex: 1,
  },
  poster: {
    width: '100%',
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  noPoster: {
    width: '100%',
    height: 450,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noPosterText: {
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 10,
  },
  text: {
    color: '#eee',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
