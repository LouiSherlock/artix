"use client";

import { useEffect, useState } from "react";
import type { Observable } from "rxjs";

import { createDocumentHistory, type DocumentHistory } from "./document-history";

export function useDocumentHistory(initialValue: string): DocumentHistory {
  const [history] = useState(() => createDocumentHistory(initialValue));
  return history;
}

export function useObservableValue<T>(
  observable: Observable<T>,
  initialValue: T,
): T {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}
