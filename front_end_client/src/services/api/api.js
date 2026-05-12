import network from '@/utils/network';

const auth = {
  login(payload) {
    return network.post('/v1/auth/login', payload);
  },
  register(payload){
    return network.post('/v1/auth/register', payload);
  }
};

export default auth;
