export interface RefState<T = any> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  valueRef: React.MutableRefObject<T>;
}
