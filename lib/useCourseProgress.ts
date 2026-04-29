"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAllProgress,
  recordLessonVisit,
  recordLessonCompletion,
  type ProgressMap,
} from "./courseProgress";

/**
 * Subscribes to localStorage-backed course progress and re-renders when any
 * course updates. Listens to both the in-tab `course-progress-changed` event
 * (fired by `writeAll`) and the cross-tab `storage` event.
 */
export function useCourseProgress(): {
  progress: ProgressMap;
  recordVisit: (courseId: string, lesson: { id: string; title: string; href: string }) => void;
  recordCompletion: (courseId: string, lessonId: string) => void;
} {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(getAllProgress());
    const refresh = () => setProgress(getAllProgress());
    window.addEventListener("course-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("course-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const recordVisit = useCallback(
    (courseId: string, lesson: { id: string; title: string; href: string }) => {
      recordLessonVisit(courseId, lesson);
    },
    [],
  );

  const recordCompletion = useCallback(
    (courseId: string, lessonId: string) => {
      recordLessonCompletion(courseId, lessonId);
    },
    [],
  );

  return { progress, recordVisit, recordCompletion };
}
