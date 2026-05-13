import network from '@/utils/network';

const boards = {
  async myBoards() {
    return network.get('/api/v1/boards/my');
  },
};

export default boards;
