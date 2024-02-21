export interface BaseEntity<T> {
  getProps(): T | undefined;

  isValidEntity(): boolean;
}
