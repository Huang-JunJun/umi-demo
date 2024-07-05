export const generateRandomId = () => {
  return (
    'id-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 15)
  );
};

export const findMax = (data: any, type: any) => {
  return data.reduce(
    (max: any, item: any) => (item[type] > max[type] ? item : max),
    data[0],
  );
};

export const findMin = (data: any, type: any) => {
  return data.reduce(
    (min: any, item: any) => (item[type] < min[type] ? item : min),
    data[0],
  );
};
