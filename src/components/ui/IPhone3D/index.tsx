'use client';

import dynamic from 'next/dynamic';
import styles from './IPhone3D.module.css';

// Skeleton exibido enquanto o 3D carrega
function IPhone3DSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.skeleton} aria-label="Loading 3D model" />
    </div>
  );
}

// Lazy load do componente pesado (Three.js)
const IPhone3DCanvas = dynamic(() => import('./IPhone3DCanvas'), {
  loading: () => <IPhone3DSkeleton />,
  ssr: false // Three.js não funciona em SSR
});

export default function IPhone3D() {
  return (
    <div className={styles.container}>
      <IPhone3DCanvas />
    </div>
  );
}
