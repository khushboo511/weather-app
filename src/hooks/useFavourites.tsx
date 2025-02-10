import useLocalStorage from "./useLocalStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FavouriteCity {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorites() {
  const [favourites, setFavourites] = useLocalStorage<FavouriteCity[]>(
    "favourites",
    []
  );

  const queryClient = useQueryClient();

  // Query to get the favourites
  const favouriteQuery = useQuery({
    queryKey: ["favourites"],
    queryFn: () => favourites,
    initialData: favourites,
    staleTime: Infinity,
  });

  // Add city to favourites
  const addToFavourites = useMutation({
    mutationFn: async (city: Omit<FavouriteCity, "id" | "addedAt">) => {
      const newFavourite: FavouriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      // Check if city already exists
      const exists = favourites.some(
        (fav) => fav.lat === newFavourite.lat && fav.lon === newFavourite.lon
      );
      if (exists) return favourites;

      const newFavourites = [...favourites, newFavourite].slice(0, 10);
      setFavourites(newFavourites);
      return newFavourites;
    },

    onSuccess: (newFavourites) => {
      queryClient.setQueryData(["favourites"], newFavourites);
    },
  });

  // Remove city from favourites
  const removeFavourites = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavourites = favourites.filter((city) => city.id !== cityId);
      setFavourites(newFavourites);
      return newFavourites;
    },

    onSuccess: (newFavourites) => {
      queryClient.setQueryData(["favourites"], newFavourites);
    },
  });

  return {
    favourites: favouriteQuery.data ?? [],
    addToFavourites,
    removeFavourites,
    isFavourite: (lat: number, lon: number) =>
      favourites.some((fav) => fav.lat === lat && fav.lon === lon),
  };
}
