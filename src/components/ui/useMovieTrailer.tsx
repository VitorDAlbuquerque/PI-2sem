import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 

interface Video {
  key: string;
  type: string;
}

function useMovieTrailer(movieId: string) {
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieTrailer = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ results: Video[] }>(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          params: {
            api_key: "794202efde8ce7a78d65e6f431811b5e", 
          },
        });
        const videos = response.data.results;
      
        const trailer = videos.find((video) => video.type === "Trailer");
        if (trailer) {
          setTrailerId(trailer.key);
        } else {
 
          toast.error("Nenhum trailer encontrado para este filme.");
        }
      } catch (error) {

        toast.error("Erro ao buscar o trailer do filme.");
        console.error("Erro ao buscar o trailer do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieTrailer();
  }, [movieId]);

  return { trailerId, loading };
}

export default useMovieTrailer;
