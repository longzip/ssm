import client from "../utils";

const state = {
  bhyts: []
};

const mutations = {
  setBhyts(state, payload) {
    state.bhyts = payload;
  },
  updateBhyt(state, payload) {
    let found = state.bhyts.find(x => x.maSoBhxh === payload.maSoBhxh);
    if (found) Object.assign(found, payload);
    else state.bhyts.push(payload);
  }
};

const actions = {
  getBhyts: async ({ commit }, payload) => {
    const {
      completed,
      disabled,
      name,
      thang,
      maHoGd,
      chuaDongBo,
      taiTuc,
      hetHan,
      maXa
    } = payload;

    let url = "https://cms.buudienhuyenmelinh.vn/api/bhyts?";
    if (thang) url += `thang=${thang}`;
    if (maXa) url += `&maXa=${maXa}`;
    if (taiTuc) url += `&taiTuc=${taiTuc}`;
    if (hetHan) url += `&hetHan=${hetHan}`;
    if (name) url += `&name=${name}`;
    if (completed) url += `&completed=${completed}`;
    if (disabled) url += `&disabled=${disabled}`;
    if (maHoGd) url += `&maHoGd=${maHoGd}`;
    if (chuaDongBo) url += `&chuaDongBo=${chuaDongBo}`;
    const { data } = await client.get(url);
    commit("setBhyts", data);
  },
  traCuuBhyts: async ({ commit }, payload) => {
    commit("setBhyts", []);
    const { searchText, maXa } = payload;
    if (!searchText) return;
    const danhSachTimKiem = searchText.split(",");
    if (danhSachTimKiem.length === 1) {
      const name = searchText
        .split(" ")
        .map(value => value.charAt(0).toUpperCase() + value.slice(1))
        .join(" ");
      let url = `https://cms.buudienhuyenmelinh.vn/api/bhyts?name=${name}&maXa=${maXa}`;
      const { data } = await client.get(url);
      commit("setBhyts", data);
      return;
    }
  },
  updateBhyt: ({ commit }, payload) => {
    commit("updateBhyt", payload);
  },
  resetBhyt: async ({ commit }, payload) => {
    await commit("setBhyts", [...payload]);
  },
  loaiBo: async ({ commit }, { maSoBhxh, disabled }) => {
    // console.log(maSoBhxh, disabled);
    const { data } = await client.put(
      `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/disabled`,
      {
        disabled: disabled == 0 ? 1 : 0
      }
    );
    commit("updateBhyt", data);
  },
  theoDoi: async ({ commit }, { maSoBhxh, completed }) => {
    // console.log(maSoBhxh, completed);
    const { data } = await client.put(
      `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/completed`,
      {
        completed: completed == 0 ? 1 : 0
      }
    );
    commit("updateBhyt", data);
  }
};

const getters = {
  bhyts: state => state.bhyts
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
