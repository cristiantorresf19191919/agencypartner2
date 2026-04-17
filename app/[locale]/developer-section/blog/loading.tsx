import { SkeletonCard } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div style={{ padding: "120px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
