export class DeterministicRandom {
  private seed: number;
  private a: number = 1664525;
  private c: number = 1013904223;
  private m: number = Math.pow(2, 32);

  constructor(seed: number) {
      this.seed = seed;
  }

  next(): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return this.seed / this.m;
  }
}
