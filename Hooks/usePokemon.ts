import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  fetchPokemon,
  getPokemonDetails,
  getMultiplePokemons,
  generatePokemonProfile,
} from '@services/Pokemon';

export const usePokemon = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: ({pageParam = 0}) => fetchPokemon(pageParam),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage?.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const usePokemonDetails = (idOrName: string | number) => {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => getPokemonDetails(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useMultiplePokemons = (identifiers: (string | number)[]) => {
  return useQuery({
    queryKey: ['multiple-pokemon', identifiers],
    queryFn: () => getMultiplePokemons(identifiers),
    enabled: identifiers.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const usePokemonProfile = (identifier: string | number) => {
  return useQuery({
    queryKey: ['pokemon-profile', identifier],
    queryFn: () => generatePokemonProfile(identifier),
    enabled: !!identifier,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
