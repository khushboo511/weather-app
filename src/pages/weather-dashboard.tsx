import CurrentWeather from "@/components/current-weather";
import { HourlyTemperature } from "@/components/hourly-temperature";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import WeatherSkeleton from "@/components/weather-skeleton";
import useGeolocation from "@/hooks/useGeolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/useWeather";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react"
import { FavoriteCities } from "@/components/favourite-cities";

const Dashboard = () => {

  const { coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading

  } = useGeolocation();

  console.log(coordinates);

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      locationQuery.refetch();
      forecastQuery.refetch();
    }
  }

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (!coordinates) {
    return (
    <Alert variant="destructive">
      <AlertTriangle  className="h-4 w-4" />
      <AlertTitle>Location Erorr</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please enable location access to see your local weather.</p>
        <Button onClick={getLocation} variant={"outline"} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
    )
  }

  if (locationError) {
    return (
    <Alert variant="destructive">
      <AlertTriangle  className="h-4 w-4" />
      <AlertTitle>Location Erorr</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{locationError}</p>
        <Button onClick={getLocation} variant={"outline"} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
    )
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
      <AlertTriangle  className="h-4 w-4" />
      <AlertTitle>Erorr</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again.</p>
        <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          retry
        </Button>
      </AlertDescription>
    </Alert>
    )
  }

    if (!weatherQuery.data || !forecastQuery.data) {
      return <WeatherSkeleton />;
    }

    return (
      <div className="space-y-4">
        {/* Favourite Cities */}
        <FavoriteCities />

        <div className="flex items-center justify-between">
          <Button variant={"outline"}
            size={"icon"}
            onClick={handleRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          >
            <RefreshCcw className={`h4 w-4
              ${weatherQuery.isFetching ? "animate-spin" : ""}`
            } />
          </Button>
        </div>

            <div className="grid gap-6 p-2 m-2">
              <div>
                <CurrentWeather 
                  data={weatherQuery.data} 
                  locationName={locationName} />
                {/* Current Weather
                Hourly Temperature */}

                <HourlyTemperature
                  data={forecastQuery.data}
                />
              </div>

              <div className="grid grid-6 md:grid-cols-2 items-start">
                {/* Details
                Forecast */}
                <WeatherDetails data={weatherQuery.data} />
                <WeatherForecast data={forecastQuery.data} />
              </div>
            </div>

      </div>
    )
}

export default Dashboard