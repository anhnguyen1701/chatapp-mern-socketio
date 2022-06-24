import axios from 'axios';

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: 'LOGIN_START' });
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const res = await axios.post('/api/user/login', userCredential, config);

    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err });
  }
};
