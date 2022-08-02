export function vaccines(state) {
  return state.vaccines;
}

export const getVaccine = state => vaccine_id => {
  return state.vaccines.find(v => v.id === vaccine_id);
};
