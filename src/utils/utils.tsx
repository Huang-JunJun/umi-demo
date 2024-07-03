export const generateRandomId = () => {
  return (
    'id-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 15)
  );
};
