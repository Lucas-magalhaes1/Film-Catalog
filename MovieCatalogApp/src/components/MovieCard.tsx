import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function MovieCard({ movie }: any) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/${movie.imdbID}`)}
      style={styles.card}
    >
      {movie.Poster !== 'N/A' ? (
        <Image
          source={{ uri: movie.Poster }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>Filme sem cartaz disponível</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
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
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
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
});
