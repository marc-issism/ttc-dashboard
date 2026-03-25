
import type { StopPrediction } from '../types/StopPrediction';
import Prediction from './Prediction';

type PredictionsProps = {
  preds: StopPrediction[];
}

const Predictions: React.FC<PredictionsProps> = ({preds}) => {

  console.log('predictions', preds);

  return(
    <>
    
    {preds.map((pred) => {
      return(
        <Prediction stopPrediction={pred} />
      )
    })}
    
    </>
  );

}

export default Predictions;