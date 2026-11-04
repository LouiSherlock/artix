"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useArticleStore } from "./article-store";

const getSnapshot = () => useArticleStore.persist?.hasHydrated() ?? true;
const getServerSnapshot = () => false;

export function useArticleHydrated() {
  const hydrated = useSyncExternalStore(
    (onStoreChange) => {
      const persist = useArticleStore.persist;
      if (!persist) return () => undefined;
      return persist.onFinishHydration(onStoreChange);
    },
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const persist = useArticleStore.persist;
    if (persist && !persist.hasHydrated()) {
      void persist.rehydrate();
    }
  }, []);

  return hydrated;
}
