import { resetKeyCounter } from "./from";
import { State } from "./types";

export function state<T>(object: T): State<T> {
  resetKeyCounter();
  return object as State<T>;
}
