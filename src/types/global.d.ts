import 'react';

// Глобальное объявление JSX namespace для совместимости с React 19
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

