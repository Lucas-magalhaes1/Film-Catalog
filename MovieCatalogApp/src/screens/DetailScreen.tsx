import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getMovieDetails } from '../services/omdb';
import { addFavorite, removeFavorite, isFavorite } from '../storage/favorites';
import { addReview, getReviews, Review } from '../storage/reviews';

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFav, setIsFav] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setError('');
        const data = await getMovieDetails(imdbID as string);
        if (data && data.Response === 'True') {
          setMovie(data);
          const fav = await isFavorite(data.imdbID);
          setIsFav(fav);
          const storedReviews = await getReviews(data.imdbID);
          setReviews(storedReviews);
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

  const handleSubmit = async () => {
    if (!name || !message || rating === 0) return;
    const review: Review = {
      name,
      message,
      rating,
      date: new Date().toISOString(),
    };
    await addReview(imdbID as string, review);
    const updated = await getReviews(imdbID as string);
    setReviews(updated);
    setName('');
    setMessage('');
    setRating(0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
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
      <View style={{ position: 'relative' }}>
        {movie.Poster !== 'N/A' ? (
          <Image source={{ uri: movie.Poster }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>Filme sem cartaz disponível</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={async () => {
            if (movie) {
              if (isFav) {
                await removeFavorite(movie.imdbID);
                setIsFav(false);
              } else {
                await addFavorite(movie.imdbID);
                setIsFav(true);
              }
            }
          }}
          style={styles.favoriteButton}
        >
          <AntDesign name={isFav ? 'heart' : 'hearto'} size={28} color="#FFA500" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.label}>🎬 Gênero:</Text>
      <Text style={styles.text}>{movie.Genre}</Text>
      <Text style={styles.label}>🎬 Diretor:</Text>
      <Text style={styles.text}>{movie.Director}</Text>
      <Text style={styles.label}>🎬 Atores:</Text>
      <Text style={styles.text}>{movie.Actors}</Text>
      <Text style={styles.label}>📝 Sinopse:</Text>
      <Text style={styles.text}>{movie.Plot}</Text>

      <Text style={styles.label}>⭐ Avaliação:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <AntDesign
              name={rating >= star ? 'star' : 'staro'}
              size={28}
              color="#FFD700"
              style={{ marginRight: 5 }}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Seu nome"
        value={name}
        onChangeText={setName}
        style={[styles.input, { marginBottom: 10 }]}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Sua opinião sobre o filme"
        value={message}
        onChangeText={setMessage}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholderTextColor="#999"
      />
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enviar avaliação</Text>
      </Pressable>

      {reviews.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>💬 Comentários:</Text>
          {reviews.map((rev, index) => (
            <View key={index} style={styles.reviewBox}>
              <Text style={styles.reviewName}>{rev.name}</Text>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <AntDesign
                    key={s}
                    name={rev.rating >= s ? 'star' : 'staro'}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewMessage}>{rev.message}</Text>
            </View>
          ))}
        </View>
      )}
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
    color: '#aaa',
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#FFA500',
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 50,
    elevation: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewBox: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewName: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewMessage: {
    color: '#ccc',
    marginTop: 4,
  },
});
