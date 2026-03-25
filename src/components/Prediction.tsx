import type { ArrivalPrediction, StopPrediction } from '../types/StopPrediction';
import { useEffect, useState } from 'react';
import { isBlueNightRoute, isExpressRoute, isLRTRoute, isShuttleRoute, isStreetcarRoute, isSubwayRoute } from '../utils/is-route';
import { ROUTE_COLOR_MAP } from '../utils/constants';
import PredictionStatus from './PredictionStatus';


type PredictionItemProps = {
  arrivalPrediction: ArrivalPrediction;
};

type PredictionProps = {
  stopPrediction: StopPrediction;
};

const PredictionItem: React.FC<PredictionItemProps> = ({arrivalPrediction}) => {

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date(Date.now()));
  const arrivalTime = arrivalPrediction?.arrivalTime ?? new Date();
  const diff = Math.abs(currentTime.valueOf() - arrivalTime.valueOf());
  const [timeDifferenceMinutes, setTimeDifferenceMinutes] = useState<number>(Math.floor(diff / (1000*60)));


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date(Date.now())); 
      const diff = Math.abs(currentTime.valueOf() - arrivalTime.valueOf());
      // setTimeDifferenceMinutes(Math.floor(((diff % 86400000) % 3600000) / 60000));
      setTimeDifferenceMinutes(Math.floor(diff / (1000*60)))
    }, 30000);
    return () => clearInterval(interval);
  })

  if (!arrivalPrediction) return null;
  const routeId = arrivalPrediction.routeId;
  const routeColor = () => {
    if (isExpressRoute(routeId)) {
      return ROUTE_COLOR_MAP['express'];
    }
    else if (isBlueNightRoute(routeId)) {
      return ROUTE_COLOR_MAP['blueNight'];
    }
    else if (isShuttleRoute(routeId)) {
      return ROUTE_COLOR_MAP['shuttle'];
    } 
    return ROUTE_COLOR_MAP['local'];
  }

  const routeIcon = () => {
    if (isStreetcarRoute(routeId)) {
      return '/images/prediction/streetcar.svg'
    }
    else if (isSubwayRoute(routeId)) {
      return '/images/prediction/subway.svg'
    }
    else if (isLRTRoute(routeId)) {
      return '/images/prediction/lrt.svg'
    }
    return '/images/prediction/bus.svg';
  }

  const timePredictionText = () => {
    const arrivalTimeMinutes = () => {
      if (arrivalTime.getMinutes() < 10) {
        return `0${arrivalTime.getMinutes()}`
      }
      return arrivalTime.getMinutes();
    }

    const arrivalTimeHours = () => {
      if (arrivalTime.getHours() < 10) {
        return `0${arrivalTime.getHours()}`
      }
      return arrivalTime.getHours();
    }

    if (timeDifferenceMinutes < 1) {
      return 'Arriving now';
      } 
    else if (timeDifferenceMinutes == 1) {
        return `in ${timeDifferenceMinutes} minute @ ${arrivalTimeHours()}:${arrivalTimeMinutes()}`;
      }
      return `in ${timeDifferenceMinutes} minutes @ ${arrivalTimeHours()}:${arrivalTimeMinutes()}`;
    }



  return(
    <div className='arrival-prediction container'>
      <div className='icon'>
        <img className='icon-32' src={routeIcon()} />
      </div>
      <div className='route'>
        <div className='route__background' style={{backgroundColor: routeColor()}}>
          {arrivalPrediction.routeId}
        </div>
      </div>
      <div className='time'> {timePredictionText()} </div>
      <PredictionStatus affectedByLayover={arrivalPrediction.affectedByLayover} />
    </div>
  )
}

const Prediction: React.FC<PredictionProps> = ({stopPrediction}) => {

  if (!stopPrediction) return null;
  if (!stopPrediction.arrivalPredictions || !(stopPrediction.arrivalPredictions[0])) return null;
  const stopName = stopPrediction.arrivalPredictions[0].routeName;
  
  const stopDirection = () => {
    if (stopName.includes('South')) {
      return 'S';
    }
    else if (stopName.includes('North')) {
      return 'N';
    }
    else if (stopName.includes('West')) {
      return 'W';
    }
    else if (stopName.includes('East')) {
      return 'E';
    }
    return 'n.d.';
  }
  // console.log('sorting',  stopPrediction.arrivalPredictions);
  stopPrediction.arrivalPredictions.sort((a, b) => {

    if (!a) return -1;
    if (!b) return 1;
    // console.log(a.arrivalTime.valueOf(), b.arrivalTime.valueOf())
    if (a.arrivalTime.valueOf() > b.arrivalTime.valueOf()) return 1;
    else if (a.arrivalTime.valueOf() < b.arrivalTime.valueOf()) return -1;

    return 0;
  })
  // console.log('sorting',  stopPrediction.arrivalPredictions);

  // console.log('prediction: ', stopPrediction);
  if (!stopPrediction) return null;
  return(
    <div className='prediction container'>
      {/* header */}
      <div className='prediction__header container'>
        <div className='direction'> {stopDirection()} </div>
        <div className='title'>{stopPrediction.stopName}</div>
        <div className='distance'>{stopPrediction.distanceFromUser + 'm'}</div>
      </div>

      {/* content */}
      <div className='prediction__content container-col'>
      {stopPrediction.arrivalPredictions?.map((arrivalPrediction, index) => {
        return(
          <>
          <PredictionItem arrivalPrediction={arrivalPrediction} key={`prediction-item-${index}`} />
          </>
        )
      })}

      </div>

    </div>
  );
}

export default Prediction;