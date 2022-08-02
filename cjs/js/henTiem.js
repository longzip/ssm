console.log("Load hen tiem 2");
function coSo() {
  CoSoId = $("#hfCosoId").val();
  TenCoSo = $("#hfTenCoSo").val();
  TenCoSoGiong = TenCoSo;
  // if (!CoSoId) CoSoId = 32054;
  if (!TenCoSo) {
    TenCoSo = $(".userlogged span").text();
    if (TenCoSo === "Công ty cổ phần GIONG Việt Nam") {
      CoSoId = 21630;
      TenCoSoGiong = "TTTC GIÓNG LONG BIÊN";
    } else if (TenCoSo === "Trung tâm Tiêm chủng GIONG Thanh Oai") {
      CoSoId = 25753;
      TenCoSoGiong = "TTTC GIÓNG THANH OAI";
    } else if (TenCoSo === "Trung tâm tiêm chủng Vắc xin GIONG Mê Linh") {
      CoSoId = 26235;
      TenCoSoGiong = "TTTC GIÓNG MÊ LINH";
    } else {
      CoSoId = 32054;
      TenCoSoGiong = "TTTC GIÓNG PHÚC YÊN";
    }
  }
  return { CoSoId, TenCoSo, TenCoSoGiong };
}

let readLichSuTiem = async () => {
  const arrData = [];
  const lichSuTiem = $("#lichSuTiem tr");
  await lichSuTiem.each(function() {
    var currentRow = $(this);
    if (parseInt(currentRow.find("td:eq(0)").text()))
      arrData.push({
        TEN_VACXIN: currentRow.find("td:eq(1)").text(),
        thuTuMuiTiem: currentRow.find("td:eq(2)").text(),
        NgayTiem: currentRow.find("td:eq(4)").text()
      });
  });
  return arrData.map(a => ({
    TEN_VACXIN: a.TEN_VACXIN.split("\n")[1].trim(),
    thuTuMuiTiem: parseInt(a.thuTuMuiTiem),
    ngayTiem: CommonJS.ckFormatDate(a.NgayTiem)
  }));
};

let getMapVaccinesFromCache = () => {
  if (
    typeof Storage != "undefined" &&
    sessionStorage.getItem("MAP_VACXIN_DATA") !== null
  ) {
    const data = JSON.parse(sessionStorage.getItem("MAP_VACXIN_DATA"));
    data.forEach(value => {
      const { VACXIN_ID, thuTuMuiTiem } = value;
      const key = "" + thuTuMuiTiem + VACXIN_ID;
      mapVaccines.set(key, value);
    });
  }
};

var mapVaccines = new Map();
getMapVaccinesFromCache();

let getMapVaccines = () => {
  // mapVaccines = new Map();
  const { NGAY_SINH } = readContact();
  readLichSuTiem().then(data => {
    // for (var value of mapVaccines.values()) {
    //   value.LichSuTiemId = "0";
    //   value.completed = "3";
    // }
    for (var key of mapVaccines.keys()) {
      mapVaccines.set(key, {
        ...mapVaccines.get(key),
        LichSuTiemId: "0",
        completed: "0",
        NgayTiem: moment(NGAY_SINH)
          .add(++mapVaccines.get(key).soNgays, "d")
          .format()
          .slice(0, 10),
        isNew: true
      });
    }
    data.forEach(l => {
      const { TEN_VACXIN, thuTuMuiTiem, ngayTiem } = l;
      const { VACXIN_ID } = findVaccineByName(TEN_VACXIN);
      let soNgays = Math.floor(
        (ngayTiem.getTime() - new Date(NGAY_SINH).getTime()) / 86400000
      );
      const key = "" + thuTuMuiTiem + VACXIN_ID;
      if (VACXIN_ID && thuTuMuiTiem) {
        if (mapVaccines.has(key)) {
          if (soNgays > 0 && soNgays > mapVaccines.get(key).soNgays)
            soNgays = mapVaccines.get(key).soNgays;

          mapVaccines.set(key, {
            ...mapVaccines.get(key),
            ngayTiem,
            soNgays,
            LichSuTiemId: "1",
            NgayTiem: moment(NGAY_SINH)
              .add(++soNgays, "d")
              .format()
              .slice(0, 10)
          });
        } else {
          mapVaccines.set(key, {
            ...l,
            VACXIN_ID,
            soNgays
          });
        }
      }
    });
    sessionStorage.setItem(
      "MAP_VACXIN_DATA",
      JSON.stringify([...mapVaccines.values()])
    );
    console.log([...mapVaccines.values()].filter(v => v.LichSuTiemId === "0"));
  });
};

const findVaccineByName = TEN_VACXIN => {
  if (DsVacxin == null) {
    ImCache.GetDsVacxinFromCache(function(dsVacxinCached) {
      DsVacxin = dsVacxinCached;
    });
  }
  return DsVacxin.find(v => v.TEN_VACXIN === TEN_VACXIN);
};

const tempHenTiem = $('<div id="readMuiTiemTam"></div>');
$("body").append(tempHenTiem);

const btnHenTiem = $(
  '<button class="btn btn-success" style="position: fixed;right: 0px;bottom: 10px; z-index: 9999;">GVC</button>'
).click(() => {
  mapVaccines = new Map();
  console.log(mapVaccines);
});
$("section").append(btnHenTiem);

function khoiTaoLichHenMuiTiem() {
  dongBoDuLieu();
  const btnHenLichMuiTiem =
    '<button type="button" id="btnThemLichMuiTiem" class="btn btn-warning"><i class="fa fa-plane mr5"></i>Hẹn tiêm</button>';
  const findBtn = $("#btnThemNhanh").parent();
  findBtn.prepend($(btnHenLichMuiTiem));
  $("#btnThemLichMuiTiem").on("click", function(e) {
    createdRowObj();
  });
}
const XoaMuiTiemHen = async obj => {
  const selectedRow = $(obj)
    .parent()
    .parent();
  const colTaskId = selectedRow.find("input[name='taskId']").first();
  console.log("Xoa", colTaskId.val());
  try {
    const data = await $.ajax({
      url: `https://app.tiemchunggiongvina.com/api/tasks-pw142/${colTaskId.val()}`,
      type: "DELETE",
      async: true
    });
    if (data) {
      console.log(data);
      selectedRow.remove();
    }
  } catch (e) {
    console.log(e);
  }
};
const LuuMuiTiemHen = async obj => {
  const selectedRow = $(obj)
    .parent()
    .parent();

  const colVacxin = selectedRow.find("select[name='Vacxin']").first();
  const colNgayTiem = selectedRow.find("input[name='NgayTiem']").first();
  const colThuTuMuiTiem = selectedRow.find("input[name='ThuTuMui']").first();

  const data = {
    ...coSo(),
    VacxinId: colVacxin.val(),
    DoiTuongId: $("#hfDoiTuongId_Detail").val(),
    ThuTuMuiTiem: colThuTuMuiTiem.val(),
    LichSuTiemId: 0
  };
  const task = await updateTask({
    ...data,
    NgayTiem: getDateToSubmit(colNgayTiem.val())
  });
  if (task) {
    selectedRow.remove();
    createdRowObj(
      task.VacxinId,
      getDateString(task.NgayTiem),
      task.ThuTuMuiTiem,
      task.id,
      task.completed,
      false
    );
  }
};

const dongBoDuLieu = async () => {
  console.log("dong bo du lieu");
  const kids = await updateKid();
  const { NGAY_SINH } = readContact();
  await kids
    .filter(k => k.LichSuTiemId == "0")
    .forEach(k => {
      createdRowObj(
        k.VacxinId,
        getDateString(k.NgayTiem),
        k.ThuTuMuiTiem,
        k.id,
        k.completed,
        false
      );
    });
  const keys = kids.map(v => "" + v.ThuTuMuiTiem + v.VacxinId);
  // await updateTasks(kids.map(k => k.LichSuTiemId));
  for (const k of [...mapVaccines.values()].sort(
    (a, b) => a.soNgays - b.soNgays
  )) {
    const soNgays = Math.floor(
      (new Date().getTime() - new Date(NGAY_SINH).getTime()) / 86400000
    );
    if (
      k.LichSuTiemId === "0" &&
      !keys.includes("" + k.thuTuMuiTiem + k.VACXIN_ID) &&
      soNgays - k.soNgays > -46 &&
      soNgays - k.soNgays < 30
    ) {
      createdRowObj(
        k.VACXIN_ID,
        getDateString(k.NgayTiem),
        k.thuTuMuiTiem,
        k.id,
        k.completed,
        k.isNew
      );
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const updateKid = async () => {
  const myKid = await $.ajax({
    url: "https://app.tiemchunggiongvina.com/api/update-kids-pw142",
    type: "POST",
    async: true,
    data: readContact()
  });
  return myKid;
};

const muiTiems = () => {
  return $("#tblVacxin")
    .find("tr")
    .toArray()
    .map(i => i.attributes && i.attributes.length && i.attributes[0].value)
    .filter(i => i)
    .map(i => i.match(/\d+/g)[0]);
};

const updateTask = async data => {
  if (DsVacxin == null) {
    ImCache.GetDsVacxinFromCache(function(dsVacxinCached) {
      DsVacxin = dsVacxinCached;
    });
  }
  const { TEN_VACXIN, TEN_THUONG_MAI, KHANG_NGUYEN } = DsVacxin.find(
    v => v.VACXIN_ID == data.VacxinId
  );
  const task = await $.ajax({
    url: "https://app.tiemchunggiongvina.com/api/update-tasks-pw142",
    type: "POST",
    async: true,
    data: { ...data, TEN_VACXIN, TEN_THUONG_MAI, KHANG_NGUYEN }
  });
  return task;
};

const updateTasks = async ids => {
  const muiTiemIds = muiTiems().filter(m => !ids.includes(m));
  for (let index2 = 0; index2 < muiTiemIds.length; index2++) {
    try {
      let chiTietMuiTien = await $.ajax({
        url: "/TiemChung/DoiTuong/SuaMuiTiem",
        type: "GET",
        data: { lichSuTiemId: muiTiemIds[index2] }
      });
      $("#readMuiTiemTam").html($(chiTietMuiTien));
    } catch (e) {
      console.log(e);
    }

    try {
      const ngayTiem = getDateToSubmit(
        TiemChung$DoiTuong$SuaMuiTiemModel.NgayTiem
      );
      let ThuTuMuiTiem = $(
        `[ondblclick='ShowDialogSuaMuiTiem(${muiTiemIds[index2]})']`
      )
        .children()
        .eq(2)
        .text();
      const dataToSubmit = {
        ...TiemChung$DoiTuong$SuaMuiTiemModel,
        ThuTuMuiTiem,
        NgayTiem: ngayTiem
      };
      await updateTask(dataToSubmit);

      // console.log(muiTiemToSubmit);
    } catch (error) {
      console.log(error);
    }
    await sleep(1000);
  }
};

const readDiaChi = () => {
  const diaChi = [];

  const txtDiaChiChiTiet = $("#txtDiaChiChiTiet").val();
  if (txtDiaChiChiTiet) diaChi.push(txtDiaChiChiTiet);

  const slThonApDetail = $("#slThonApDetail option:selected").text();
  if (slThonApDetail) diaChi.push(slThonApDetail);

  const slXaDetail = $("#slXaDetail option:selected").text();
  if (slXaDetail) diaChi.push(slXaDetail);

  const slHuyenDetail = $("#slHuyenDetail option:selected").text();
  if (slHuyenDetail) diaChi.push(slHuyenDetail);

  const slTinhDetail = $("#slTinhDetail option:selected").text();
  if (slTinhDetail) diaChi.push(slTinhDetail);

  return diaChi.join(", ");
};

const readContact = () => {
  const DOI_TUONG_2_ID = $("#hfDoiTuongId_Detail").val();
  const HO_TEN = $("#txtHoTen").val();
  const MA_DOI_TUONG = $("#txtMaDoiTuong").val();
  const NGAY_SINH = CommonJS.ckFormatDate(
    $("#txtNgaySinh")
      .val()
      .trim()
  )
    .toISOString()
    .slice(0, 10);
  const GIOI_TINH = $("#slGioiTinh_Detail option:selected").val();
  const SO_DIEN_THOAI = $("#txtDienThoai").val();
  const NGUOI_CHAM_SOC = $("#slNguoiChamSoc_Detail option:selected").val();

  const TEN_ME = $("#txtTenMe_ThemMoi").val();
  const DIEN_THOAI_ME = $("#txtDienThoaiMe_ThemMoi").val();

  const TEN_BO = $("#txtTenBo_ThemMoi").val();
  const DIEN_THOAI_BO = $("#txtDienThoaiBo_ThemMoi").val();

  const TEN_NGUOI_BAO_HO = $("#lblTenNguoiGiamHo_ThemMoi").val();
  const DIEN_THOAI_NGUOI_BAO_HO = $("#txtDienThoaiNguoiGiamHo_ThemMoi").val();

  const DIA_CHI = readDiaChi();

  return {
    DOI_TUONG_2_ID,
    HO_TEN,
    MA_DOI_TUONG,
    NGAY_SINH,
    GIOI_TINH,
    SO_DIEN_THOAI,
    DIA_CHI,
    TEN_ME,
    DIEN_THOAI_ME,
    TEN_BO,
    DIEN_THOAI_BO,
    TEN_NGUOI_BAO_HO,
    DIEN_THOAI_NGUOI_BAO_HO,
    NGUOI_CHAM_SOC
  };
};

const getDateToSubmit = dateString => {
  const dateParts = dateString.split("/");

  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
};

const getDateString = dateString => {
  const dateParts = dateString.slice(0, 10).split("-");
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
};

const createdRowObj = (
  vaccinId,
  ngayHen,
  thuTuMuiTiem = "",
  id = "",
  isCompleted = "0",
  isMap = true
) => {
  let disabled = "",
    readonly = "",
    display = "",
    displayDel = "";
  if (!isMap) {
    readonly = "readonly";
    disabled = "disabled";
    display = "display: none;";
  }
  if (!id || isCompleted === "1" || isMap) {
    displayDel = "display: none;";
  }
  var rowHtml =
    '<tr> \
                            <td><input name="taskId" type="hidden" value="' +
    id +
    '"></td> \
                            <td><select class="vacxin" name="Vacxin" id="qaVacxin"  ' +
    disabled +
    '><option selected="selected">- ' +
    GlobalResources.DT_CHON_VAC_XIN +
    ' -</option></select><span name="KhangNguyen" class="sublabel"></span></td> \
                            <td id="ThuTuMuiTiem"> <input type="number" name="ThuTuMui" id="ThuTuMuiTiem"' +
    disabled +
    ' /></td>\
                            <td colspan="2"><div class="input-group input-group-sm" style="width: 100%"> \
                                    <input name="NgayTiem" type="text" class="form-control date-picker" placeholder="' +
    GlobalResources.DT_NGAY_THANG_NAM +
    '" value="" id="qaNgayTiem" autocomplete="off" ' +
    readonly +
    '> \
                                    <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span> \
                                </div> \
                            </td> \
                            <td style="text-align: left;"> \
                                <a href="#" class="fa-hover mr10" style="' +
    display +
    ' title="' +
    GlobalResources.DT_LUU_MUI_TIEM +
    '" data-toggle="tooltip" onclick="LuuMuiTiemHen(this)"> \
                                    <i class="fa fa-save color-primary"></i> \
                                </a> \
                                <a href="#" class="fa-hover mr10" style="' +
    display +
    ' title="' +
    GlobalResources.DT_HUY +
    '" data-toggle="tooltip" onclick="HuyThemMuiTiem(this)"> \
                                    <i class="fa fa-reply color-primary"></i> \
                                </a> \
                                <a href="#" class="fa-hover mr10" style="' +
    displayDel +
    '" title="' +
    GlobalResources.DT_XOA +
    '" data-toggle="tooltip" onclick="XoaMuiTiemHen(this)"> \
                                    <i class="fa fa-trash color-primary"></i> \
                                </a> \
                       </tr>';

  const rowObj = $(rowHtml);
  $("#tblVacxin > tbody").prepend(rowObj);
  const colTrangThai = rowObj.find("select[name='TrangThai']").first();
  const labelKhangNguyen = rowObj.find("span[name='KhangNguyen']").first();
  const colCoSo = rowObj.find("select[name='CoSo']").first();
  const colVacxin = rowObj.find("select[name='Vacxin']").first();
  const colNgayTiem = rowObj.find("input[name='NgayTiem']").first();
  const colThuTuMuiTiem = rowObj.find("input[name='ThuTuMui']").first();
  jQuery.datetimepicker.setLocale(GlobalResources.DATE_TIME_PICKER_LANGUAGE);
  $(colNgayTiem).datetimepicker({
    format: "d/m/Y",
    step: 1,
    i18n: {
      vi: {
        months: [
          GlobalResources.THANG_MOT,
          GlobalResources.THANG_HAI,
          GlobalResources.THANG_BA,
          GlobalResources.THANG_TU,
          GlobalResources.THANG_NAM,
          GlobalResources.THANG_SAU,
          GlobalResources.THANG_BAY,
          GlobalResources.THANG_TAM,
          GlobalResources.THANG_CHIN,
          GlobalResources.THANG_MUOI,
          GlobalResources.THANG_MUOI_MOT,
          GlobalResources.THANG_MUOI_HAI
        ],
        dayOfWeek: [
          GlobalResources.CHU_NHAT,
          GlobalResources.THU_HAI,
          GlobalResources.THU_BA,
          GlobalResources.THU_TU,
          GlobalResources.THU_NAM,
          GlobalResources.THU_SAU,
          GlobalResources.THU_BAY
        ]
      }
    },
    mask: "99/99/9999",
    timepicker: false
  });
  $(colNgayTiem).mask("99/99/9999");

  $(colVacxin).select2({
    placeholder: GlobalResources.DT_CHON_VAC_XIN,
    allowClear: true,
    width: "100%"
  });
  if (DsVacxin == null) {
    ImCache.GetDsVacxinFromCache(function(dsVacxinCached) {
      DsVacxin = dsVacxinCached;
      KhoiTaoHopChonVacxin();
    });
  } else {
    KhoiTaoHopChonVacxin();
  }
  function KhoiTaoHopChonVacxin() {
    var dsVacxinMoRong = DsVacxin.filter(function(vacxin) {
      return vacxin.TCMR == 1;
    }).sort(function(a, b) {
      return a.VACXIN_ID - b.VACXIN_ID;
    });

    var dsVacxinDichVu = DsVacxin.filter(function(vacxin) {
      return vacxin.TCMR == 2;
    });

    var optGroupMoRong = $(
      "<optgroup label='" + GlobalResources.DT_VAC_XIN_MO_RONG + "'></optgroup>"
    );
    $.each(dsVacxinMoRong, function(index, item) {
      var option = $("<option />");
      $(option).val(item.VACXIN_ID);
      $(option).text(item.TEN_VACXIN);

      optGroupMoRong.append(option);
    });

    var optGroupDichVu = $(
      "<optgroup label='" + GlobalResources.DT_VAC_XIN_DICH_VU + "'></optgroup>"
    );
    $.each(dsVacxinDichVu, function(index, item) {
      var option = $("<option />");
      $(option).val(item.VACXIN_ID);
      $(option).text(item.TEN_VACXIN);

      optGroupDichVu.append(option);
    });

    $(colVacxin).append(optGroupMoRong);
    $(colVacxin).append(optGroupDichVu);
    $(colVacxin).select2({
      placeholder: GlobalResources.DT_CHON_VAC_XIN,
      allowClear: true,
      width: "100%"
    });

    $(colVacxin).on("change", function() {
      // load danh sach khang nguyen tuong ung
      $.ajax({
        url: "/Vacxin/DanhSachTenKhangNguyen",
        type: "GET",
        dataType: "json",
        data: { vacxinId: $(colVacxin).select2("val") },
        success: function(resp) {
          if (resp == "Uốn ván" && $("#hfLoaiDoiTuong_Detail").val() == 2) {
            $("#SoMuiUV_ThemNhanh").show();
          } else {
            $("#SoMuiUV_ThemNhanh").hide();
            $("#SoMuiUV_ThemNhanh").val("");
          }

          $(labelKhangNguyen).text(resp);

          if ($(colVacxin).select2("val") == 4) {
            // opv -> da uong
            $(colTrangThai)
              .find("option:first-child")
              .text(GlobalResources.DT_DA_UONG);
          } else {
            $(colTrangThai)
              .find("option:first-child")
              .text(GlobalResources.KHT_DA_TIEM);
          }
          $(colTrangThai).select2({
            width: "100%"
          });
        }
      });
      if (!disabled && !thuTuMuiTiem)
        $.ajax({
          type: "POST",
          url: "/KeHoachTiemPhatSinhArea/KhamSangLoc/LoadThuTuMuiTiem",
          data: {
            VacXinID: colVacxin.val(),
            DoiTuongID: $("#hfDoiTuongId_Detail").val()
          },
          cache: false,
          success: function(data) {
            colThuTuMuiTiem.val(data);
            const key = "" + data + colVacxin.val();
            console.log(key);
            if (mapVaccines.has(key))
              colNgayTiem.val(getDateString(mapVaccines.get(key).NgayTiem));
          }
        });
    });
  }

  if (vaccinId) colVacxin.val(vaccinId).change();
  if (ngayHen) colNgayTiem.val(ngayHen);
  colThuTuMuiTiem.val(thuTuMuiTiem);
  return { rowObj, colVacxin, colNgayTiem, colThuTuMuiTiem };
};

function XemThongTinDoiTuong(doi_tuong_id, isShow = true) {
  $("#preloader1").show();
  $.ajax({
    type: "POST",
    url: "/KeHoachTiemPhatSinhArea/KeHoachTiemPhatSinh/XemThongTinDoiTuong",
    data: {
      DOI_TUONG_ID: doi_tuong_id
    },
    cache: false,
    dataType: "html",
    success: function(data) {
      $("#ModalThongTinDoiTuong").modal({
        show: isShow,
        backdrop: "static",
        keyboard: false
      });
      $("#ModalThongTinDoiTuong").html(data);

      khoiTaoLichHenMuiTiem();

      $("#preloader1").hide();
    },
    error: function(e) {
      CommonJS.showDangerMessage(GlobalResources.ERR_CO_LOI_XAY_RA);
      $("#preloader1").hide();
    },
    complete: function(e) {
      $("#preloader1").hide();
    }
  });
}

function OnShowDetail(doiTuongId) {
  // xoa style cua doi tuong dang xem chi tiet
  $("#doiTuongSearchResult")
    .find(".active-row")
    .removeClass("active-row");

  // them style cho doi tuong moi
  $("#doiTuongSearchResult")
    .find("[data-id='" + doiTuongId + "']")
    .addClass("active-row");

  var doiTuongDetail = $("#doiTuongDetail");

  Common.UI.BlockElement("#detailPanel");

  $.ajax({
    url: "/TiemChung/DoiTuong/Detail",
    type: "GET",
    async: true,
    data: { doiTuongId: doiTuongId },
    success: function(response) {
      doiTuongDetail.empty();
      doiTuongDetail.html(response);

      khoiTaoLichHenMuiTiem();
      getMapVaccines();

      if (
        TiemChung$DoiTuong$Detail$DoiTuongModel != null &&
        TiemChung$DoiTuong$Detail$DoiTuongModel.IS_ACTIVE == 1
      )
        ShowActionButtonForDetailDoiTuongGop();
      else ShowActionButtonForDetail();
    },
    error: function(e) {
      doiTuongDetail.empty();

      // show error notification
      var errorMessageElement = $("<div />");
      errorMessageElement.attr("style", "margin:10px; text-align:center;");
      errorMessageElement.addClass("has-error");
      errorMessageElement.text(GlobalResources.ERR_CO_LOI_XAY_RA);
      doiTuongDetail.append(errorMessageElement);

      ShowActionButtonDefault();
    },
    complete: function(xhr, status) {
      Common.UI.UnBlockElement("#detailPanel");
    }
  });
}

function drawTable(DanhSachHenTiemObjectArray, checkDisable, checkVaiTroID) {
  if (
    DanhSachHenTiemObjectArray == null ||
    DanhSachHenTiemObjectArray.length == 0
  ) {
    return;
  }
  var thoiGianTiem = $("#BUOI_TIEM_SEARCH_BOX").val();
  var str = "";
  $.each(DanhSachHenTiemObjectArray, function(i, type) {
    str +=
      "<tr DoiTuongID=" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      " ondblclick=LoadQuyTrinhTiemChung(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      "," +
      DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_ID +
      "," +
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID +
      ");>";
    str +=
      "<td style='text-align:center'>" +
      (eval(i) +
        eval(1) +
        DanhSachHenTiemObjectArray.length * (PageFilterNumber - 1)) +
      "</td>";
    str +=
      "<td><label title='" +
      DanhSachHenTiemObjectArray[i].MA_DOI_TUONG +
      "'>" +
      DanhSachHenTiemObjectArray[i].MA_DOI_TUONG +
      "</label>";
    str += "<br>";
    if (checkVaiTroID == 4) {
      if (DanhSachHenTiemObjectArray[i].LOAI_DOI_TUONG == 2) {
        str +=
          "<i onmouseover='showTooltip(this, \"" +
          GlobalResources.KHT_DOI_TUONG_NHAP_BO_SUNG +
          "\")' onmouseout='hideTooltip(this)' class='fa fa-puzzle-piece mr10 color-primary tooltips' aria-hidden='true'  data-placement='top' data-toggle='tooltip' data-container='body'></i>";
      }
      if (DanhSachHenTiemObjectArray[i].VANG_LAI == 1) {
        str +=
          "<i onmouseover='showTooltip(this, \"" +
          GlobalResources.KHT_DOI_TUONG_VANG_LAI +
          "\")' onmouseout='hideTooltip(this)' class='fa fa-yelp mr10 color-warning tooltips' aria-hidden='true'  data-placement='top' data-toggle='tooltip' data-container='body'></i>";
      }
    }
    str += "</td>";
    str +=
      "<td><label title='" +
      encode(DanhSachHenTiemObjectArray[i].HO_TEN) +
      "'>" +
      encode(DanhSachHenTiemObjectArray[i].HO_TEN) +
      "</label></td>";
    str +=
      "<td style='text-align:center'><label title='" +
      DanhSachHenTiemObjectArray[i].NGAY_SINH_STR +
      "'>" +
      DanhSachHenTiemObjectArray[i].NGAY_SINH_STR +
      "</label></td>";
    str +=
      "<td><label title='" +
      encode(DanhSachHenTiemObjectArray[i].TEN_ME) +
      "'>" +
      encode(DanhSachHenTiemObjectArray[i].TEN_ME) +
      "</label></td>";
    str +=
      "<td ><label title='" +
      encode(DanhSachHenTiemObjectArray[i].DIEN_THOAI) +
      "'>" +
      encode(DanhSachHenTiemObjectArray[i].DIEN_THOAI) +
      "</label></td>";
    str +=
      "<td><label title='" +
      encode(DanhSachHenTiemObjectArray[i].DIA_CHI) +
      "'>" +
      encode(DanhSachHenTiemObjectArray[i].DIA_CHI) +
      "</label></td>";
    str +=
      "<td><label>" + DanhSachHenTiemObjectArray[i].MUI_TIEM + "</label></td>";
    //str += "<td style='width:13%'>" + DanhSachHenTiemObjectArray[i].TRANG_THAI + "</td>";
    if (DanhSachHenTiemObjectArray[i].TRANG_THAI_ID == 0) {
      str +=
        "<td  ><label><span class='label color-chuabatdau'>0. " +
        GlobalResources.KHT_CHUA_BAT_DAU +
        "</span></label></td>";
    } else if (DanhSachHenTiemObjectArray[i].TRANG_THAI_ID == 1) {
      str +=
        "<td  ><label><span class='label color-tiepdon'>1. " +
        GlobalResources.KHT_TIEP_DON +
        "</span></label></td>";
    } else if (DanhSachHenTiemObjectArray[i].TRANG_THAI_ID == 2) {
      str +=
        "<td  ><label><span class='label color-sangloc'>2. " +
        GlobalResources.KHT_SANG_LOC +
        "</span></label></td>";
    } else if (DanhSachHenTiemObjectArray[i].TRANG_THAI_ID == 3) {
      str +=
        "<td  ><label><span class='label color-thuchientiem'>3. " +
        GlobalResources.KHT_THUC_HIEN_TIEM +
        "</span></label></td>";
    } else if (DanhSachHenTiemObjectArray[i].TRANG_THAI_ID == 4) {
      str +=
        "<td  ><label><span class='label color-theodoisautiem'>4. " +
        GlobalResources.KHT_THEO_DOI_SAU_TIEM +
        "</span></label></td>";
    }
    str += "<td style='text-align: center;'>";
    str += "<div class='btn-group'>";
    str +=
      "<a data-toggle='dropdown' class='dropdown-toggle'><i class='fa fa-cog' style='color: #438CCA'></i></a>";
    str += "<ul role='menu' class='dropdown-menu pull-right'>";
    str +=
      "<li><a href='javascript:void(0)' onclick=XemThongTinDoiTuong(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      ")>" +
      GlobalResources.KHT_XEM_THONG_TIN_DOI_TUONG +
      "</a></li>";
    str +=
      "<li><a href='javascript:void(0)' onclick=LoadQuyTrinhTiemChung(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      "," +
      DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_ID +
      "," +
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID +
      ")>" +
      GlobalResources.KHT_XEM_THONG_TIN_4_BUOC +
      "</a></li>";
    if (
      DanhSachHenTiemObjectArray[i].LOAI_KE_HOACH_TIEM != 3 &&
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID != 3 &&
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID != 4 &&
      checkDisable == 0 &&
      checkVaiTroID == 4
    ) {
      str +=
        "<li><a href='javascript:void(0)' onclick=ShowModalChuyenLichTiem(" +
        DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
        "," +
        DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_CHI_TIET_ID +
        "," +
        DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_ID +
        ",this" +
        ")>" +
        GlobalResources.KHT_CHUYEN_LICH_TIEM +
        "</a></li>";
    }
    if (
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID != 3 &&
      DanhSachHenTiemObjectArray[i].TRANG_THAI_ID != 4 &&
      checkDisable == 0 &&
      (checkVaiTroID == 4 || checkVaiTroID == 5 || checkVaiTroID == 7)
    ) {
      str +=
        "<li><a href='javascript:void(0)' onclick=ShowPopupDeleteDoiTuong(" +
        DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_CHI_TIET_ID +
        "," +
        DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
        "," +
        thoiGianTiem +
        "," +
        DanhSachHenTiemObjectArray[i].KE_HOACH_TIEM_ID +
        ",this" +
        ")>" +
        GlobalResources.KHT_XOA_DOI_TUONG_KHOI_KE_HOACH_TIEM +
        "</a></li>";
    }
    str +=
      "<li><a href='javascript:void(0)' onclick=InPhieuKhamNgoai(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      ")>" +
      GlobalResources.KHT_IN_PHIEU_KHAM +
      "</a></li>";
    str +=
      "<li><a href='javascript:void(0)' onclick=InPhieuKhamGVC(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      ")>" +
      GlobalResources.KHT_IN_PHIEU_KHAM +
      " GVC </a></li>";
    str +=
      "<li><a href='javascript:void(0)' onclick=InMaVach(" +
      DanhSachHenTiemObjectArray[i].MA_DOI_TUONG +
      "," +
      "'" +
      encode(DanhSachHenTiemObjectArray[i].HO_TEN) +
      "'" +
      ")>" +
      GlobalResources.KHT_IN_MA_VACH +
      "</a></li>";
    str +=
      "<li><a href='javascript:void(0)' onclick=ShowConfirmXoaKetQuaTiemPhatsinh(" +
      DanhSachHenTiemObjectArray[i].DOI_TUONG_ID +
      ")>" +
      GlobalResources.KHT_XOA_KET_QUA_TIEM +
      "</a></li>";
    str += "</ul</div>";
    str += "</td>";
    str +=
      "<td style='display:none'>" +
      encode(DanhSachHenTiemObjectArray[i].HO_TEN_EN) +
      "</td>";
    str +=
      "<td style='display:none'>" +
      encode(DanhSachHenTiemObjectArray[i].TEN_ME_EN) +
      "</td>";
    str += "</tr>";
  });
  return str;
}

ViewDS_HenTiem();

async function InPhieuKhamGVC(doi_tuong_id) {
  Common.UI.BlockElement('body')
  await XemThongTinDoiTuong(doi_tuong_id, false);
  await sleep(2000);
  Common.UI.UnBlockElement('body')
  const { TenCoSoGiong } = coSo();
  const baseUrl = `https://app.tiemchunggiongvina.com/kids-pw142/${doi_tuong_id}/pdf?TenCoSo=${TenCoSoGiong}`;
  bootbox.dialog({
    title: GlobalResources.KHT_IN_PHIEU_KHAM,
    message:
      '<div class="row mt5"><iframe id="frmPrintPreview" src="' +
      baseUrl +
      '" height="500" width="100%" border="0"></iframe></div>',
    size: "large"
  });
}
