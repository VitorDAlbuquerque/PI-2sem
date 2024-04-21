import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";

interface Actor {
  id: number;
  name: string;
  profile_path: string;
}

interface MovieCredits {
  cast: Actor[];
  // Outras propriedades dos créditos do filme, se necessário
}

interface CastProps {
  movieId: number; // ID do filme para o qual você deseja obter os créditos
}

const Cast: React.FC<CastProps> = ({ movieId }) => {
  const [cast, setCast] = useState<Actor[]>([]); // Usando o tipo Actor[] para o estado cast

  useEffect(() => {
    const fetchMovieCredits = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_API_KEY&language=en-US&append_to_response=credits`);
        const data = await response.json();
        // Aqui você pode acessar os créditos do filme na resposta da API e definir o estado do cast
        setCast(data.credits.cast);
      } catch (error) {
        console.error("Erro ao buscar créditos do filme:", error);
      }
    };

    fetchMovieCredits();
  }, [movieId]);

  return (
    <div className="m-10 p-8">
      <Carousel>
        <CarouselContent className="space-x-4">
          {cast.map((actor) => (
            <CarouselItem key={actor.id}>
              <div className="flex flex-col items-center m-4">
                <img
                  src={`https://image.tmdb.org/t/p/w300/${actor.profile_path}`}
                  alt={actor.name}
                  className="max-h-56"
                />
                <p className="text-mainFontColor mt-2">{actor.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Cast;
