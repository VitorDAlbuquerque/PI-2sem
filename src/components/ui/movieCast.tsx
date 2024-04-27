import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel";

interface CastMember {
  name: string;
  profileImg: string | null;
  character: string; 
}

interface MovieCastProps {
  movieId: string;
}

const MovieCast: React.FC<MovieCastProps> = ({ movieId }) => {
  const [cast, setCast] = useState([] as CastMember[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovieCast = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=pt-BR&api_key=794202efde8ce7a78d65e6f431811b5e`
        );
        if (response.data && response.data.cast) {
          const castData: CastMember[] = response.data.cast.map((member: any) => ({
            name: member.name,
            profileImg: member.profile_path ? `https://image.tmdb.org/t/p/w500/${member.profile_path}` : <p>Imagem indispo</p>,
            character: member.character, 
          }));
          setCast(castData);
        } else {
          setCast([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar o elenco do filme.");
        setLoading(false);
      }
    };

    getMovieCast();
  }, [movieId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className='flex justify-center'>
    <div className='max-w-7xl'>
      <Carousel className=''>
        <CarouselPrevious />
        <CarouselContent className=''>
          {cast.map((member, index) => (
            <CarouselItem key={index} className='basis-1/5'>
              <div className='flex flex-col justify-center text-center '>
                {member.profileImg && <img src={member.profileImg} alt={'Imagem de ' + member.name} className='max-w-56 h-auto mx-auto' />}
                <p className='text-constrastColor text-xl'>{member.name}</p>
                <p className='text-neutral-400'>{member.character}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  </div>
  
  );
};

export default MovieCast;
