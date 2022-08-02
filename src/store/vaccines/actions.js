import client from "../../utils";
export const getAllVaccines = async ({ commit }) => {
  const { data } = await client.get("/api/vaccines-pw142");
  if (data) commit("getAllVaccines", data.data);
};
