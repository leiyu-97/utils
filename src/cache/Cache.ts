abstract class Cache<Value> {
  abstract get(key: string): Value;

  abstract set(key: string, value: Value): void;

  abstract remove(key: string): void;

  abstract clear(): void;
}

export default Cache;
