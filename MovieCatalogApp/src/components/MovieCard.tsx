import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { isFavorite } from '../storage/favorites';
import { getAverageRating } from '../storage/reviews';

export default function MovieCard({ movie }: any) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      const fav = await isFavorite(movie.imdbID);
      setIsFav(fav);
      const avg = await getAverageRating(movie.imdbID);
      setAvgRating(avg);
    };
    load();
  }, []);

  return (
    <Pressable
      onPress={() => router.push(`/${movie.imdbID}`)}
      style={styles.card}
    >
      <View style={{ position: 'relative' }}>
      {movie.Poster && movie.Poster !== 'N/A' && !movie.Poster.includes('404') ? (
  <Image
    source={{ uri: movie.Poster }}
    style={styles.poster}
    resizeMode="cover"
    onError={() => {
      // Isso evita que o app quebre se a imagem der erro
      console.log('Imagem não encontrada:', movie.Poster);
    }}
  />
) : (
  <View style={styles.noPoster}>
    <Text style={styles.noPosterText}>Filme sem cartaz disponível</Text>
  </View>
)}

        {isFav && (
          <View style={styles.favoriteIcon}>
            <AntDesign name="heart" size={24} color="#ff5c5c" />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <AntDesign
              key={s}
              name={avgRating >= s ? 'star' : 'staro'}
              size={16}
              color="#ffd700"
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },
  poster: {
    width: '100%',
    height: 400,
    backgroundColor: '#333',
  },
  noPoster: {
    width: '100%',
    height: 400,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#fff', // ou '#eee' ou laranja
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#222',
    padding: 6,
    borderRadius: 50,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  year: {
    color: '#ccc',
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
