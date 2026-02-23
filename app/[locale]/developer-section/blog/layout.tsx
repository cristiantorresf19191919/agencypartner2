import { Suspense } from "react";
import BlogLoading from "./loading";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<BlogLoading />}>{children}</Suspense>;
}
