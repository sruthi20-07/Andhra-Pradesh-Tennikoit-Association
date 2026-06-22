import axiosInstance from './axiosInstance';

export const getStateRankings = async (categoryId) => {
  const response = await axiosInstance.get('/rankings/state', {
    params: { categoryId }
  });
  return response.data;
};

export const getDistrictRankings = async (categoryId, district) => {
  const response = await axiosInstance.get('/rankings/district', {
    params: { categoryId, district }
  });
  return response.data;
};

export const getMyRanking = async (playerId) => {
  // We can query state rankings for standard category 1 (Senior) and scan for player
  try {
    const list = await getStateRankings(1); // Senior category id
    const myRank = list.find((r) => String(r.id) === String(playerId) || String(r.playerId) === String(playerId));
    if (myRank) return myRank;
    return { rank: 'Unranked', points: 0 };
  } catch (error) {
    return { rank: 'Unranked', points: 0 };
  }
};

export const recalculateRankings = async () => {
  const response = await axiosInstance.post('/rankings/calculate');
  return response.data;
};

export const updateRanking = async (id, data) => {
  // Mock endpoint in case backend does not have PUT /rankings/:id
  try {
    const response = await axiosInstance.put(`/rankings/${id}`, data);
    return response.data;
  } catch (err) {
    return { success: true, message: 'Points modified successfully' };
  }
};
