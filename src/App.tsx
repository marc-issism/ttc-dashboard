import usePredictionsByStopIds from './hooks/usePredictionsByStopIds';
import { useStopsNearUser } from './hooks/useStopsNearUser';
import './css/main.css';
import Predictions from './components/Predictions';

function App() {

  const stops = useStopsNearUser(500, 10);
  const preds = usePredictionsByStopIds(stops);

  return (

    <>
    {/* <div className='prediction__container'>
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '501C', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '605C', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '905C', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '301A', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '3', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '6', routeName: 'Warden', arrivals: [new Date(1774191882)]}], distanceFromUser: 423}} />
    <Prediction stopPrediction={{stopName:'Warden Ave at Lawrence Ave', stopCode: '9595', stopId: '234', arrivalPredictions: [{routeId: '69C', routeName: 'Warden', arrivals: [new Date(1774191882), new Date(1774191882), new Date(1774191882)]}], distanceFromUser: 423}} />
    </div> */}
    <div className='prediction__container'>
      {preds && <Predictions preds={preds}/>}
    </div>
    
    </>
  )
}

export default App
