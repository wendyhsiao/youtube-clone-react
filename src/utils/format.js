// 千分位逗點
export const commaFormat = function (str) {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
// 計數格式轉換
export const countFormat = function (str) {
  if (str <= 4) {
    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else if (str <= 5) {
    str = `${str.slice(0)}.${str.slice(1)}萬`;
  } else {
    str = `${str.slice(0, str.length - 4)}萬`;
  };
  return str;
};
// 換行轉 br
export const newline2br = (str) => {
  return str.replace(/(\r|\n|\r\n)/g, '<br/>');
};
// 日期轉換
export const fetchYear = (str, type) => {
  let date = str.slice(0, 10).split('-');
  if (type === 'year') return `${date[0]}年`;
  if (type === 'day') return `${Number(date[1])}月${Number(date[2])}日`;
};