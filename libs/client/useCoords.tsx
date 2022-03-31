import { useEffect, useState } from "react";

interface useCoordState {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<useCoordState>({
    latitude: 0,
    longitude: 0,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);
  return coords;
}
