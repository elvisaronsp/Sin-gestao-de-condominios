function getDateWithShortYear(stringDate = '') {
  const splitDate = stringDate.split('/');
  const day = splitDate[0];
  const month = splitDate[1];
  let year = splitDate[2].split(' ')[0];
  year = year.substring(year.length - 2);

  return `${day}/${month}/${year}`;
}

function getDateWithFullYear(stringDate = '') {
  const splitDate = stringDate.split('/');
  const day = splitDate[0];
  const month = splitDate[1];
  let year = splitDate[2].split(' ')[0];

  return `${day}/${month}/${year}`;
}

function getTime(stringDate = '') {
  return stringDate.split(' ')[1] || stringDate.split(' ')[0];
}

function getCurrencyFormat(number) {
  if (Number.isNaN(number)) {
    return 'Valor indefinido';
  }

  return `R$ ${number.toFixed(2).replace('.', ',')}`;
}

function brDateToUSADate(stringDate = '') {
  if (!stringDate) return '';
  const splitDate = stringDate.split('/');
  const day = splitDate[0];
  const month = splitDate[1];
  let year = splitDate[2].split(' ')[0];
  if (year.length === 2) {
    year = '20' + year;
  }

  return year + '-' + month + '-' + day;
}

function usaDateToBRDate(stringDate = '') {
  if (!stringDate) return '';
  const splitDate = stringDate.split('-');
  const year = splitDate[0];
  const month = splitDate[1];
  const day = splitDate[2].split(' ')[0];

  return day + '/' + month + '/' + year;
}

function isoDateToBRDate(stringDate = '') {
  if (!stringDate) return '';
  const splitDate = stringDate.split('-');
  const year = splitDate[0];
  const month = splitDate[1];
  const day = splitDate[2].split('T')[0];

  return day + '/' + month + '/' + year;
}


function dateObjToBRDate(dateObj = new Date()) {
  if (!dateObj) return '';
  return isoDateToBRDate(dateObj.toISOString());
}

function usaDateToBRDateShortYear(stringDate = '') {
  const date = usaDateToBRDate(stringDate);
  return getDateWithShortYear(date);
}

function getYearFromBRDate(stringDate = '') {
  const date = getDateWithFullYear(stringDate);
  return parseInt(date.split('/')[2]);
}

function getMonthFromBRDate(stringDate = '') {
  const date = getDateWithFullYear(stringDate);
  return parseInt(date.split('/')[2]);
}

function getDayFromBRDate(stringDate = '') {
  const date = getDateWithFullYear(stringDate);
  return parseInt(date.split('/')[2]);
}

function getDateWithShortYearFromDateObj(dateObj) {
  if (!dateObj) return null;
  let day = '0' + dateObj.getDate();
  day = day.substring(day.length - 2);
  let month = '0' + dateObj.getMonth();
  month = day.substring(day.length - 2);
  const year = dateObj.getFullYear();
  const date = day + '/' + month + '/' + year;
  return getDateWithShortYear(date);
}

function getHoraMinutoFromPickerDate(date) {
  const regex = new RegExp(/\d{2,2}:\d{2,2}/);
  return (regex.exec(date) || [])[0];
}

function getHoraFromPickerDate(date) {
  const horaMinuto = getHoraMinutoFromPickerDate(date) || '';
  return horaMinuto.substring(0, 2);
}

function getMessageFromError(error, alternativeMsg) {
  if (error && error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.mensagem) {
    return (error.response.data.mensagem || '').replace(/<b>|<\/b>/g, '').replace(/<br>/g, '\n');
  }
  return alternativeMsg;
}

function getImageUrl(url = '') {
  const newUrl = url.replace('http://', '').replace('https://', '');
  return 'http://' + newUrl;
}

export default {
  getDateWithShortYear,
  getDateWithFullYear,
  getTime,
  getCurrencyFormat,
  brDateToUSADate,
  usaDateToBRDate,
  isoDateToBRDate,
  dateObjToBRDate,
  usaDateToBRDateShortYear,
  getYearFromBRDate,
  getMonthFromBRDate,
  getDayFromBRDate,
  getDateWithShortYearFromDateObj,
  getHoraMinutoFromPickerDate,
  getHoraFromPickerDate,
  getMessageFromError,
  getImageUrl
}