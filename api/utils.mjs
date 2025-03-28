export const getResponseHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*',
  };
};

export const getUserId = (headers) => {
  return headers.userId;
};

export const getUsername = (headers) => {
  return headers.username;
};
