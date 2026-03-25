
export type ArrivalPrediction = undefined | {
  routeId: string;
  routeName: string;
  arrivalTime: Date;
  affectedByLayover: boolean;
  // direction: 'N' | 'S' | 'E' | 'W'
}

export type StopPrediction = undefined | {
  stopName: string;
  stopCode: string;
  stopId: string;
  distanceFromUser: number;
  arrivalPredictions: ArrivalPrediction[] | undefined;
}



