import dayjs from 'dayjs';

const datetime = {
  format(dateString, format = 'DD/MM/YYYY') {
    return dayjs(dateString).format(format);
  },
};

export default datetime;
