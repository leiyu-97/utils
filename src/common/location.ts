type Point = [number, number];

const {
  sin, cos, sqrt, tan, atan, atan2, abs, PI,
} = Math;

const equatorRadius = 6378137; // 赤道半径
const polesRadius = 6356752.314245; // 两极半径
const meanRadius = (2 * equatorRadius + polesRadius) / 3; // 平均半径

/**
 * 相关链接: https://en.wikipedia.org/wiki/Great-circle_distance#Computational_formulas
 * @param {Array} point1 第一个点坐标
 * @param {Array} point1.0 纬度(弧度)
 * @param {Array} point1.1 经度(弧度)
 * @param {Array} point2 第二个点坐标
 * @param {Array} point1.0 纬度(弧度)
 * @param {Array} point1.1 经度(弧度)
 * @param {Number} r 球半径
 * @return {Number} 两点球面距离
 */
function haversine(
  [phi1, lamda1]: Point,
  [phi2, lamda2]: Point,
  r: number,
): number {
  const deltaLamda = Math.abs(lamda1 - lamda2);
  const sigma = atan(
    sqrt(
      (cos(phi2) * sin(deltaLamda)) ** 2
        + (cos(phi1) * sin(phi2) - sin(phi1) * cos(phi2) * cos(deltaLamda)) ** 2,
    )
      / (sin(phi1) * sin(phi2) + cos(phi1) * cos(phi2) * cos(deltaLamda)),
  );

  return sigma * r;
}

/**
 * 相关链接: https://en.wikipedia.org/wiki/Vincenty%27s_formulae
 * @param {Array} point1 第一个点坐标
 * @param {Array} point1.0 纬度(弧度)
 * @param {Array} point1.1 经度(弧度)
 * @param {Array} point2 第二个点坐标
 * @param {Array} point1.0 纬度(弧度)
 * @param {Array} point1.1 经度(弧度)
 * @param {Number} a 赤道半径
 * @param {Number} b 两极半径
 * @return {Number} 两点球面距离
 */
function vincenty(
  [phi1, L1]: Point,
  [phi2, L2]: Point,
  a: number,
  b: number,
): number {
  phi1 %= PI / 2;
  phi2 %= PI / 2;
  L1 %= PI / 2;
  L2 %= PI / 2;

  const f = 1 - b / a;
  const U1 = atan((1 - f) * tan(phi1));
  const U2 = atan((1 - f) * tan(phi2));
  const L = L2 - L1;

  const sinU1 = sin(U1);
  const cosU1 = cos(U1);
  const sinU2 = sin(U2);
  const cosU2 = cos(U2);

  let lamda = L;
  let lamdaPrime = null;
  let cosAlphaSquare: number;
  let sinLamda: number;
  let cosLamda: number;
  let sinSigma: number;
  let cosSigma: number;
  let sigma: number;
  let sinAlpha: number;
  let cos2SigmaM: number;
  let C: number;

  let i = 0;
  while (i++ < 1000 && (!lamdaPrime || abs(lamdaPrime - lamda) > 1e-12)) {
    sinLamda = sin(lamda);
    cosLamda = cos(lamda);

    sinSigma = sqrt(
      (cosU2 * sinLamda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLamda) ** 2,
    );
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLamda;
    sigma = atan2(sinSigma, cosSigma);
    sinAlpha = (cosU1 * cosU2 * sinLamda) / sinSigma;
    cosAlphaSquare = 1 - sinAlpha ** 2;
    cos2SigmaM = phi1 === 0 && phi2 === 0
      ? -1
      : cosSigma - (2 * sinU1 * sinU2) / (1 - sinAlpha ** 2);
    C = (f / 16) * cosAlphaSquare * (4 + f * (4 - 3 * cosAlphaSquare));

    lamdaPrime = lamda;
    lamda = L
      + (1 - C)
        * f
        * sinAlpha
        * (sigma
          + C
            * sinSigma
            * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
  }

  const uSquare = cosAlphaSquare * ((a ** 2 - b ** 2) / b ** 2);
  const A = 1
    + (uSquare / 16384)
      * (4096 + uSquare * (-768 + uSquare * (320 - 175 * uSquare)));
  const B = (uSquare / 1024) * (256 + uSquare * (-128 + uSquare * (74 - 47 * uSquare)));
  const deltaSigma = B
    * sinSigma
    * (cos2SigmaM
      + (B / 4)
        * (cosSigma * (-1 + 2 * cos2SigmaM ** 2)
          - (B / 6)
            * cos2SigmaM
            * (-3 + 4 * sinSigma ** 2)
            * (-3 + 4 * cos2SigmaM ** 2)));
  const s = b * A * (sigma - deltaSigma);
  return s;
}

/**
 * 相关链接: https://zh.wikipedia.org/wiki/%E5%A4%A7%E5%9C%86%E8%B7%9D%E7%A6%BB
 * @param {Array} point1 第一个点坐标
 * @param {Array} point1.0 纬度
 * @param {Array} point1.1 经度
 * @param {Array} point2 第二个点坐标
 * @param {Array} point1.0 纬度
 * @param {Array} point1.1 经度
 * @param {Boolean} accurate 是否使用精度更高但更加消耗性能的模式
 * @return {Number} 距离(米)
 */
export function computeDistance(
  [lat1, lon1]: Point,
  [lat2, lon2]: Point,
  accurate: boolean,
): number {
  const phi1 = (lat1 / 180) * Math.PI;
  const phi2 = (lat2 / 180) * Math.PI;
  const lamda1 = (lon1 / 180) * Math.PI;
  const lamda2 = (lon2 / 180) * Math.PI;

  return accurate
    ? vincenty([phi1, lamda1], [phi2, lamda2], equatorRadius, polesRadius)
    : haversine([phi1, lamda1], [phi2, lamda2], meanRadius);
}
