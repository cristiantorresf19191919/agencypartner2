'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingTip {
  icon: string;
  text: string;
}

interface LoadingOverlayProps {
  show: boolean;
}

const loadingTips: LoadingTip[] = [
  {
    icon: '<i class="fa-solid fa-lightbulb"></i>',
    text: 'Mientras preparamos tu propuesta, piensa en los objetivos más importantes de tu proyecto.',
  },
  {
    icon: '<i class="fa-solid fa-rocket"></i>',
    text: 'Un buen brief acelera el desarrollo y mejora el resultado final de tu sitio o aplicación.',
  },
  {
    icon: '<i class="fa-solid fa-users"></i>',
    text: 'Cuanto mejor conozcamos a tu público objetivo, más efectiva será la solución digital.',
  },
  {
    icon: '<i class="fa-solid fa-chart-line"></i>',
    text: 'Tu proyecto puede convertirse en un canal constante de clientes si se diseña con estrategia.',
  },
];

const LoadingOverlay = ({ show }: LoadingOverlayProps): JSX.Element | null => {
  const [currentTip, setCurrentTip] = useState<number>(0);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerCircle} />
          <div className={styles.spinnerCircle} />
          <div className={styles.spinnerCircle} />
        </div>
        <p className={styles.loadingText}>Enviando tu mensaje...</p>
        <div className={styles.loadingTip}>
          <span
            className={styles.tipIcon}
            dangerouslySetInnerHTML={{ __html: loadingTips[currentTip].icon }}
          />
          <span className={styles.tipText}>{loadingTips[currentTip].text}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;



