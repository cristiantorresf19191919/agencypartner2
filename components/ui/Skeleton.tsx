import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({ width = "100%", height = 20, borderRadius = 6, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className || ""}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`${styles.skeletonCard} ${className || ""}`}>
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="75%" />
      <Skeleton height={32} width="40%" borderRadius={8} />
    </div>
  );
}
