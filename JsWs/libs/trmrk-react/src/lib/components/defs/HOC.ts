export interface HOCArgsCore<TArgs extends HOCArgsCore<TArgs, T, P>, T, P> {
  node: (
    props: React.PropsWithoutRef<P>,
    ref: React.ForwardedRef<T>,
  ) => React.ReactNode;
  props: React.PropsWithoutRef<P> & React.RefAttributes<T>;
}

export interface HOCArgs<T, P> extends HOCArgsCore<HOCArgs<T, P>, T, P> {}
