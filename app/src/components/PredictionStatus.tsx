import { PASTEL_COLORS_MAP } from '../utils/constants';

type PredictionStatusProps = {
  affectedByLayover: boolean;
}

const PredictionStatus: React.FC<PredictionStatusProps> = ({affectedByLayover}) => {

  const text = affectedByLayover ? 'SCHEDULED' : 'LIVE';
  const backgroundColor = affectedByLayover ? PASTEL_COLORS_MAP['blue'] : PASTEL_COLORS_MAP['red'];

  return(
   <div className='status'>
        <div className='status__background' style={{backgroundColor: backgroundColor}}>
          {text}
        </div>
      </div>
  );
}

export default PredictionStatus;