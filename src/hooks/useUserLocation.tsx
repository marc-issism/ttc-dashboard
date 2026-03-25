import { useEffect, useState } from 'react'
import type { GeolibInputCoordinates, GeolibLatitudeInputValue, GeolibLongitudeInputValue } from 'geolib/es/types'

import stops from '../data/stops.json'

import getDistance from 'geolib/es/getPreciseDistance'

export const useUserLocation = () => {
  
  const [userLocation, setUserLocation] = useState<GeolibInputCoordinates>({latitude: 0 , longitude: 0})
  
  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude as GeolibLatitudeInputValue,
            longitude: position.coords.longitude as GeolibLongitudeInputValue
          })
          stops.forEach((stop) => {
          // setStopsWithinRadius(stopsWithinRadius => [...stopsWithinRadius, stop.stop_code.toString()])
            
          const stopCoordinates: GeolibInputCoordinates = {latitude: stop.stop_lat as GeolibLatitudeInputValue, longitude: stop.stop_lon as GeolibLongitudeInputValue};
          console.log(getDistance({
            latitude: position.coords.latitude as GeolibLatitudeInputValue,
            longitude: position.coords.longitude as GeolibLongitudeInputValue
          }, stopCoordinates, 1))
          })

        },
        (error) => {
          console.error('', error);
        }
      )
    }
    else {
      console.log('Geolocation is not supported or has been blocked');
    }

  }, [])


  return userLocation;

}