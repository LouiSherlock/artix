export {};

declare global {
  interface MathJaxGlobal {
    tex2svg?: (
      math: string,
      options: { display: boolean },
    ) => HTMLElement;
    tex2svgPromise?: (
      math: string,
      options: { display: boolean },
    ) => Promise<HTMLElement>;
    texReset?: () => void;
    startup?: {
      typeset?: boolean;
      defaultReady?: () => void;
      ready?: () => void;
      promise?: Promise<void>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  interface Window {
    /** 当前加载的 MathJax 配置版本，用于判断已加载实例是否可复用。 */
    __artixMathJaxVersion?: number;
    MathJax?: MathJaxGlobal;
  }
}
