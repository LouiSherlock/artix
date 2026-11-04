import {
  BehaviorSubject,
  Subject,
  debounce,
  distinctUntilChanged,
  map,
  merge,
  timer,
  type Observable,
  type Subscription,
} from "rxjs";

export interface DocumentSnapshot {
  value: string;
  at: number;
}

export interface HistoryState {
  snapshots: DocumentSnapshot[];
  index: number;
}

export interface DocumentHistoryOptions {
  debounceMs?: number;
  limit?: number;
}

export interface DocumentHistory {
  state$: Observable<HistoryState>;
  canUndo$: Observable<boolean>;
  canRedo$: Observable<boolean>;
  record: (value: string) => void;
  flush: () => void;
  undo: () => string | null;
  redo: () => string | null;
  reset: (value: string) => void;
  current: () => string;
  destroy: () => void;
}

export function createDocumentHistory(
  initialValue: string,
  options: DocumentHistoryOptions = {},
): DocumentHistory {
  const debounceMs = options.debounceMs ?? 360;
  const limit = options.limit ?? 120;
  const pending$ = new Subject<string>();
  const flush$ = new Subject<void>();

  const state$ = new BehaviorSubject<HistoryState>({
    snapshots: [{ value: initialValue, at: Date.now() }],
    index: 0,
  });

  const push = (value: string) => {
    const state = state$.value;
    const head = state.snapshots[state.index];
    if (head?.value === value) return;

    const snapshots = state.snapshots.slice(0, state.index + 1);
    snapshots.push({ value, at: Date.now() });

    const overflow = Math.max(0, snapshots.length - limit);
    const trimmed = overflow ? snapshots.slice(overflow) : snapshots;

    state$.next({
      snapshots: trimmed,
      index: trimmed.length - 1,
    });
  };

  const subscription: Subscription = pending$
    .pipe(
      debounce(() => merge(timer(debounceMs), flush$)),
      distinctUntilChanged(),
    )
    .subscribe(push);

  const move = (delta: number): string | null => {
    flush$.next();
    const state = state$.value;
    const nextIndex = state.index + delta;
    if (nextIndex < 0 || nextIndex >= state.snapshots.length) return null;
    state$.next({ ...state, index: nextIndex });
    return state.snapshots[nextIndex].value;
  };

  return {
    state$: state$.asObservable(),
    canUndo$: state$.pipe(
      map((state) => state.index > 0),
      distinctUntilChanged(),
    ),
    canRedo$: state$.pipe(
      map((state) => state.index < state.snapshots.length - 1),
      distinctUntilChanged(),
    ),
    record: (value) => pending$.next(value),
    flush: () => flush$.next(),
    undo: () => move(-1),
    redo: () => move(1),
    reset: (value) => {
      subscription.unsubscribe();
      state$.next({
        snapshots: [{ value, at: Date.now() }],
        index: 0,
      });
    },
    current: () => {
      const state = state$.value;
      return state.snapshots[state.index]?.value ?? initialValue;
    },
    destroy: () => {
      subscription.unsubscribe();
      pending$.complete();
      flush$.complete();
      state$.complete();
    },
  };
}
