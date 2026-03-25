// import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import { useEffect, useState } from 'react'
import type { Stop } from '../types/Stop'
import type { StopPrediction, ArrivalPrediction } from '../types/StopPrediction'
import type { Direction, NextBusData, Prediction } from '../types/NextBusData';

/*
https://gtfs.org/documentation/realtime/reference/
https://gtfsrt.ttc.ca/
https://open.toronto.ca/dataset/merged-gtfs-ttc-routes-and-schedules/
https://bustime.ttc.ca/gtfsrt/trips?debug
https://retro.umoiq.com/service/publicJSONFeed?command=predictions&stopId=8586&a=ttc
https://retro.umoiq.com/xmlFeedDocs/NextBusXMLFeed.pdf
*/

const URL = 'https://retro.umoiq.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=';

const getArrivalPredictionFromDirection: (direction: Direction) => ArrivalPrediction[] | undefined = (direction: Direction) => {
  const ArrivalPredictions: ArrivalPrediction[] = [];
  try {
    direction.prediction.forEach((prediction: Prediction) => {
      const arrivalTime = new Date(prediction.epochTime as unknown as number /1000 * 1000) // only way to make this a valid date /1000 *1000
      ArrivalPredictions.push({
        routeId: prediction.branch, 
        routeName: direction.title, 
        arrivalTime: arrivalTime,
        affectedByLayover: prediction.affectedByLayover as unknown as boolean
      });
    });
    return ArrivalPredictions.slice(0,2);

  } catch {
    return undefined;
  }
}

const getStopPredictionsFromRoute: (nextBusData: NextBusData) => ArrivalPrediction[] = (nextBusData: NextBusData) => {

  let direction = nextBusData.direction;
  let arrivalPredictions: ArrivalPrediction[] = [];

  if (!direction) return [];

  // No branches
  if (direction !== undefined && !(length in direction)) {
    // console.log('no branch: ', nextBusData);
    direction = direction as Direction;
    const intermediateArrivalPredictions = getArrivalPredictionFromDirection(direction) ?? [];
    arrivalPredictions = [...arrivalPredictions, ...intermediateArrivalPredictions];
  }
  // branches
  else {
    // console.log('nbd branch', nextBusData);
      direction = direction as Direction[];
      direction.forEach((currentDirection: Direction) => {
        const intermediateArrivalPredictions = getArrivalPredictionFromDirection(currentDirection) ?? [];
        arrivalPredictions = [...arrivalPredictions, ...intermediateArrivalPredictions];
      })
  }

  return arrivalPredictions;
}


const usePredictionsByStopIds = (stops: Stop[]) => {
  
  const [multiStopPredictions, setMultiStopPredictions] = useState<StopPrediction[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const promises: Promise<StopPrediction>[] = stops.map(async (stop) => {

        try {
          const response = await fetch(URL + stop.code);
          const data = await response.json();
  
          let arrivalPredictions: ArrivalPrediction[] = [];
          let nextBusData: NextBusData | NextBusData[] = data.predictions;
          let stopTitle: string = "";
          
          /*
          1. One route -> no branches
             One route -> branches
          2. Many routes -> no branches
             Many routes -> branches
          */
  
          if (!nextBusData) {return undefined}
  
          // 1
          if (!(length in nextBusData)) {
            nextBusData = nextBusData as NextBusData;
            stopTitle = nextBusData.stopTitle;
            const intermediateArrivalPredictions = getStopPredictionsFromRoute(nextBusData);
            arrivalPredictions = [...arrivalPredictions, ...intermediateArrivalPredictions];
          }
          // 2
          else if (length in nextBusData) {
            nextBusData =  nextBusData as NextBusData[];
            stopTitle = nextBusData[0].stopTitle
  
            nextBusData.forEach((currentNBD) => {
              if (!currentNBD.dirTitleBecauseNoPredictions) {
                stopTitle = currentNBD.stopTitle;
                const intermediateArrivalPredictions = getStopPredictionsFromRoute(currentNBD);
                arrivalPredictions = [...arrivalPredictions, ...intermediateArrivalPredictions];
              }
            })
          }
          const stopPrediction = {stopName: stopTitle, stopId: stop.id, stopCode: stop.code, arrivalPredictions: arrivalPredictions, distanceFromUser: stop.distanceFromUser}
          return stopPrediction;
        } catch {
          return undefined;
        }
      })

      const results: StopPrediction[] = await Promise.all(promises);
      // console.log('results: ', results);
      setMultiStopPredictions(results);
    }
    fetchRoutes()

  }, [stops]) 
  // console.log('state', multiStopPredictions);
  return multiStopPredictions;
}


export default usePredictionsByStopIds;

