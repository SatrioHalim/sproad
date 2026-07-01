import network from '@/utils/network';

const lists = {
  async create(data) {
    return network.post(`/api/v1/lists`, data);
  },
  async remove(listId) {
    return network.delete(`/api/v1/lists/${listId}`);
  },
  async getCards(listId) {
    return network.get(`/api/v1/lists/${listId}/cards`);
  },
  // miss di be -> buat dulu
  async updateCardPosition(listId, data) {
    return network.put(`/api/v1/lists/${listId}/positions`, {
      positions: data,
    });
  },
  async updateCardPositions(listId, data) {
    return lists.updateCardPosition(listId, data);
  },
};

export default lists;
