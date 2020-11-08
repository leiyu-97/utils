/**
 * @module time
 */

/**
 * @summary 一秒的毫秒数
 * @type {Number}
 */
export const SECOND = 1000;

/**
 * @summary 一分钟的毫秒数
 * @type {Number}
 */
export const MINUTE = 60 * SECOND;

/**
 * @summary 一小时的毫秒数
 * @type {Number}
 */
export const HOUR = 60 * MINUTE;

/**
 * @summary 一天的毫秒数
 * @type {Number}
 */
export const DAY = 24 * HOUR;

/**
 * @summary 一周的毫秒数
 * @type {Number}
 */
export const WEEK = 7 * DAY;

/**
 * 日期格式化，格式参考 https://www.php.net/manual/zh/function.date.php
 * @param {Date|String|Number} dateStr 需要格式化的日期
 * @param {String} format 格式
 * @returns {String} 格式化后的字符串
 */
export function formatTime(dateStr: string | number | Date, format: string): string {
  let num: string | number | any[];
  let year: number | Date;
  const date = new Date(dateStr);
  if (date.toString() === 'Invalid Date') {
    return 'Invalid Date';
  }

  const result = format.replace(/[a-zA-Z]/gm, (char: any) => {
    switch (char) {
      case 'd':
        return date.getDate().toString().padStart(2, '0');
      case 'D':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      case 'j':
        return date.getDate().toString();
      case 'l':
        return [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][date.getDay()];
      case 'N':
        num = date.getDay();
        return num === 0 ? 7 : num + 1;
      case 'S':
        num = date.getDay().toString();
        return ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][
          num[num.length - 1]
        ];
      case 'w':
        return date.getDay();
      case 'z':
        return (
          Math.floor(
            (date.getTime()
              - new Date(`${date.getFullYear()}-01-01`).getTime())
              / DAY,
          ) + 1
        );
      case 'W':
        year = new Date(`${date.getFullYear()}-01-01`);
        num = year.getDay();
        num = num === 0 ? 6 : num - 1;
        return (
          Math.floor((date.getTime() - year.getTime() + num * DAY) / WEEK) + 1
        );
      case 'F':
        return [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][date.getMonth()];
      case 'm':
        return (date.getMonth() + 1).toString().padStart(2, '0');
      case 'M':
        return [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ][date.getMonth()];
      case 'n':
        return date.getMonth() + 1;
      case 't':
        num = date.getFullYear() / 4;
        return [
          '31',
          Math.ceil(num) - num ? '28' : '29',
          '31',
          '30',
          '31',
          '30',
          '31',
          '31',
          '30',
          '31',
          '30',
          '31',
        ][date.getMonth()];
      case 'L':
        num = date.getFullYear() / 4;
        return Math.floor(num - Math.ceil(num)) + 1;
      case 'Y':
        return date.getFullYear().toString();
      case 'y':
        return date.getFullYear().toString().slice(2);
      case 'a':
        return date.getHours() < 12 ? 'am' : 'pm';
      case 'A':
        return date.getHours() < 12 ? 'AM' : 'PM';
      case 'g':
        num = date.getHours();
        if (num === 0) {
          num = 12;
        }
        return (num > 12 ? num - 12 : num).toString();
      case 'G':
        return date.getHours().toString();
      case 'h':
        num = date.getHours();
        if (num === 0) {
          num = 12;
        }
        return (num > 12 ? num - 12 : num).toString().padStart(2, '0');
      case 'H':
        return date.getHours().toString().padStart(2, '0');
      case 'i':
        return date.getMinutes().toString().padStart(2, '0');
      case 's':
        return date.getSeconds().toString().padStart(2, '0');
      case 'u':
        return date.getMilliseconds().toString().padStart(3, '0');
      case 'r':
        return date.toString();
      case 'U':
        return date.getTime().toString();
      default:
        return char;
    }
  });
  return result;
}
