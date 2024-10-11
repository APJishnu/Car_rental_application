import Cookies from 'js-cookie';

export const removeUserToken = () => {
  Cookies.remove('userToken'); // Replace 'userToken' with your actual token name
};
