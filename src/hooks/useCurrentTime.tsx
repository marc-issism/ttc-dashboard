import { useEffect, useState } from 'react'


const useCurrentTime = () => {

  const [currentTime, setCurrentTime] = useState<Date>(new Date(0));

  useEffect(() => {

    setCurrentTime(currentTime => new Date(Date.now()));
  }, [currentTime])

  console.log(currentTime);
  return currentTime;

}

export default useCurrentTime;