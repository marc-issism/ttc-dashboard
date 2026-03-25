export type Prediction = {
  affectedByLayover: string;
  seconds: string;
  tripTag: string;
  minutes: string;
  isDeparture: string;
  block: string;
  dirTag: string;
  branch: string;
  epochTime: string;
  vehicle: string
}

export type Direction = {
  title: string;
  prediction: Prediction[];
}

export type NextBusData = {
  routeTag: string;
  stopTag: string;
  routeTitle: string;
  stopTitle: string;
  dirTitleBecauseNoPredictions?: string;
  direction: Direction | Direction[] | undefined;
}
