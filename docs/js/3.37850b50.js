(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"10d0":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t._self._c;return e("q-page",{},[e("q-banner",{staticClass:"list-header text-white text-center",class:"bg-orange-4",attrs:{"inline-actions":""}},[e("div",{staticClass:"inline bg-orange-4 rounded-borders cursor-pointer"},[e("div",{staticClass:"fit flex flex-center text-center non-selectable q-pa-md"},[t._v("\n        Tra cứu "+t._s(t.bhyts.length)+"!"),e("br"),t._v("(Bấm vào đây và lựa chọn)\n      ")]),e("q-menu",{attrs:{"touch-position":""}},[e("q-list",{staticStyle:{"min-width":"100px"}},[e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(e){return t.loadBhyts({thang:1})}}},[e("q-item-section",[t._v("Tái tục 1 tháng")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(e){return t.loadBhyts({thang:2})}}},[e("q-item-section",[t._v("Tái tục 2 tháng")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsHetHan}},[e("q-item-section",[t._v("Đã hết hạn")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsDisable}},[e("q-item-section",[t._v("Đã liên hệ")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsCompleted}},[e("q-item-section",[t._v("Đánh dấu sao")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadHoSoChuaXuLy}},[e("q-item-section",[t._v("Hồ sơ chưa xử lý")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadHoSoDaXuLy}},[e("q-item-section",[t._v("Hồ sơ đã xử lý")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsTaiTuc2020}},[e("q-item-section",[t._v("Tải dữ liệu tái tục mới nhất")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsTaiTuc2021}},[e("q-item-section",[t._v("Tải dữ liệu tái tục 2021 từ SSM")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.loadBhytsTaiTuc2022}},[e("q-item-section",[t._v("Tải dữ liệu tái tục 2022 từ SSM")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.copyMaSoBhxhToClipboard}},[e("q-item-section",[t._v("Copy tất cả mã số BHXH")])],1),e("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:t.copySoDienThoaiToClipboard}},[e("q-item-section",[t._v("Copy tất cả số điện thoại")])],1)],1)],1)],1)]),e("div",{staticClass:"q-gutter-y-md column"},[e("q-input",{attrs:{outlined:"",dense:""},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.timKiem(t.searchText)}},scopedSlots:t._u([{key:"append",fn:function(){return[""!==t.searchText?e("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(e){t.searchText=""}}}):t._e(),e("q-icon",{attrs:{name:"search"}})]},proxy:!0}]),model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}})],1),t._l(t.bhyts,(function(t){return e("q-list",{key:t.id},[e("ThongTinTheBHYT",{attrs:{bhyt:t}}),e("q-separator",{attrs:{spaced:"",inset:""}})],1)}))],2)},n=[],o=a("2f62"),s=a("e395"),h=a("f508"),c=a("d9b2"),r=a("2a19"),l={components:{ThongTinTheBHYT:s["a"]},data(){return{searchText:"",key:""}},computed:{...Object(o["c"])("bhyts",["bhyts"]),...Object(o["d"])("store",["userDetails"])},methods:{...Object(o["b"])("bhyts",["getBhyts","traCuuBhyts","updateBhyt","resetBhyt"]),sleep(t){return new Promise((e=>setTimeout(e,t)))},async getAuth(){this.key||(this.key=await this.fetchUserGhiChu())},async fetchAPIByName(t){this.key||await this.getAuth();const e={"Content-Type":"application/json",Authorization:`Bearer ${this.key}`},{maXa:a="08986"}=this.userDetails,i=`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=${a}&hoTen=${t}&isCoDau=true&`,n=await fetch(i,{method:"GET",headers:e}),o=await n.json();if(o.errors)throw console.error(o.errors),new Error("Failed to fetch API");return o.result.value},async fetchAPIByMaSoBhxh(t){this.key||await this.getAuth();const e={"Content-Type":"application/json",Authorization:`Bearer ${this.key}`},a=`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${t.slice(t.length-10)}`,i=await fetch(a,{method:"GET",headers:e}),n=await i.json();if(n.errors)throw console.error(n.errors),new Error("Failed to fetch API");return n.result},async fetchAPIHoSoDaXuLy(){const t=parseInt(this.searchText);let e=0;t&&(e=t),this.key||await this.getAuth();const a={"Content-Type":"application/json",Authorization:`Bearer ${this.key}`},i="https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup",n=new Date,o=n.getFullYear(),s=n.getMonth(),h=await fetch(i,{method:"POST",headers:a,body:JSON.stringify({dateForm:"ngayLap",denNgay:new Date(o,s-e+2,1).toISOString(),filterItems:[],hoSoChuaThuTien:!1,hoSoQuaHan:0,keyMenu:"1",mangLuoiId:this.userDetails.mangLuoiId,maxResultCount:5e3,skipCount:0,tuNgay:new Date(o,s-e,1).toISOString()})}),c=await h.json();if(c.errors)throw console.error(c.errors),new Error("Failed to fetch API");return c.result},async fetchAPIHoSoChuaXuLy(){this.key||await this.getAuth();const t={"Content-Type":"application/json",Authorization:`Bearer ${this.key}`},e="https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup",a=new Date,i=a.getFullYear(),n=a.getMonth(),o=await fetch(e,{method:"POST",headers:t,body:JSON.stringify({dateForm:"ngayLap",denNgay:new Date(i,n+2,1).toISOString(),filterItems:[],hoSoChuaThuTien:!1,hoSoQuaHan:0,keyMenu:"2",mangLuoiId:this.userDetails.mangLuoiId,maxResultCount:5e3,skipCount:0,tuNgay:new Date(i,n,1).toISOString()})}),s=await o.json();if(s.errors)throw console.error(s.errors),new Error("Failed to fetch API");return s.result},async fetchAPITaiTucBHYT({denThang:t,tuThang:e}){this.key||await this.getAuth();const a={"Content-Type":"application/json",Authorization:`Bearer ${this.key}`},i="https://ssm-api.vnpost.vn/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",n=await fetch(i,{method:"POST",headers:a,body:JSON.stringify({denThang:t,filterItems:[],loaiDichVu:parseInt(this.searchText),mangLuoiId:parseInt(this.userDetails.mangLuoiId),maxResultCount:5e3,skipCount:0,tuThang:e,type:-1})}),o=await n.json();if(o.errors)throw console.error(o.errors),new Error("Failed to fetch API");return o.result},async saveBHYT(t){const e={"Content-Type":"application/json"},a="https://cms.buudienhuyenmelinh.vn/api/user-ghi-chu",i=await fetch(a,{method:"PUT",headers:e,body:JSON.stringify({ghiChu:t})}),n=await i.text();return n},async fetchUserGhiChu(){const t={"Content-Type":"application/json"},e="https://cms.buudienhuyenmelinh.vn/api/user-ghi-chu",a=await fetch(e,{method:"GET",headers:t}),i=await a.text();return i},async save(t){const e={"Content-Type":"application/json"},a="https://cms.buudienhuyenmelinh.vn/api/bhyts",i=await fetch(a,{method:"POST",headers:e,body:JSON.stringify(t)}),n=await i.json();if(n.errors)throw console.error(n.errors),new Error("Failed to fetch API");return n},async dongBoDanhSach(t){this.$q.dialog({title:"Confirm",message:`Bạn có muốn đồng bộ ${t.length} thẻ BHYT?`,ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((async()=>{h["a"].show({spinner:c["a"],spinnerSize:"100px"}),this.resetBhyt([]);for(let e=0;e<t.length;e++){const{maSoBhxh:a}=t[e],i=this.bhyts.find((t=>t.maSoBhxh===a));i||await this.dongBo(t[e]),await this.sleep(300)}h["a"].hide()}))},async dongBo(t){try{const{maSoBhxh:e}=t,{thongTinTK1:a,thongTinTheHGD:i,trangThaiThe:n}=await this.fetchAPIByMaSoBhxh(e),o=await this.save({...t,...i,...a,...n});this.updateBhyt(o)}catch(e){console.log(e)}},async loadBhytsTaiTuc2020(){const t=new Date,e=t.getFullYear(),a=t.getMonth(),{items:i}=await this.fetchAPITaiTucBHYT({denThang:new Date(e,a+2,1).toISOString(),tuThang:new Date(e,a,1).toISOString()});this.resetBhyt(i);const n=i.map((t=>({maSoBhxh:t.maSoBHXH})));await this.dongBoDanhSach(n)},async loadBhytsTaiTuc2021(){const{items:t}=await this.fetchAPITaiTucBHYT({denThang:"2022-01-01 00:00:00",tuThang:"2021-01-01 00:00:00"});this.resetBhyt(t);const e=t.map((t=>({maSoBhxh:t.maSoBHXH})));await this.dongBoDanhSach(e)},async loadHoSoDaXuLy(){const{items:t}=await this.fetchAPIHoSoDaXuLy();this.resetBhyt(t);const e=t.map((t=>({...t,userName:t.userName,ngayLap:t.ngayLap,tongTien:t.tongTien,completed:9!==t.trangThaiHoSo,disabled:9!==t.trangThaiHoSo})));await this.dongBoDanhSach(e)},async loadHoSoChuaXuLy(){const{items:t}=await this.fetchAPIHoSoChuaXuLy();this.resetBhyt(t);const e=t.map((t=>({...t,userName:t.userName,ngayLap:t.ngayLap,tongTien:t.tongTien,completed:1,disabled:1})));await this.dongBoDanhSach(e)},async loadBhytsTaiTuc2022(){const{items:t}=await this.fetchAPITaiTucBHYT({denThang:"2023-01-01 00:00:00",tuThang:"2022-01-01 00:00:00"});this.resetBhyt(t);const e=t.map((t=>({maSoBhxh:t.maSoBHXH})));await this.dongBoDanhSach(e)},loadBhyts({thang:t=1}){this.getBhyts({thang:t,completed:"0",disabled:"0",taiTuc:"1",maXa:this.userDetails.maXa,name:this.searchText})},loadBhytsHetHan(){this.getBhyts({maXa:this.userDetails.maXa,completed:"0",disabled:"0",hetHan:"1",name:this.searchText})},loadBhytsDisable(){this.getBhyts({maXa:this.userDetails.maXa,disabled:1})},loadBhytsCompleted(){this.getBhyts({maXa:this.userDetails.maXa,completed:1,disabled:"0"})},async timKiem(t){this.traCuuBhyts({searchText:t,maXa:this.userDetails.maXa});const e=t.split(","),a=/[0-9]/g;for(let n=0;n<e.length;n++){const t=e[n].split(" ").map((t=>t.charAt(0).toUpperCase()+t.slice(1))).join(" "),o=t.match(a);if(o)await this.dongBo({maSoBhxh:o.join("")}),await this.sleep(500);else try{const e=await this.fetchAPIByName(t);for(let t=0;t<e.length;t++)await this.dongBo(e[t]),await this.sleep(300)}catch(i){console.log(i)}}},async khoiTao(){this.$route.query.key&&(this.key=await this.saveBHYT(this.$route.query.key)),await this.getAuth()},copyMaSoBhxhToClipboard(){navigator.clipboard.writeText(this.bhyts.map((t=>t.maSoBhxh))).then((function(){r["a"].create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){r["a"].create({type:"negative",message:"Không thực hiện được!"+t})}))},copySoDienThoaiToClipboard(){navigator.clipboard.writeText(this.bhyts.map((t=>t.soDienThoai))).then((function(){r["a"].create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){r["a"].create({type:"negative",message:"Không thực hiện được!"+t})}))}},async mounted(){this.khoiTao()}},p=l,u=(a("5254"),a("2877")),m=a("9989"),y=a("54e1"),g=a("4e73"),d=a("1c1c"),T=a("66e5"),b=a("4074"),B=a("27f9"),v=a("0016"),f=a("eb85"),w=a("7f67"),S=a("eebe"),k=a.n(S),D=Object(u["a"])(p,i,n,!1,null,null,null);e["default"]=D.exports;k()(D,"components",{QPage:m["a"],QBanner:y["a"],QMenu:g["a"],QList:d["a"],QItem:T["a"],QItemSection:b["a"],QInput:B["a"],QIcon:v["a"],QSeparator:f["a"]}),k()(D,"directives",{ClosePopup:w["a"]})},"51b8":function(t,e,a){},5254:function(t,e,a){"use strict";a("51b8")},e395:function(t,e,a){"use strict";var i=function(){var t=this,e=t._self._c;return e("q-item",{class:{"bg-warning":t.bhyt.coTheUuTienCaoHon,"bg-warning":"1"===t.bhyt.coTheUuTienCaoHon,"bg-positive":t.getDateDiff(t.bhyt.denNgayDt)>30,"bg-blue-grey-3":t.getDateDiff(t.bhyt.denNgayDt)<1}},[e("q-item-section",[e("q-item-label",[e("q-icon",{class:1==t.bhyt.gioiTinh?"text-pink":"text-primary",attrs:{name:1==t.bhyt.gioiTinh?"female":"male"}}),t._v(t._s(t.bhyt.hoTen||t.bhyt.hoVaTen)+"\n      "+t._s(t.bhyt.ngaySinhDt||t.bhyt.ngayThangNamSinh)+"\n\n      "),e("q-icon",{attrs:{name:1==t.bhyt.disabled?"do_not_disturb_on":"delete_forever",color:1==t.bhyt.disabled?"red":"gray"},on:{click:function(e){return t.xacNhanLoaiBo(t.bhyt)}}})],1),e("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("\n      "+t._s(t.bhyt.diaChiLh)+"\n    ")]),e("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("\n      Mã hộ:"),e("a",{attrs:{target:"_blank",href:`/#/ho-gia-dinh/${t.bhyt.maHoGd}`}},[t._v(t._s(t.bhyt.maHoGd))]),t._v("\n      "+t._s(t.bhyt.mqhChuHo)+"\n    ")]),e("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("\n      Số CMND: "+t._s(t.bhyt.soCmnd)+"\n    ")]),e("q-item-label",{attrs:{caption:"",lines:"2"}},[e("a",{attrs:{target:"_blank",href:`https://www.hotham.vn/tra-thoi-han-bao-hiem-y-te?q=${t.bhyt.soTheBhyt?t.bhyt.soTheBhyt:t.bhyt.maSoBhxh||t.bhyt.maSoBHXH}`}},[t._v(t._s(t.bhyt.soTheBhyt?t.bhyt.soTheBhyt:t.bhyt.maSoBhxh||t.bhyt.maSoBHXH))]),e("q-icon",{staticClass:"q-ml-md",attrs:{name:"content_copy"},on:{click:function(e){return t.copyTextToClipboard(t.bhyt.soTheBhyt?t.bhyt.soTheBhyt:t.bhyt.maSoBhxh||t.bhyt.maSoBHXH)}}}),e("q-icon",{staticClass:"q-ml-md",attrs:{name:"share"},on:{click:function(e){return t.copyUrlToClipboard(t.bhyt)}}})],1),e("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v(t._s(t.bhyt.maKCB))]),e("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("5 năm:"+t._s(t.bhyt.ngay5Nam||t.bhyt.trangThaiHoSoName))]),e("q-item-label",{attrs:{caption:"",lines:"2"}},[e("a",{attrs:{href:`tel:${t.bhyt.soDienThoai}`}},[t._v(t._s(t.bhyt.soDienThoai))])])],1),e("q-item-section",{attrs:{side:"",top:""}},[e("q-item-label",{attrs:{caption:""}},[t._v(t._s(t.getDateDiff(t.bhyt.denNgayDt))+" ngày")]),e("q-item-label",{attrs:{caption:""}},[t._v("Ngày đến hạn:"+t._s(t.bhyt.denNgayDt||t.bhyt.ngayDenHan))]),e("q-item-label",{attrs:{caption:""}},[t._v("Phương thức:"+t._s(t.bhyt.phuongThuc))]),e("q-item-label",{attrs:{caption:""}},[t._v("đ\n      "),e("strong",[t._v(t._s(t.bhyt.tongTien?parseInt(t.bhyt.tongTien).toLocaleString():"")+t._s(t.bhyt.soPhaiDong?parseInt(t.bhyt.soPhaiDong).toLocaleString():""))])]),e("q-icon",{attrs:{name:"star",color:1==t.bhyt.completed?"yellow":"gray"},on:{click:function(e){return t.xacNhanTheoDoi(t.bhyt)}}}),e("q-item-label",{attrs:{caption:""}},[t._v(t._s(t.bhyt.ngayLap||new Date(t.bhyt.updated_at).toLocaleString())),e("br"),t._v("\n      "+t._s(t.bhyt.soBienLai?`Số: ${t.bhyt.soBienLai}`:t.bhyt.ghiChu)),e("br"),t._v("\n      "+t._s(t.bhyt.userName)+"\n    ")])],1)],1)},n=[],o=a("2f62"),s=a("bd4c"),h=a("2a19"),c={props:["bhyt"],methods:{...Object(o["b"])("bhyts",["loaiBo","theoDoi"]),xacNhanLoaiBo(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn loại bỏ?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.loaiBo(t)}))},xacNhanTheoDoi(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn theo dõi?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.theoDoi(t)}))},getDateDiff(t){return t?s["a"].getDateDiff(new Date(t),new Date,"days"):""},copyUrlToClipboard(t){navigator.clipboard.writeText(`Thẻ BHYT mã số ${t.soTheBhyt} của ${t.hoTen} ${this.getDateDiff(t.denNgayDt)<60?"gần hết hạn. Để gia hạn thẻ BHYT hết hạn, bạn chỉ cần đến Đại lý thu bảo hiểm xã hội, bảo hiểm y tế Bưu điện xã Tự Lập gặp chị Hồ Thị Thắm 0978333963 (thay anh Lập đã nghỉ).":"đã được gia hạn. "}. Bấm vào đây để tra cứu thông tin gia hạn và mức đóng https://www.hotham.vn/tra-thoi-han-bao-hiem-y-te/?q=${t.soTheBhyt?t.soTheBhyt:t.maSoBhxh||t.maSoBHXH}`).then((function(){h["a"].create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){h["a"].create({type:"negative",message:"Không thực hiện được!"+t})}))},copyTextToClipboard(t){navigator.clipboard.writeText(t).then((function(){h["a"].create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){h["a"].create({type:"negative",message:"Không thực hiện được!"+t})}))}},filters:{tien:function(t){return t?parseInt(t).toLocaleString():"0đ"}}},r=c,l=a("2877"),p=a("66e5"),u=a("4074"),m=a("0170"),y=a("0016"),g=a("eebe"),d=a.n(g),T=Object(l["a"])(r,i,n,!1,null,null,null);e["a"]=T.exports;d()(T,"components",{QItem:p["a"],QItemSection:u["a"],QItemLabel:m["a"],QIcon:y["a"]})}}]);