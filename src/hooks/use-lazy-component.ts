import { lazy, ComponentType } from 'react';

/**
 * Hook para criar componentes lazy com retry automático em caso de erro
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3
) {
  return lazy(() => {
    return importFunc().catch((error) => {
      if (retries > 0) {
        console.warn(`Falha ao carregar componente, tentando novamente... (${retries} tentativas restantes)`);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(useLazyComponent(importFunc, retries - 1));
          }, 1000);
        });
      }
      throw error;
    });
  });
}
