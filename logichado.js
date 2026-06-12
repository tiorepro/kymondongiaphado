// KyMonBanHaDo.js - Hà Đồ Kỳ Môn Độn Giáp Engine (ĐÃ FIX LỖI XOAY MÔN/TINH)
// Áp dụng Cửu Cung Hà Đồ: Khôn=ĐN, Tốn=TN, Ly=7, Đoài=9
// Di Cung Bát Thần/Bát Môn/Cửu Tinh xoay vòng chuẩn VONG_QUAY Hà Đồ
// Phương pháp Chuyển bàn, Âm dương nhập khôn

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.HaDoBanKyMon = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // ============================================================
  // 1. HẰNG SỐ CƠ BẢN & NGŨ HÀNH
  // ============================================================
  const THIEN_CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const DIA_CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

  const NGU_HANH_CAN = {
    'Giáp':'Mộc','Ất':'Mộc','Bính':'Hỏa','Đinh':'Hỏa',
    'Mậu':'Thổ','Kỷ':'Thổ','Canh':'Kim','Tân':'Kim',
    'Nhâm':'Thủy','Quý':'Thủy'
  };
  const NGU_HANH_CHI = {
    'Tý':'Thủy','Sửu':'Thổ','Dần':'Mộc','Mão':'Mộc',
    'Thìn':'Thổ','Tỵ':'Hỏa','Ngọ':'Hỏa','Mùi':'Thổ',
    'Thân':'Kim','Dậu':'Kim','Tuất':'Thổ','Hợi':'Thủy'
  };
  const NGU_HANH_SAO = {
    'Thiên Bồng':'Thủy','Thiên Nhuế':'Thổ','Thiên Xung':'Mộc',
    'Thiên Phụ':'Thổ','Thiên Cầm':'Thổ','Thiên Tâm':'Kim',
    'Thiên Trụ':'Kim','Thiên Nhậm':'Thủy','Thiên Anh':'Hỏa'
  };
  const NGU_HANH_MON = {
    'Hưu':'Thủy','Sinh':'Mộc','Thương':'Mộc',
    'Đỗ':'Mộc','Cảnh':'Hỏa','Tử':'Thổ',
    'Kinh':'Kim','Khai':'Kim'
  };

  // ============================================================
  // 2. MAPPING HÀ ĐỒ (YÊU CẦU CỦA BẠN)
  // ============================================================
  const CUNG_META = {
    1: { ten: 'Khảm', huong: 'Bắc',       hanh: 'Thủy' },
    2: { ten: 'Khôn', huong: 'Đông Nam',  hanh: 'Thổ' }, // Khôn đổi sang ĐN
    3: { ten: 'Chấn', huong: 'Đông',      hanh: 'Mộc' },
    4: { ten: 'Tốn',  huong: 'Tây Nam',   hanh: 'Mộc' }, // Tốn đổi sang TN
    5: { ten: 'Trung Cung', huong: 'Trung tâm', hanh: 'Thổ' },
    6: { ten: 'Kiền', huong: 'Tây Bắc',   hanh: 'Kim' },
    7: { ten: 'Ly',   huong: 'Nam',       hanh: 'Hỏa' }, // Đổi số thành 7
    8: { ten: 'Cấn',  huong: 'Đông Bắc',  hanh: 'Thổ' },
    9: { ten: 'Đoài', huong: 'Tây',       hanh: 'Kim' }  // Đổi số thành 9
  };

  const SAO_THEO_CUNG = {
    1:'Thiên Bồng', 2:'Thiên Nhuế', 3:'Thiên Xung',
    4:'Thiên Phụ',  5:'Thiên Cầm',  6:'Thiên Tâm',
    7:'Thiên Anh',  8:'Thiên Nhậm', 9:'Thiên Trụ'
  };
  const SAO_GOC_CUNG = {};
  Object.entries(SAO_THEO_CUNG).forEach(([c,s])=>{ SAO_GOC_CUNG[s]=Number(c); });

  const MON_THEO_CUNG = {
    1:'Hưu', 2:'Đỗ', 3:'Thương', 4:'Tử',
    5:'', 6:'Khai', 7:'Cảnh', 8:'Sinh', 9:'Kinh'
  };

  // QUỸ ĐẠO NGOẠI VI (CHUẨN HÀ ĐỒ THEO KIM ĐỒNG HỒ)
  const VONG_QUAY = [1, 8, 3, 2, 7, 4, 9, 6];
  const SAO_ORDER = ['Thiên Bồng', 'Thiên Nhậm', 'Thiên Xung', 'Thiên Nhuế', 'Thiên Anh', 'Thiên Phụ', 'Thiên Trụ', 'Thiên Tâm'];
  const MON_ORDER = ['Hưu', 'Sinh', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai'];
  const THAN_ORDER = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên'];

  const CHI_CHINH_CUNG = {1:'Tý', 2:'Thìn', 3:'Mão', 4:'Mùi', 5:'', 6:'Tuất', 7:'Ngọ', 8:'Sửu', 9:'Dậu'};
  const CHI_CUNG = {
    'Tý':1, 'Sửu':8, 'Dần':8, 'Mão':3, 'Thìn':2, 'Tỵ':2,
    'Ngọ':7, 'Mùi':4, 'Thân':4, 'Dậu':9, 'Tuất':6, 'Hợi':6
  };
  const CUNG_XUNG = {1:7, 7:1, 8:4, 4:8, 3:9, 9:3, 2:6, 6:2};
  
  const NOI_BAN = [1, 8, 3, 2];
  const NGOAI_BAN = [7, 4, 9, 6];

  const LUC_NGHI_TAM_KY = ['Mậu','Kỷ','Canh','Tân','Nhâm','Quý','Đinh','Bính','Ất'];
  const GIAP_AN_NGHI = {
    'Mậu':'Giáp Tý','Kỷ':'Giáp Tuất','Canh':'Giáp Thân',
    'Tân':'Giáp Ngọ','Nhâm':'Giáp Thìn','Quý':'Giáp Dần'
  };
  
  const KHONG_VONG = {
    'Giáp Tý':['Tuất','Hợi'],'Giáp Tuất':['Thân','Dậu'],
    'Giáp Thân':['Ngọ','Mùi'],'Giáp Ngọ':['Thìn','Tỵ'],
    'Giáp Thìn':['Dần','Mão'],'Giáp Dần':['Tý','Sửu']
  };

  // ============================================================
  // 3. TÍNH TOÁN TUẦN THỦ GIỜ (TRÁNH LỖI STRING)
  // ============================================================
  function tinhTuanThuGio(canGioIndex, chiGioIndex) {
    // Thuật toán tìm Chi của Tuần thủ hiện tại
    const chiXunIndex = (chiGioIndex - canGioIndex + 12) % 12;
    const chiXun = DIA_CHI[chiXunIndex];
    
    // Map Chi của Tuần thủ sang Lục Nghi
    const XUN_TO_STEM = {
      'Tý': 'Mậu', 'Tuất': 'Kỷ', 'Thân': 'Canh',
      'Ngọ': 'Tân', 'Thìn': 'Nhâm', 'Dần': 'Quý'
    };
    
    return {
      chiTuanThu: chiXun,
      canTuanThu: XUN_TO_STEM[chiXun],
      tuanThuName: 'Giáp ' + chiXun
    };
  }

  // ============================================================
  // 4. CÁC HÀM XỬ LÝ KỲ MÔN (ĐỘNG CƠ HÀ ĐỒ)
  // ============================================================
  
  function tinhDiaBan(soCuc, isDuong) {
    const db = {5: ''};
    let pos = soCuc;
    for(let i = 0; i < 9; i++) {
      db[pos] = LUC_NGHI_TAM_KY[i];
      if (isDuong) { pos++; if(pos > 9) pos = 1; }
      else { pos--; if(pos < 1) pos = 9; }
    }
    return db;
  }

  function tinhAnCan(db) {
    const ac = {};
    for (let c = 1; c <= 9; c++) ac[c] = c === 5 ? '' : (GIAP_AN_NGHI[db[c]] || '');
    return ac;
  }

  function timCungGocTrucPhu(db, canTuanThu) {
    for (let i = 1; i <= 9; i++) {
      if (db[i] === canTuanThu) return i;
    }
    return 1;
  }

  function tinhThienBanVaCan(db, cungGoc, canGio, canTuanThu) {
    let canGioThucTe = canGio === 'Giáp' ? canTuanThu : canGio;
    let cungDich = 5;
    for (let i = 1; i <= 9; i++) {
      if (db[i] === canGioThucTe) { cungDich = i; break; }
    }
    
    // Ký Trung Cung (5) vào Khôn (2)
    if (cungDich === 5) cungDich = 2;
    let cg = cungGoc === 5 ? 2 : cungGoc;

    let saoTrucPhu = SAO_THEO_CUNG[cg];
    let t_idx_goc = SAO_ORDER.indexOf(saoTrucPhu);
    let t_idx_dich = VONG_QUAY.indexOf(cungDich);

    const tb = {5: ''}, tcb = {5: ''};

    for (let i = 0; i < 8; i++) {
      let current_cung = VONG_QUAY[(t_idx_dich + i) % 8];
      let current_sao = SAO_ORDER[(t_idx_goc + i) % 8];
      tb[current_cung] = current_sao;
      tcb[current_cung] = db[SAO_GOC_CUNG[current_sao]] || '';
    }

    // Thiên Cầm đi theo Thiên Nhuế
    let offsetCam = (SAO_ORDER.indexOf('Thiên Nhuế') - t_idx_goc + 8) % 8;
    tb._cungCam = VONG_QUAY[(t_idx_dich + offsetCam) % 8];
    tcb._canCam = db[5] || '';

    return { thienBan: tb, thienCanBan: tcb, cungDichSao: cungDich };
  }

  function tinhBatMon(cungGoc, isDuong, chiGio, chiTuanThu) {
    let cg = cungGoc === 5 ? 2 : cungGoc;
    let monTrucSu = MON_THEO_CUNG[cg];

    // Số bước Trực Sử di chuyển = Khoảng cách từ Chi Tuần Thủ đến Chi Giờ
    let startIdx = DIA_CHI.indexOf(chiTuanThu);
    let endIdx = DIA_CHI.indexOf(chiGio);
    let steps = (endIdx - startIdx + 12) % 12;

    // Trực Sử bay qua 9 cung
    let pos = cungGoc;
    for (let i = 0; i < steps; i++) {
      if (isDuong) { pos++; if(pos > 9) pos = 1; }
      else { pos--; if(pos < 1) pos = 9; }
    }
    let cungDichMon = pos === 5 ? 2 : pos;

    const bm = {5: ''};
    let t_idx_goc = MON_ORDER.indexOf(monTrucSu);
    let t_idx_dich = VONG_QUAY.indexOf(cungDichMon);

    // Bát Môn luôn rải thuận theo quỹ đạo Vòng Quay
    for (let i = 0; i < 8; i++) {
      let current_cung = VONG_QUAY[(t_idx_dich + i) % 8];
      let current_mon = MON_ORDER[(t_idx_goc + i) % 8];
      bm[current_cung] = current_mon;
    }
    return bm;
  }

  function tinhBatThan(cungDichSao, isDuong) {
    const bt = {5: ''};
    let t_idx_dich = VONG_QUAY.indexOf(cungDichSao === 5 ? 2 : cungDichSao);

    for (let i = 0; i < 8; i++) {
      // Dương thuận, Âm nghịch theo vành đai Hà Đồ
      let step = isDuong ? i : -i;
      let current_cung = VONG_QUAY[(t_idx_dich + step + 8) % 8];
      bt[current_cung] = THAN_ORDER[i];
    }
    return bt;
  }

  function laySaoTaiCung(tb, cung) {
    const sao = tb[cung] || '';
    const dongCung = (cung === tb._cungCam && sao && sao !== 'Thiên Cầm') ? 'Thiên Cầm' : null;
    return { sao, dongCung };
  }

  // ============================================================
  // 5. CÁC HÀM LOGIC PHONG THỦY BỔ TRỢ 
  // ============================================================
  function tuongSinh(a,b){ return {'Mộc':'Hỏa','Hỏa':'Thổ','Thổ':'Kim','Kim':'Thủy','Thủy':'Mộc'}[a] === b; }
  function tuongKhac(a,b){ return {'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc'}[a] === b; }
  function biKhac(a,b){ return tuongKhac(b,a); }
  function biSinh(a,b){ return tuongSinh(b,a); }
  function dongHanh(a,b){ return a === b; }
  function quanHeNguHanh(a,b){
    if (dongHanh(a,b)) return 'tỷ hòa';
    if (tuongSinh(a,b)) return 'ngã sinh';
    if (biSinh(a,b)) return 'sinh ngã';
    if (tuongKhac(a,b)) return 'ngã khắc';
    if (biKhac(a,b)) return 'khắc ngã';
    return '';
  }

  const THIEN_CAN_HOP = {'Giáp Kỷ':'Thổ','Ất Canh':'Kim','Bính Tân':'Thủy','Đinh Nhâm':'Mộc','Mậu Quý':'Hỏa'};
  function timCanHop(can1, can2) { return THIEN_CAN_HOP[can1 + ' ' + can2] || THIEN_CAN_HOP[can2 + ' ' + can1] || null; }
  
  function tinhKyNghiHopXung(thienCanBan, diaBan) {
    const result = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const ct = thienCanBan[c] || '', cd = diaBan[c] || '';
      if (!ct || !cd) { result[c] = null; continue; }
      const hop = timCanHop(ct, cd);
      if (hop) result[c] = { type:'hợp', can1:ct, can2:cd, hoaHanh:hop, desc:`${ct}+${cd} hợp hóa ${hop}` };
      else {
        const i1 = THIEN_CAN.indexOf(ct), i2 = THIEN_CAN.indexOf(cd);
        if (i1 >= 0 && i2 >= 0 && Math.abs(i1 - i2) === 6) result[c] = { type:'xung', can1:ct, can2:cd, desc:`${ct}↔${cd} tương xung` };
        else result[c] = null;
      }
    }
    return result;
  }

  function isAmCan(c) { return THIEN_CAN.indexOf(c) % 2 !== 0; }
  
  const TRUONG_SINH_12 = ['Trường Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'];
  const TRUONG_SINH_GOC = {
    'Mộc': { duong:'Hợi', am:'Ngọ' }, 'Hỏa': { duong:'Dần', am:'Dậu' },
    'Thổ': { duong:'Thân', am:'Tý' }, 'Kim': { duong:'Tỵ', am:'Dần' }, 'Thủy': { duong:'Thân', am:'Mão' }
  };
  function tinhTruongSinh(can, chiCung, amDuong) {
    const hanh = NGU_HANH_CAN[can];
    if (!hanh || !TRUONG_SINH_GOC[hanh]) return '';
    const gocChi = TRUONG_SINH_GOC[hanh][amDuong] || TRUONG_SINH_GOC[hanh].duong;
    const bi = DIA_CHI.indexOf(gocChi), ci = DIA_CHI.indexOf(chiCung);
    if (bi === -1 || ci === -1) return '';
    const offset = amDuong === 'am' ? ((bi - ci) % 12 + 12) % 12 : ((ci - bi) % 12 + 12) % 12;
    return TRUONG_SINH_12[offset] || '';
  }
  function tinhTruongSinhChiTiet(canNgay, canGio, thienCanBan, diaBan, chiCung, amDuongNgay, amDuongGio) {
    return {
      dayStem: tinhTruongSinh(canNgay, chiCung, amDuongNgay),
      hourStem: tinhTruongSinh(canGio, chiCung, amDuongGio),
      heavenlyStem: thienCanBan ? tinhTruongSinh(thienCanBan, chiCung, isAmCan(thienCanBan) ? 'am' : 'duong') : '',
      earthlyStem: diaBan ? tinhTruongSinh(diaBan, chiCung, isAmCan(diaBan) ? 'am' : 'duong') : ''
    };
  }

  const DICH_MA_MAP = {'Thân Tý Thìn':'Dần', 'Dần Ngọ Tuất':'Thân', 'Tỵ Dậu Sửu':'Hợi', 'Hợi Mão Mùi':'Tỵ'};
  function tinhDichMa(chiNgay) {
    for (const [k,m] of Object.entries(DICH_MA_MAP)) if (k.includes(chiNgay)) return { chi:m, cung:CHI_CUNG[m] || 0 };
    return { chi:'', cung:0 };
  }

  const MO_KHO_MAP = {'Mộc':'Mùi','Hỏa':'Tuất','Kim':'Sửu','Thủy':'Thìn','Thổ':'Tuất'};
  function tinhMoKho(canNgay) {
    const hanh = NGU_HANH_CAN[canNgay] || '', chiMo = MO_KHO_MAP[hanh] || '', cung = chiMo ? (CHI_CUNG[chiMo] || 0) : 0;
    return { hanh, chiMo, cung, desc: chiMo ? `${canNgay}(${hanh}) mộ tại ${chiMo}(cung ${cung})` : '' };
  }

  const QUY_NHAN_MAP = {
    'Giáp':['Sửu','Mùi'],'Mậu':['Sửu','Mùi'], 'Ất':['Tý','Thân'], 'Kỷ':['Tý','Thân'],
    'Bính':['Hợi','Dậu'],'Đinh':['Hợi','Dậu'], 'Canh':['Dần','Ngọ'],'Tân':['Ngọ','Dần'],
    'Nhâm':['Tỵ','Mão'],'Quý':['Mão','Tỵ']
  };
  function tinhQuyNhan(canNgay) {
    const chiList = QUY_NHAN_MAP[canNgay] || [];
    return chiList.map(chi => ({ chi, cung: CHI_CUNG[chi] || 0, desc: `Quý nhân ${canNgay}: ${chi} → cung ${CHI_CUNG[chi] || '?'}` }));
  }

  const DIA_CHI_LUC_XUNG = {'Tý':'Ngọ','Ngọ':'Tý','Sửu':'Mùi','Mùi':'Sửu','Dần':'Thân','Thân':'Dần','Mão':'Dậu','Dậu':'Mão','Thìn':'Tuất','Tuất':'Thìn','Tỵ':'Hợi','Hợi':'Tỵ'};
  function tinhThaiTue(chiNam) {
    const cungThaiTue = CHI_CUNG[chiNam] || 0, chiXung = DIA_CHI_LUC_XUNG[chiNam] || '', cungTuePha = chiXung ? (CHI_CUNG[chiXung] || 0) : 0;
    return { thaiTue: { chi: chiNam, cung: cungThaiTue }, tuePha: { chi: chiXung, cung: cungTuePha } };
  }

  const NGUYEN_MAP = {'Giáp Tý':'Thượng nguyên','Giáp Ngọ':'Thượng nguyên','Giáp Thân':'Trung nguyên','Giáp Dần':'Trung nguyên','Giáp Tuất':'Hạ nguyên','Giáp Thìn':'Hạ nguyên'};
  function tinhTamNguyen(tuanThu) { return NGUYEN_MAP[tuanThu] || 'Không xác định'; }

  const LUC_NGHI_KICH_HINH = [
    { can:'Mậu', cungHD:[2], desc:'Mậu tại Khôn(2)' }, { can:'Mậu', cungHD:[7], desc:'Mậu tại Ly(7)' },
    { can:'Canh', cungHD:[4], desc:'Canh tại Tốn(4)' }, { can:'Canh', cungHD:[9], desc:'Canh tại Đoài(9)' },
    { can:'Tân', cungHD:[6], desc:'Tân tại Kiền(6)' }, { can:'Nhâm', cungHD:[3], desc:'Nhâm tại Chấn(3)' },
    { can:'Quý', cungHD:[1,8], desc:'Quý tại Khảm(1)/Cấn(8)' }, { can:'Kỷ', cungHD:[4], desc:'Kỷ tại Tốn(4)' }
  ];
  function tinhLucNghiKichHinh(diaBan) {
    const result = [];
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const can = diaBan[c] || '', chiCung = CHI_CHINH_CUNG[c] || '';
      for (const rule of LUC_NGHI_KICH_HINH) {
        if (can === rule.can && rule.cungHD.includes(c)) result.push({ cung:c, can, chiCung, loai:'hung', desc:`Lục Nghi kích hình: ${rule.desc}` });
      }
    }
    return result;
  }

  function tinhThapCanKhacUng(thienCanBan, diaBan) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const ct = thienCanBan[c] || '', cd = diaBan[c] || '';
      if (!ct || !cd) { r[c] = ''; continue; }
      r[c] = quanHeNguHanh(NGU_HANH_CAN[ct] || '', NGU_HANH_CAN[cd] || '');
    }
    return r;
  }

  function tinhMonBucChe(batMon) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) { r[c] = { type:'', desc:'' }; continue; }
      const mon = batMon[c] || '';
      if (!mon) { r[c] = { type:'', desc:'' }; continue; }
      const hm = NGU_HANH_MON[mon] || '', hc = CUNG_META[c]?.hanh || '', tenCung = CUNG_META[c]?.ten || '';

      if (tuongKhac(hm, hc)) r[c] = { type:'bức', desc:`${mon}(${hm})khắc${tenCung}(${hc})` };
      else if (tuongKhac(hc, hm)) r[c] = { type:'chế', desc:`${tenCung}(${hc})khắc${mon}(${hm})` };
      else if (tuongSinh(hm, hc)) r[c] = { type:'môn sinh cung', desc:`${mon}(${hm})sinh${tenCung}(${hc})` };
      else if (biSinh(hm, hc)) r[c] = { type:'cung sinh môn', desc:`${tenCung}(${hc})sinh${mon}(${hm})` };
      else if (dongHanh(hm, hc)) r[c] = { type:'tỷ hòa', desc:`${mon}(${hm})≡${tenCung}(${hc})` };
      else r[c] = { type:'', desc:'' };
    }
    return r;
  }

  function tinhNguBatNgoThoi(canNgay, canGio) {
    const hn = NGU_HANH_CAN[canNgay] || '', hg = NGU_HANH_CAN[canGio] || '';
    if (tuongKhac(hg, hn)) return { active:true, desc:`${canGio}(${hg})khắc${canNgay}(${hn})` };
    return { active:false, desc:'' };
  }

  // ============================================================
  // 6. TÍNH CÁCH CỤC
  // ============================================================
  function tinhCachCuc(tb, db, bm, bt, tcb) {
    const palacePatterns = {};
    for (let c = 1; c <= 9; c++) if (c !== 5) palacePatterns[c] = [];
    const auspicious = [], inauspicious = [], seen = {};

    const push = (cung, pattern) => {
      const key = cung + ':' + pattern.ten;
      if (seen[key]) return;
      seen[key] = true;
      palacePatterns[cung].push(pattern);
      if (pattern.loai === 'cat') auspicious.push(pattern); else inauspicious.push(pattern);
    };

    const tamKy = ['Ất','Bính','Đinh'], catMon = ['Khai','Hưu','Sinh'];

    for (let cung = 1; cung <= 9; cung++) {
      if (cung === 5) continue;
      const sao = tb[cung] || '', mon = bm[cung] || '', than = bt[cung] || '', ct = tcb[cung] || '', cd = db[cung] || '';
      const hc = CUNG_META[cung]?.hanh || '', hs = NGU_HANH_SAO[sao] || '', hm = NGU_HANH_MON[mon] || '';
      const dsSao = danhSachSaoTaiCung(tb, cung);

      if (sao === SAO_THEO_CUNG[cung] && mon === MON_THEO_CUNG[cung]) push(cung, { ten:'Phục Ngâm', cung, loai:'hung' });
      const cx = CUNG_XUNG[cung];
      if (cx && sao === SAO_THEO_CUNG[cx] && (bm[cx] || '') === MON_THEO_CUNG[cung]) push(cung, { ten:'Phản Ngâm', cung, loai:'hung' });

      if (tuongSinh(hs, hc)) push(cung, { ten:'Sao Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hs, hc)) push(cung, { ten:'Sao Khắc Cung', cung, loai:'hung' });
      if (tuongSinh(hm, hc)) push(cung, { ten:'Môn Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hm, hc)) push(cung, { ten:'Môn Bức Cung', cung, loai:'hung' });
      if (biKhac(hm, hc))    push(cung, { ten:'Cung Chế Môn', cung, loai:'hung' });

      if (than === 'Cửu Thiên' && mon === 'Sinh'  && dsSao.includes('Thiên Tâm'))  push(cung, { ten:'Thiên Độn', cung, loai:'cat' });
      if (than === 'Cửu Địa'   && mon === 'Khai'  && dsSao.includes('Thiên Nhậm')) push(cung, { ten:'Địa Độn', cung, loai:'cat' });
      if (than === 'Thái Âm'   && mon === 'Hưu'   && dsSao.includes('Thiên Bồng')) push(cung, { ten:'Nhân Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Khai') push(cung, { ten:'Phong Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Sinh') push(cung, { ten:'Vân Độn', cung, loai:'cat' });
      
      if (dsSao.includes('Thiên Nhuế') && mon === 'Tử') push(cung, { ten:'Thiên Nhuế Tử Môn', cung, loai:'hung' });
      if (tamKy.includes(ct) && catMon.includes(mon)) push(cung, { ten:'Hưu Trá', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Thiên') push(cung, { ten:'Thiên Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Địa')   push(cung, { ten:'Địa Giả', cung, loai:'cat' });

      if (ct === 'Mậu'  && cd === 'Bính' && [7,3].includes(cung)) push(cung, { ten:'Thanh Long Phản Thủ', cung, loai:'cat' });
      if (ct === 'Bính' && cd === 'Mậu'  && [7,3].includes(cung)) push(cung, { ten:'Phi Điểu Điệt Huyệt', cung, loai:'cat' });

      if (dsSao.includes('Thiên Cầm') && ['Khai','Hưu','Sinh','Cảnh'].includes(mon)) push(cung, { ten:'Thiên Cầm Tứ Trương', cung, loai:'cat' });
      if (ct === 'Ất' && mon === 'Hưu') push(cung, { ten:'Ất Kỳ Đắc Sử', cung, loai:'cat' });
    }

    const lnkh = tinhLucNghiKichHinh(db);
    for (const item of lnkh) push(item.cung, { ten:'Lục Nghi Kích Hình', cung:item.cung, loai:'hung', desc:item.desc });

    return { auspicious, inauspicious, palacePatterns };
  }

  // ============================================================
  // TIẾT KHÍ (3META)
  // ============================================================
  const TIET_KHI_SOC_CUC = {
    'Đông Chí':{type:'duong',soCuc:1},'Tiểu Hàn':{type:'am',soCuc:9},
    'Đại Hàn':{type:'am',soCuc:6},'Lập Xuân':{type:'am',soCuc:3},
    'Vũ Thủy':{type:'am',soCuc:7},'Kinh Trập':{type:'am',soCuc:1},
    'Xuân Phân':{type:'duong',soCuc:3},'Thanh Minh':{type:'duong',soCuc:6},
    'Cốc Vũ':{type:'duong',soCuc:9},'Lập Hạ':{type:'duong',soCuc:2},
    'Tiểu Mãn':{type:'duong',soCuc:5},'Mang Chủng':{type:'duong',soCuc:8},
    'Hạ Chí':{type:'am',soCuc:9},'Tiểu Thử':{type:'am',soCuc:3},
    'Đại Thử':{type:'am',soCuc:6},'Lập Thu':{type:'am',soCuc:9},
    'Xử Thử':{type:'am',soCuc:6},'Bạch Lộ':{type:'am',soCuc:3},
    'Thu Phân':{type:'duong',soCuc:7},'Hàn Lộ':{type:'duong',soCuc:1},
    'Sương Giáng':{type:'duong',soCuc:4},'Lập Đông':{type:'duong',soCuc:7},
    'Tiểu Tuyết':{type:'duong',soCuc:1},'Đại Tuyết':{type:'duong',soCuc:4}
  };

  // ============================================================
  // 7. HÀM LẬP BÀN CHÍNH
  // ============================================================
  function lapBanKyMon(dateStr, options = {}) {
    let nam, thang, ngay, gio = 12, phut = 0;
    const pts = dateStr.split(' ');
    const dp = pts[0].split('-');
    nam = +dp[0]; thang = +dp[1]; ngay = +dp[2];
    if (pts[1]) {
      const tp = pts[1].split(':'); gio = +tp[0]; phut = +(tp[1] || 0);
    }

    // TÍNH TOÁN THIÊN VĂN (SỬ DỤNG 3META)
    const lunar = (typeof ThreeMeta !== 'undefined' && ThreeMeta.Solar) ? 
                  ThreeMeta.Solar.fromYmdHms(nam, thang, ngay, gio, phut, 0).getLunar() : null;
    if (!lunar) throw new Error('Không thể lấy lunar từ 3meta');

    // Truy xuất Index Can Chi thay vì String để tránh lỗi ngôn ngữ
    const yGanIdx = lunar.getYearGanIndexExact();
    const yZhiIdx = lunar.getYearZhiIndexExact();
    const mGanIdx = lunar.getMonthGanIndexExact();
    const mZhiIdx = lunar.getMonthZhiIndexExact();
    const dGanIdx = lunar.getDayGanIndexExact();
    const dZhiIdx = lunar.getDayZhiIndexExact();
    const hGanIdx = lunar.getTimeGanIndex();
    const hZhiIdx = lunar.getTimeZhiIndex();

    const canNam = THIEN_CAN[yGanIdx]; const chiNam = DIA_CHI[yZhiIdx];
    const canThang = THIEN_CAN[mGanIdx]; const chiThang = DIA_CHI[mZhiIdx];
    const canNgay = THIEN_CAN[dGanIdx]; const chiNgay = DIA_CHI[dZhiIdx];
    const canGio = THIEN_CAN[hGanIdx]; const chiGio = DIA_CHI[hZhiIdx];

    let tkTen = lunar.getPrevJieQi(!1).getName();
    const tkMap = {'冬至':'Đông Chí','小寒':'Tiểu Hàn','大寒':'Đại Hàn','立春':'Lập Xuân','雨水':'Vũ Thủy','惊蛰':'Kinh Trập','春分':'Xuân Phân','清明':'Thanh Minh','谷雨':'Cốc Vũ','立夏':'Lập Hạ','小满':'Tiểu Mãn','芒种':'Mang Chủng','夏至':'Hạ Chí','小暑':'Tiểu Thử','大暑':'Đại Thử','立秋':'Lập Thu','处暑':'Xử Thử','白露':'Bạch Lộ','秋分':'Thu Phân','寒露':'Hàn Lộ','霜降':'Sương Giáng','立冬':'Lập Đông','小雪':'Tiểu Tuyết','大雪':'Đại Tuyết'};
    if (tkMap[tkTen]) tkTen = tkMap[tkTen];

    let isDuong = TIET_KHI_SOC_CUC[tkTen] ? TIET_KHI_SOC_CUC[tkTen].type === 'duong' : true;
    let soCuc = TIET_KHI_SOC_CUC[tkTen] ? TIET_KHI_SOC_CUC[tkTen].soCuc : 1;
    if (options.isDuong !== undefined) isDuong = options.isDuong;
    
    // TÍNH TUẦN THỦ CỦA GIỜ (Cốt lõi để Trực Sử di chuyển đúng)
    const xunInfo = tinhTuanThuGio(hGanIdx, hZhiIdx);
    const canTuanThu = xunInfo.canTuanThu; // Mậu, Kỷ...
    const chiTuanThu = xunInfo.chiTuanThu; // Tý, Tuất...
    const tuanThuName = xunInfo.tuanThuName; // Giáp Tý...
    
    const khongVong = KHONG_VONG[tuanThuName] || [];

    // LẬP BÀN ENGINE (HÀ ĐỒ VÒNG QUAY)
    const diaBan = tinhDiaBan(soCuc, isDuong);
    const cungGocTrucPhu = timCungGocTrucPhu(diaBan, canTuanThu);
    const { thienBan, thienCanBan, cungDichSao } = tinhThienBanVaCan(diaBan, cungGocTrucPhu, canGio, canTuanThu);
    
    // TRỰC SỬ BAY QUA CÁC CUNG DỰA VÀO KHOẢNG CÁCH GIỜ VÀ TUẦN THỦ
    const batMon = tinhBatMon(cungGocTrucPhu, isDuong, chiGio, chiTuanThu); 
    
    const batThan = tinhBatThan(cungDichSao, isDuong);
    const anCan = tinhAnCan(diaBan);
    
    const zhiFu = {
      cung: cungDichSao, ten: CUNG_META[cungDichSao]?.ten || '',
      sao: thienBan[cungDichSao] || '', gate: batMon[cungDichSao] || '', deity: batThan[cungDichSao] || ''
    };
    
    const zhiShi = { cung: 1, ten: '' };
    for (let i=1; i<=9; i++) { 
      if (batMon[i] === MON_THEO_CUNG[cungGocTrucPhu === 5 ? 2 : cungGocTrucPhu]) { 
        zhiShi.cung = i; zhiShi.ten = CUNG_META[i].ten; break; 
      } 
    }

    const thapCan = tinhThapCanKhacUng(thienCanBan, diaBan);
    const monBucChe = tinhMonBucChe(batMon);
    const dichMa = tinhDichMa(chiNgay); // Dịch mã theo ngày
    const cachCuc = tinhCachCuc(thienBan, diaBan, batMon, batThan, thienCanBan);
    const moKho = tinhMoKho(canNgay);
    const nguBatNgoThoi = tinhNguBatNgoThoi(canNgay, canGio);
    const kyNghiHopXung = tinhKyNghiHopXung(thienCanBan, diaBan);
    const quyNhan = tinhQuyNhan(canNgay);
    const thaiTue = tinhThaiTue(chiNam);
    const tamNguyen = tinhTamNguyen(tuanThuName);

    const amDuongNgay = isAmCan(canNgay) ? 'am' : 'duong';
    const amDuongGio = isAmCan(canGio) ? 'am' : 'duong';

    const palaces = [];
    for (let c = 1; c <= 9; c++) {
      const meta = CUNG_META[c] || {};
      const starInfo = laySaoTaiCung(thienBan, c);
      let noiNgoai = 'trung';
      if (NOI_BAN.includes(c)) noiNgoai = 'nội';
      if (NGOAI_BAN.includes(c)) noiNgoai = 'ngoại';

      palaces.push({
        cung: c, ten: meta.ten || '', huong: meta.huong || '', hanh: meta.hanh || '',
        diaBan: diaBan[c] || '', thienBan: starInfo.sao, thienBanDongCung: starInfo.dongCung,
        thienCanBan: thienCanBan[c] || '', anCan: anCan[c] || '', batMon: batMon[c] || '', batThan: batThan[c] || '',
        khongVong: { active: khongVong.includes(CHI_CHINH_CUNG[c]), chiKhongVong: khongVong, chiCung: CHI_CHINH_CUNG[c] },
        noiNgoai: noiNgoai,
        
        growthCycle: tinhTruongSinhChiTiet(canNgay, canGio, thienCanBan[c] || '', diaBan[c] || '', CHI_CHINH_CUNG[c], amDuongNgay, amDuongGio),
        thapCanKhacUng: thapCan[c] || '', 
        kyNghiHopXung: kyNghiHopXung[c] || null,
        monBucChe: monBucChe[c] || { type:'', desc:'' },
        
        isDichMa: dichMa.cung === c, 
        isMoKho: moKho.cung === c,
        isQuyNhan: quyNhan.some(q => q.cung === c),
        isThaiTue: thaiTue.thaiTue.cung === c,
        isTuePha: thaiTue.tuePha.cung === c,
        
        patterns: cachCuc.palacePatterns[c] || []
      });
    }

    return {
      version:'4.4.0-HeTu',
      timeInfo: { input: dateStr, nam, thang, ngay, gio, phut },
      fourPillars: { year: {can:canNam, chi:chiNam}, month: {can:canThang, chi:chiThang}, day: {can:canNgay, chi:chiNgay}, hour: {can:canGio, chi:chiGio} },
      ju: { soCuc, isDuong, type: isDuong ? 'Dương Độn' : 'Âm Độn' },
      season: { tietKhi: tkTen, type: isDuong ? 'duong' : 'am' },
      tuanThu: { ten: tuanThuName, khongVong, tamNguyen },
      zhiFu, zhiShi, dichMa, moKho, nguBatNgoThoi, quyNhan, thaiTue, tamNguyen,
      palaces,
      hiddenStems: anCan,
      specialPatterns: { auspicious: cachCuc.auspicious, inauspicious: cachCuc.inauspicious }
    };
  }

  return { byDatetime: lapBanKyMon, version:'4.4.0-HeTu', utils: { CUNG_META, NGU_HANH_CAN, tuongSinh, tuongKhac } };
}));
