export const isFloat = (n: number) => {
  return typeof n === 'number' && n % 1 !== 0
}
