export const timeoutToPromise = (delay: number) =>
  new Promise<NodeJS.Timeout>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(timeoutId);
    }, delay);
  });
