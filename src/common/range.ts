/* eslint-disable max-classes-per-file */
/**
 * 简单的范围对象
 */
class SimpleRange<T> {
  public min: T;

  public max: T;

  /**
   * @param {array} range 范围
   * @param {Number|String} range.min 最小值，可以等于
   * @param {Number|String} range.max 最大值，不可等于
   */
  constructor([min, max]: [T, T]) {
    this.min = min;
    this.max = max;
  }

  /**
   * @summary 判断值是否在范围内
   * @param {Number|String} value 值
   * @return {Boolean} 值是否在范围内
   */
  includes(value: T): boolean {
    const { min, max } = this;
    return value >= min && value < max;
  }
}

type RangeArray<T> = [T, T] | Array<RangeArray<T> | SimpleRange<T> | Range<T>>;

/**
 * 复合范围对象
 */
export default class Range<T> {
  public ranges: Array<SimpleRange<T>>;

  static SimpleRange = SimpleRange

  /**
   * @param {array} array 范围数组（可多级嵌套）
   */
  constructor(array: RangeArray<T> | SimpleRange<T> | Range<T>) {
    this.ranges = Range.toSimpleRanges(array);
    this.format();
  }

  /**
   * @summary 判断值是否在范围内
   * @param {Number|String} value 值
   * @return {Boolean} 值是否在范围内
   */
  includes(value: T): boolean {
    return this.ranges.some((range) => range.includes(value));
  }

  /**
   * @summary 添加一个或多个范围
   * @param {Array} array 范围数组
   * @return {undefined}
   */
  includeRanges(array: RangeArray<T>): void {
    const ranges = Range.toSimpleRanges(array);
    this.ranges = [...this.ranges, ...ranges];
    this.format();
  }

  /**
   * @summary 排除一个或多个范围
   * @param {Array} array 范围数组
   * @return {undefined}
   */
  excludeRanges(array: RangeArray<T>): void {
    Range.toSimpleRanges(array).forEach(this.excludeRange.bind(this));
  }

  excludeRange(excludeRange: SimpleRange<T>): void {
    const { ranges } = this;
    this.ranges = ranges
      .reduce<Array<SimpleRange<T>>>((result, range) => {
        if (range.min >= excludeRange.max || range.max <= excludeRange.min) {
          // 没有交集，无需处理
          result.push(range);
        } else {
          // 有交集，当前 range 拆分成两个
          result.push(
            new SimpleRange([range.min, excludeRange.min]),
            new SimpleRange([excludeRange.max, excludeRange.max]),
          );
        }
        return result;
      }, [])
      // 移除为空的 range
      .filter((range) => range.max > range.min);
  }

  format(): void {
    const { ranges } = this;
    // 按照 min 从小到大排序
    ranges.sort((a, b) => (a.min > b.min ? 1 : -1));
    // 循环对比 newRanges[i] 与 newRanges[i + 1]
    let i = 0;
    while (ranges[i + 1]) {
      const cur = ranges[i];
      const next = ranges[i + 1];
      if (cur.max >= next.min) {
        // a 与 b 有交集，扩展 a，删除 b，然后继续用 a 进行对比
        cur.max = next.max;
        ranges.splice(i + 1, 1);
      } else {
        // a 与 b 没有交集
        i++;
      }
    }
  }

  static toSimpleRanges<T>(
    array: RangeArray<T> | SimpleRange<T> | Range<T>,
  ): Array<SimpleRange<T>> {
    if (array instanceof SimpleRange) return [array];

    if (array instanceof Range) return array.ranges;

    /** ts */
    const isTuple = array.length === 2
      && (array as Array<any>).every(
        (item) => typeof item === 'string' || typeof item === 'number',
      );
    if (isTuple) return [new SimpleRange(array as [T, T])];

    const rangeArrays = (array as Array<
      RangeArray<T> | SimpleRange<T> | Range<T>
    >).map((item) => {
      if (!(item instanceof Range)) {
        item = new Range(item);
      }

      if (item instanceof SimpleRange) {
        return [item];
      }

      return item.ranges;
    });

    return [].concat(...rangeArrays);
  }
}
