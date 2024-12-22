export class Generator {
  public generateArrayOfRandomData(
    from: number,
    to: number,
    size: number,
  ): number[] {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array[i] = this.generateRandomNumber(from, to);
    }
    return array;
  }

  public generateRandomNumber(from: number, to: number) {
    const min = Math.ceil(from);
    const max = Math.floor(to);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
