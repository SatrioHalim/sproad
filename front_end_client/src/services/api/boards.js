import network from '@/utils/network';

const boards = {
  async myBoards(params) {
    return network.get('/api/v1/boards/my', { params });
  },
};

export default boards;
