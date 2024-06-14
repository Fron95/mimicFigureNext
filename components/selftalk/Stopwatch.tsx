import React, { useEffect, useState, useRef } from 'react';
import styles from './Stopwatch.module.css'


interface StopwatchProps {
  start: boolean;
}

const Stopwatch: React.FC<StopwatchProps> = ({ start }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start]);

  const formatTime = (time: number) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return <div className={styles.stopwatch}>{formatTime(elapsedTime)}</div>;
};

export default Stopwatch;
