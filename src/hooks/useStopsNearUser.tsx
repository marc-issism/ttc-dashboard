import getDistance from 'geolib/es/getPreciseDistance';

import { useState, useEffect } from 'react';

import stops from '../data/stops.json';
import type { GeolibInputCoordinates, GeolibLatitudeInputValue, GeolibLongitudeInputValue } from 'geolib/es/types';
import type { Stop } from '../types/Stop';

// 43.786605, -79.188300 UTSC
// 43.687859, -79.301720 Main Street Station
// 43.749560, -79.274981 Kennedy and Lawrence
// 43.712026, -79.280994 Warden Station

const compareStopDistance = (stopA: Stop, stopB: Stop) => {
  if (stopA.distanceFromUser > stopB.distanceFromUser) {
    return 1;
  }
  else if(stopA.distanceFromUser < stopB.distanceFromUser) {
    return -1;
  }
  else {
    return 0;
  }
}

export const useStopsNearUser = (radiusMeters: number, stopsAmount: number) => {
  const [stopsNearUser, setStopsNearUser] = useState<Stop[]>([]);

  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          stops.forEach((stop) => {     

            const stopCoordinates: GeolibInputCoordinates = {
              latitude: stop.stop_lat as GeolibLatitudeInputValue, 
              longitude: stop.stop_lon as GeolibLongitudeInputValue
            };

            const distanceFromUser = getDistance({
              latitude: position.coords.latitude as GeolibLatitudeInputValue,
              longitude: position.coords.longitude as GeolibLongitudeInputValue
              // latitude: 43.712026 as GeolibLatitudeInputValue,
              // longitude: -79.280994 as GeolibLongitudeInputValue
            }, stopCoordinates, 1);
            
            if (distanceFromUser <= radiusMeters) {
              setStopsNearUser(stopsNearUser => [...stopsNearUser, {
                id: stop.stop_id.toString(), 
                code: stop.stop_code.toString(),
                name: stop.stop_name, 
                distanceFromUser: distanceFromUser
              }]);
            }
          })

          setStopsNearUser(stopsNearUser => stopsNearUser.sort(compareStopDistance));
          setStopsNearUser(stopsNearUser => stopsNearUser.slice(0, stopsAmount));

        },
        (error) => {
          console.error('', error);
        }
      )
    } else {
      console.log('Geolocation is not supported or has been blocked');
    }
    
  }, [radiusMeters, stopsAmount])

  return stopsNearUser;
}
