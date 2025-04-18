import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { getMovieDetails } from '../services/omdb';

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getMovieDetails(imdbID as string);
      setMovie(data);
    };
    fetch();
  }, [imdbID]);

  if (!movie) return <Text>Carregando...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Image
        source={{ uri: movie.Poster }}
        style={{ width: '100%', height: 400 }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{movie.Title}</Text>
      <Text>Gênero: {movie.Genre}</Text>
      <Text>Diretor: {movie.Director}</Text>
      <Text>Atores: {movie.Actors}</Text>
      <Text style={{ marginTop: 10 }}>{movie.Plot}</Text>
    </ScrollView>
  );
}
