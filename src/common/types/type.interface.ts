/** An interface that can be used for representing class references */
export interface Type<T = any> {
  new (...args: any[]): T;
}
