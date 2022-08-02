export const costcenters = state => state.costcenters;
export const tenCoSo = state => coSoId => {
  if (!coSoId) return "";
  const costcenter = state.costcenters.find(c => c.CO_SO_ID == coSoId);
  if (costcenter) return costcenter.TEN_CO_SO;
  return "";
};
