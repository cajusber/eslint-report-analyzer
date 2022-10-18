export function unique<T = unknown>(array: T[]): T[] {
  const uniqueArray: T[] = [];
  for (const arrayValue of array) {
    if (!uniqueArray.includes(arrayValue)) {
      uniqueArray.push(arrayValue);
    }
  }

  return uniqueArray;
}
