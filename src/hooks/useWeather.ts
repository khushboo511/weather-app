import { Coordinates } from "@/api/types"
import { weatherAPI } from "@/api/weather"
import { useQuery } from "@tanstack/react-query"

export const WEATHER_KEYS = {
  weather: (coords: Coordinates) => ["weather", coords] as const,
  forecast: (coords: Coordinates) => ["forecast", coords] as const,
  location: (coords: Coordinates) => ["location", coords] as const,
  search: (query: string) => ["location-search", query] as const
} as const;

export const useWeatherQuery = (coordinates: Coordinates | null) => {
    return useQuery({
      queryKey: WEATHER_KEYS.weather(coordinates ?? {lat: 0, lon: 0}),
      queryFn: ()=>
         coordinates ?  weatherAPI.getCurrentWeather(coordinates) : null,
      enabled: !!coordinates,
    })
}

// const getDetails = (coordinates: Coordinates | null) => {
//   return coordinates ? weatherAPI.getCurrentWeather(coordinates) : null
// };

// export const useWeatherDetailsQuery = (coordinates: Coordinates | null) => {
//   const weatherDetails = useQuery({
//     queryKey: ['details'],
//     queryFn: () => getDetails(coordinates)
//   })
//   return weatherDetails
// }

export const useForecastQuery = (coordinates: Coordinates | null) => {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? {lat: 0, lon: 0}),
    queryFn: ()=>
       coordinates ?  weatherAPI.getForecast(coordinates) : null,
    enabled: !!coordinates,
  })
}

export const useReverseGeocodeQuery = (coordinates: Coordinates | null) => {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? {lat: 0, lon: 0}),
    queryFn: ()=>
       coordinates ?  weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  })
}

export const useSearchLocationQuery = (query: string) => {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => query ? weatherAPI.searchLocation(query) : null,
    enabled: query.length >= 3 ,
  })
}
