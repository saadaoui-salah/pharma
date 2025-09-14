declare module 'fuse.js' {
  export type FuseResult<T> = { item: T; refIndex?: number; score?: number };
  export class Fuse<T> {
    constructor(list: T[], options?: any);
    search(pattern: string): Array<FuseResult<T>>;
  }
  export default Fuse;
}
