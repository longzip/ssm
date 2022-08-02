import client from "../../utils";
export const getAllContacts = async ({ commit }, payload) => {
  const { startDate, endDate = startDate, name, coSoIds = [], page } = payload;

  // const { data } = await client.get("/api/kids");

  let url = "/api/kids-pw142?";
  if (page) url += `page=${page}`;
  if (name) url += `&name=${name}`;
  if (startDate) url += `&ngaySinhs[]=${startDate}&ngaySinhs[]=${endDate}`;
  if (coSoIds.length)
    coSoIds.forEach(coSoId => {
      url += `&coSoIds[]=${coSoId}`;
    });
  const { data } = await client.get(url);

  if (data) commit("getAllContacts", data);
};
