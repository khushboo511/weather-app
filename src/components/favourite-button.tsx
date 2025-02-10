// src/components/weather/favorite-button.tsx
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "@/api/types";
import { useFavorites } from "@/hooks/useFavourites";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData;
}

export function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addToFavourites,
    removeFavourites, isFavourite } = useFavorites();
  const isCurrentlyFavorite = Boolean(isFavourite(data.coord.lat, data.coord.lon));

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavourites.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from Favorites`);
    } else {
      addToFavourites.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to Favorites`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
}