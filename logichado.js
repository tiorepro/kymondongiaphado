// KyMonBanHaDo.js - Hà Đồ Kỳ Môn Độn Giáp Engine 
// Tích hợp: Phi Bàn / Chuyển Bàn, Triết Bổ / Trí Nhuận, Ký Khôn Động.
// Đã Cập Nhật: Bảng Tiết Khí Sóc Cục Chuẩn Mực + Xử lý Cung 5 cho Phi Bàn.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.HaDoBanKyMon = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  const THIEN_CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const DIA_CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

  const NGU_HANH_CAN = { 'Giáp':'Mộc','Ất':'Mộc','Bính':'Hỏa','Đinh':'Hỏa','Mậu':'Thổ','Kỷ':'Thổ','Canh':'Kim','Tân':'Kim','Nhâm':'Thủy','Quý':'Thủy' };
  const NGU_HANH_CHI = { 'Tý':'Thủy','Sửu':'Thổ','Dần':'Mộc','Mão':'Mộc','Thìn':'Thổ','Tỵ':'Hỏa','Ngọ':'Hỏa','Mùi':'Thổ','Thân':'Kim','Dậu':'Kim','Tuất':'Thổ','Hợi':'Thủy' };
  const NGU_HANH_SAO = { 'Thiên Bồng':'Thủy','Thiên Nhuế':'Thổ','Thiên Xung':'Mộc','Thiên Phụ':'Thổ','Thiên Cầm':'Thổ','Thiên Tâm':'Kim','Thiên Trụ':'Kim','Thiên Nhậm':'Thủy','Thiên Anh':'Hỏa' };
  const NGU_HANH_MON = { 'Hưu':'Thủy','Sinh':'Mộc','Thương':'Mộc','Đỗ':'Mộc','Cảnh':'Hỏa','Tử':'Thổ','Kinh':'Kim','Khai':'Kim' };

  const CUNG_META = {
    1: { ten: 'Khảm', huong: 'Bắc',       hanh: 'Thủy' },
    2: { ten: 'Khôn', huong: 'Đông Nam',  hanh: 'Thổ' }, 
    3: { ten: 'Chấn', huong: 'Đông',      hanh: 'Mộc' },
    4: { ten: 'Tốn',  huong: 'Tây Nam',   hanh: 'Mộc' }, 
    5: { ten: 'Trung Cung', huong: 'Trung tâm', hanh: 'Thổ' },
    6: { ten: 'Kiền', huong: 'Tây Bắc',   hanh: 'Kim' },
    7: { ten: 'Ly',   huong: 'Nam',       hanh: 'Hỏa' }, 
    8: { ten: 'Cấn',  huong: 'Đông Bắc',  hanh: 'Thổ' },
    9: { ten: 'Đoài', huong: 'Tây',       hanh: 'Kim' }  
  };

  const SAO_THEO_CUNG = { 1:'Thiên Bồng', 2:'Thiên Nhuế', 3:'Thiên Xung', 4:'Thiên Phụ', 5:'Thiên Cầm', 6:'Thiên Tâm', 7:'Thiên Anh', 8:'Thiên Nhậm', 9:'Thiên Trụ' };
  const SAO_GOC_CUNG = {}; Object.entries(SAO_THEO_CUNG).forEach(([c,s])=>{ SAO_GOC_CUNG[s]=Number(c); });

  const MON_THEO_CUNG = { 1:'Hưu', 2:'Đỗ', 3:'Thương', 4:'Tử', 5:'', 6:'Khai', 7:'Cảnh', 8:'Sinh', 9:'Kinh' };

  const VONG_QUAY = [1, 8, 3, 2, 7, 4, 9, 6];
  const SAO_ORDER = ['Thiên Bồng', 'Thiên Nhậm', 'Thiên Xung', 'Thiên Nhuế', 'Thiên Anh', 'Thiên Phụ', 'Thiên Trụ', 'Thiên Tâm'];
  const MON_ORDER = ['Hưu', 'Sinh', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai'];
  const THAN_ORDER = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên'];

  const CHI_CHINH_CUNG = {1:'Tý', 2:'Thìn', 3:'Mão', 4:'Mùi', 5:'', 6:'Tuất', 7:'Ngọ', 8:'Sửu', 9:'Dậu'};
  const CHI_CUNG = { 'Tý':1, 'Sửu':8, 'Dần':8, 'Mão':3, 'Thìn':2, 'Tỵ':2, 'Ngọ':7, 'Mùi':4, 'Thân':4, 'Dậu':9, 'Tuất':6, 'Hợi':6 };
  const CUNG_XUNG = {1:7, 7:1, 8:4, 4:8, 3:9, 9:3, 2:6, 6:2};
  const NOI_BAN = [1, 8, 3, 2], NGOAI_BAN = [7, 4, 9, 6];

  const LUC_NGHI_TAM_KY = ['Mậu','Kỷ','Canh','Tân','Nhâm','Quý','Đinh','Bính','Ất'];
  const GIAP_AN_NGHI = { 'Mậu':'Giáp Tý','Kỷ':'Giáp Tuất','Canh':'Giáp Thân', 'Tân':'Giáp Ngọ','Nhâm':'Giáp Thìn','Quý':'Giáp Dần' };
  const KHONG_VONG = { 'Giáp Tý':['Tuất','Hợi'],'Giáp Tuất':['Thân','Dậu'], 'Giáp Thân':['Ngọ','Mùi'],'Giáp Ngọ':['Thìn','Tỵ'], 'Giáp Thìn':['Dần','Mão'],'Giáp Dần':['Tý','Sửu'] };

  function tinhTuanThuGio(canGioIndex, chiGioIndex) {
    const chiXunIndex = (chiGioIndex - canGioIndex + 12) % 12;
    const chiXun = DIA_CHI[chiXunIndex];
    const XUN_TO_STEM = {'Tý':'Mậu', 'Tuất':'Kỷ', 'Thân':'Canh', 'Ngọ':'Tân', 'Thìn':'Nhâm', 'Dần':'Quý'};
    return { chiTuanThu: chiXun, canTuanThu: XUN_TO_STEM[chiXun], tuanThuName: 'Giáp ' + chiXun };
  }

  function tinhDiaBan(soCuc, isDuong) {
    const db = {5: ''}; let pos = soCuc;
    for(let i = 0; i < 9; i++) {
      db[pos] = LUC_NGHI_TAM_KY[i];
      if (isDuong) { pos++; if(pos > 9) pos = 1; } else { pos--; if(pos < 1) pos = 9; }
    }
    return db;
  }

  function tinhAnCan(db) {
    const ac = {}; for (let c = 1; c <= 9; c++) ac[c] = c === 5 ? '' : (GIAP_AN_NGHI[db[c]] || '');
    return ac;
  }

  function timCungGocTrucPhu(db, canTuanThu) {
    for (let i = 1; i <= 9; i++) if (db[i] === canTuanThu) return i;
    return 1;
  }

  function tinhThienBanVaCan(db, cungGoc, canGio, canTuanThu, isPhiBan, isDuong, cungKyTrung) {
    let canGioThucTe = canGio === 'Giáp' ? canTuanThu : canGio;
    let cungDich = 5;
    for (let i = 1; i <= 9; i++) if (db[i] === canGioThucTe) { cungDich = i; break; }
    
    if (isPhiBan) {
      if (cungDich === 5) cungDich = cungKyTrung; 
      let cg = cungGoc === 5 ? cungKyTrung : cungGoc;
      
      let phi_orbit = isDuong ? [1,2,3,4,6,7,8,9] : [9,8,7,6,4,3,2,1];
      let sao_seq = phi_orbit.map(c => SAO_THEO_CUNG[c]); 

      let idx_goc = phi_orbit.indexOf(cg);
      let idx_dich = phi_orbit.indexOf(cungDich);
      let offset = (idx_dich - idx_goc + 8) % 8;

      const tb = {5: ''}, tcb = {5: ''};
      for (let i = 0; i < 8; i++) {
        let target_idx = (i + offset) % 8;
        let target_cung = phi_orbit[target_idx];
        tb[target_cung] = sao_seq[i];
        tcb[target_cung] = db[SAO_GOC_CUNG[sao_seq[i]]] || ''; 
      }

      let saoKyCung = SAO_THEO_CUNG[cungKyTrung];
      let ky_idx = sao_seq.indexOf(saoKyCung);
      let target_idx_cam = (ky_idx + offset) % 8;
      tb._cungCam = phi_orbit[target_idx_cam];
      tcb._canCam = db[5] || '';

      return { thienBan: tb, thienCanBan: tcb, cungDichSao: cungDich };

    } else {
      if (cungDich === 5) cungDich = cungKyTrung; 
      let cg = cungGoc === 5 ? cungKyTrung : cungGoc;

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

      let saoKyCung = SAO_THEO_CUNG[cungKyTrung];
      let ky_idx = SAO_ORDER.indexOf(saoKyCung);
      let offsetCam = (ky_idx - t_idx_goc + 8) % 8;
      
      tb._cungCam = VONG_QUAY[(t_idx_dich + offsetCam) % 8];
      tcb._canCam = db[5] || '';

      return { thienBan: tb, thienCanBan: tcb, cungDichSao: cungDich };
    }
  }

  function tinhBatMon(cungGoc, isDuong, chiGio, chiTuanThu, isPhiBan, cungKyTrung) {
    let cg = cungGoc === 5 ? cungKyTrung : cungGoc;
    let monTrucSu = MON_THEO_CUNG[cg];

    let startIdx = DIA_CHI.indexOf(chiTuanThu);
    let endIdx = DIA_CHI.indexOf(chiGio);
    let steps = (endIdx - startIdx + 12) % 12; 

    let pos = cungGoc;
    for (let i = 0; i < steps; i++) {
      if (isDuong) { pos++; if(pos > 9) pos = 1; } else { pos--; if(pos < 1) pos = 9; }
    }
    let target_cung = pos;

    if (isPhiBan) {
      const bm = {5: ''};
      if (target_cung === 5) {
          bm._cuaDong = true;
          return bm; 
      }

      let cungDichMon = target_cung;
      let phi_orbit = isDuong ? [1,2,3,4,6,7,8,9] : [9,8,7,6,4,3,2,1];
      let mon_seq = phi_orbit.map(c => MON_THEO_CUNG[c]);

      let idx_goc = phi_orbit.indexOf(cg);
      let idx_dich = phi_orbit.indexOf(cungDichMon);
      let offset = (idx_dich - idx_goc + 8) % 8;

      for (let i = 0; i < 8; i++) {
        let t_idx = (i + offset) % 8;
        let c_cung = phi_orbit[t_idx];
        bm[c_cung] = mon_seq[i];
      }
      return bm;

    } else {
      let cungDichMon = target_cung === 5 ? cungKyTrung : target_cung;
      const bm = {5: ''};
      let t_idx_goc = MON_ORDER.indexOf(monTrucSu);
      let t_idx_dich = VONG_QUAY.indexOf(cungDichMon);

      for (let i = 0; i < 8; i++) {
        let current_cung = VONG_QUAY[(t_idx_dich + i) % 8];
        let current_mon = MON_ORDER[(t_idx_goc + i) % 8];
        bm[current_cung] = current_mon;
      }
      return bm;
    }
  }

  function tinhBatThan(cungDichSao, isDuong, isPhiBan, cungKyTrung) {
    const bt = {5: ''};
    let cds = cungDichSao === 5 ? cungKyTrung : cungDichSao;
    
    if (isPhiBan) {
      let phi_orbit = isDuong ? [1,2,3,4,6,7,8,9] : [9,8,7,6,4,3,2,1];
      let t_idx_dich = phi_orbit.indexOf(cds);

      for (let i = 0; i < 8; i++) {
        let step = isPhiBan ? i : (isDuong ? i : -i); 
        let current_cung = phi_orbit[(t_idx_dich + step + 8) % 8];
        bt[current_cung] = THAN_ORDER[i];
      }
    } else {
      let t_idx_dich = VONG_QUAY.indexOf(cds);
      for (let i = 0; i < 8; i++) {
        let step = isDuong ? i : -i; 
        let current_cung = VONG_QUAY[(t_idx_dich + step + 8) % 8];
        bt[current_cung] = THAN_ORDER[i];
      }
    }
    return bt;
  }

  function laySaoTaiCung(tb, cung) {
    const sao = tb[cung] || '';
    const dongCung = (cung === tb._cungCam && sao && sao !== 'Thiên Cầm') ? 'Thiên Cầm' : null;
    return { sao, dongCung };
  }

  function danhSachSaoTaiCung(tb, cung) {
    const r = [tb[cung] || ''].filter(Boolean);
    if (cung === tb._cungCam) r.push('Thiên Cầm');
    return r;
  }

  function tinhMua(thang) {
    if ([2,3,4].includes(thang)) return 'Xuân'; if ([5,6,7].includes(thang)) return 'Hạ';
    if ([8,9,10].includes(thang)) return 'Thu'; return 'Đông';
  }
  function laTuQuyThang(thang) { return [3,6,9,12].includes(thang); }

  const TRANG_THAI_MUA = {
    'Xuân': {'Mộc':'Vượng','Hỏa':'Tướng','Thổ':'Tử','Kim':'Tù','Thủy':'Hưu'},
    'Hạ':   {'Hỏa':'Vượng','Thổ':'Tướng','Kim':'Tử','Thủy':'Tù','Mộc':'Hưu'},
    'Thu':  {'Kim':'Vượng','Thủy':'Tướng','Mộc':'Tử','Hỏa':'Tù','Thổ':'Hưu'},
    'Đông': {'Thủy':'Vượng','Mộc':'Tướng','Hỏa':'Tử','Thổ':'Tù','Kim':'Hưu'},
    'Tứ Quý': {'Thổ':'Vượng','Kim':'Tướng','Thủy':'Tử','Mộc':'Tù','Hỏa':'Hưu'}
  };
  function tinhTrangThai(nguHanh, mua, laTuQuy) { return (laTuQuy ? (TRANG_THAI_MUA['Tứ Quý'] || {})[nguHanh] : (TRANG_THAI_MUA[mua] || {})[nguHanh]) || ''; }

  function tuongSinh(a,b){ return {'Mộc':'Hỏa','Hỏa':'Thổ','Thổ':'Kim','Kim':'Thủy','Thủy':'Mộc'}[a] === b; }
  function tuongKhac(a,b){ return {'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc'}[a] === b; }
  function biKhac(a,b){ return tuongKhac(b,a); }
  function biSinh(a,b){ return tuongSinh(b,a); }
  function dongHanh(a,b){ return a === b; }
  function quanHeNguHanh(a,b){
    if (dongHanh(a,b)) return 'tỷ hòa'; if (tuongSinh(a,b)) return 'ngã sinh';
    if (biSinh(a,b)) return 'sinh ngã'; if (tuongKhac(a,b)) return 'ngã khắc';
    if (biKhac(a,b)) return 'khắc ngã'; return '';
  }

  const THIEN_CAN_HOP = {'Giáp Kỷ':'Thổ','Ất Canh':'Kim','Bính Tân':'Thủy','Đinh Nhâm':'Mộc','Mậu Quý':'Hỏa'};
  function timCanHop(can1, can2) { return THIEN_CAN_HOP[can1 + ' ' + can2] || THIEN_CAN_HOP[can2 + ' ' + can1] || null; }
  
  function tinhKyNghiHopXung(thienCanBan, diaBan) {
    const result = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5 && !thienCanBan[5]) continue; 
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
      dayStem: tinhTruongSinh(canNgay, chiCung, amDuongNgay), hourStem: tinhTruongSinh(canGio, chiCung, amDuongGio),
      heavenlyStem: thienCanBan ? tinhTruongSinh(thienCanBan, chiCung, isAmCan(thienCanBan) ? 'am' : 'duong') : '',
      earthlyStem: diaBan ? tinhTruongSinh(diaBan, chiCung, isAmCan(diaBan) ? 'am' : 'duong') : ''
    };
  }

  const DICH_MA_MAP = {'Thân Tý Thìn':'Dần', 'Dần Ngọ Tuất':'Thân', 'Tỵ Dậu Sửu':'Hợi', 'Hợi Mão Mùi':'Tỵ'};
  function tinhDichMa(chiNgay) { for (const [k,m] of Object.entries(DICH_MA_MAP)) if (k.includes(chiNgay)) return { chi:m, cung:CHI_CUNG[m] || 0 }; return { chi:'', cung:0 }; }

  const MO_KHO_MAP = {'Mộc':'Mùi','Hỏa':'Tuất','Kim':'Sửu','Thủy':'Thìn','Thổ':'Tuất'};
  function tinhMoKho(canNgay) {
    const hanh = NGU_HANH_CAN[canNgay] || '', chiMo = MO_KHO_MAP[hanh] || '', cung = chiMo ? (CHI_CUNG[chiMo] || 0) : 0;
    return { hanh, chiMo, cung, desc: chiMo ? `${canNgay}(${hanh}) mộ tại ${chiMo}(cung ${cung})` : '' };
  }

  const QUY_NHAN_MAP = {
    'Giáp':['Sửu','Mùi'],'Mậu':['Sửu','Mùi'], 'Ất':['Tý','Thân'], 'Kỷ':['Tý','Thân'],
    'Bính':['Hợi','Dậu'],'Đinh':['Hợi','Dậu'], 'Canh':['Dần','Ngọ'],'Tân':['Ngọ','Dần'], 'Nhâm':['Tỵ','Mão'],'Quý':['Mão','Tỵ']
  };
  function tinhQuyNhan(canNgay) { return (QUY_NHAN_MAP[canNgay] || []).map(chi => ({ chi, cung: CHI_CUNG[chi] || 0, desc: `Quý nhân ${canNgay}: ${chi} → cung ${CHI_CUNG[chi] || '?'}` })); }

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
      if (c === 5 && !diaBan[5]) continue;
      const can = diaBan[c] || '', chiCung = CHI_CHINH_CUNG[c] || '';
      for (const rule of LUC_NGHI_KICH_HINH) if (can === rule.can && rule.cungHD.includes(c)) result.push({ cung:c, can, chiCung, loai:'hung', desc:`Lục Nghi kích hình: ${rule.desc}` });
    }
    return result;
  }

  function tinhThapCanKhacUng(thienCanBan, diaBan) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5 && !thienCanBan[5]) continue; 
      const ct = thienCanBan[c] || '', cd = diaBan[c] || '';
      if (!ct || !cd) { r[c] = ''; continue; }
      r[c] = quanHeNguHanh(NGU_HANH_CAN[ct] || '', NGU_HANH_CAN[cd] || '');
    }
    return r;
  }

  function tinhMonBucChe(batMon) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) { r[c] = { type:'', desc:'' }; continue; } // Bát môn không có ở cung 5
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

  function tinhCachCuc(tb, db, bm, bt, tcb) {
    const palacePatterns = {};
    for (let c = 1; c <= 9; c++) palacePatterns[c] = [];
    const auspicious = [], inauspicious = [], seen = {};

    const push = (cung, pattern) => {
      const key = cung + ':' + pattern.ten;
      if (seen[key]) return;
      seen[key] = true; palacePatterns[cung].push(pattern);
      if (pattern.loai === 'cat') auspicious.push(pattern); else inauspicious.push(pattern);
    };

    const tamKy = ['Ất','Bính','Đinh'], catMon = ['Khai','Hưu','Sinh'];

    for (let cung = 1; cung <= 9; cung++) {
      if (cung === 5 && !tb[5]) continue; // Fix để luận giải được cho cung 5 trong Phi Bàn
      
      const sao = tb[cung] || '', mon = bm[cung] || '', than = bt[cung] || '', ct = tcb[cung] || '', cd = db[cung] || '';
      const hc = CUNG_META[cung]?.hanh || '', hs = NGU_HANH_SAO[sao] || '', hm = NGU_HANH_MON[mon] || '';
      const dsSao = danhSachSaoTaiCung(tb, cung);

      if (sao === SAO_THEO_CUNG[cung] && mon === MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phục Ngâm', cung, loai:'hung' });
      const cx = CUNG_XUNG[cung];
      if (cx && sao === SAO_THEO_CUNG[cx] && (bm[cx] || '') === MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phản Ngâm', cung, loai:'hung' });

      if (tuongSinh(hs, hc)) push(cung, { ten:'Sao Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hs, hc)) push(cung, { ten:'Sao Khắc Cung', cung, loai:'hung' });
      if (tuongSinh(hm, hc) && hm) push(cung, { ten:'Môn Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hm, hc) && hm) push(cung, { ten:'Môn Bức Cung', cung, loai:'hung' });
      if (biKhac(hm, hc) && hm)    push(cung, { ten:'Cung Chế Môn', cung, loai:'hung' });

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
  // HÀM LẬP BÀN CHÍNH
  // ============================================================
  function lapBanKyMon(dateStr, options = {}) {
    let nam, thang, ngay, gio = 12, phut = 0;
    const pts = dateStr.split(' ');
    const dp = pts[0].split('-');
    nam = +dp[0]; thang = +dp[1]; ngay = +dp[2];
    if (pts[1]) { const tp = pts[1].split(':'); gio = +tp[0]; phut = +(tp[1] || 0); }

    const lunar = (typeof ThreeMeta !== 'undefined' && ThreeMeta.Solar) ? ThreeMeta.Solar.fromYmdHms(nam, thang, ngay, gio, phut, 0).getLunar() : null;
    if (!lunar) throw new Error('Không thể lấy lunar từ 3meta');

    const yGanIdx = lunar.getYearGanIndexExact(), yZhiIdx = lunar.getYearZhiIndexExact();
    const mGanIdx = lunar.getMonthGanIndexExact(), mZhiIdx = lunar.getMonthZhiIndexExact();
    const dGanIdx = lunar.getDayGanIndexExact(), dZhiIdx = lunar.getDayZhiIndexExact();
    const hGanIdx = lunar.getTimeGanIndex(), hZhiIdx = lunar.getTimeZhiIndex();

    const canNam = THIEN_CAN[yGanIdx], chiNam = DIA_CHI[yZhiIdx];
    const canThang = THIEN_CAN[mGanIdx], chiThang = DIA_CHI[mZhiIdx];
    const canNgay = THIEN_CAN[dGanIdx], chiNgay = DIA_CHI[dZhiIdx];
    const canGio = THIEN_CAN[hGanIdx], chiGio = DIA_CHI[hZhiIdx];

    let tkTen = lunar.getPrevJieQi(!1).getName();
    const tkMap = {'冬至':'Đông Chí','小寒':'Tiểu Hàn','大寒':'Đại Hàn','立春':'Lập Xuân','雨水':'Vũ Thủy','惊蛰':'Kinh Trập','春分':'Xuân Phân','清明':'Thanh Minh','谷雨':'Cốc Vũ','立夏':'Lập Hạ','小满':'Tiểu Mãn','芒种':'Mang Chủng','夏至':'Hạ Chí','小暑':'Tiểu Thử','大暑':'Đại Thử','立秋':'Lập Thu','处暑':'Xử Thử','白露':'Bạch Lộ','秋分':'Thu Phân','寒露':'Hàn Lộ','霜降':'Sương Giáng','立冬':'Lập Đông','小雪':'Tiểu Tuyết','大雪':'Đại Tuyết'};
    if (tkMap[tkTen]) tkTen = tkMap[tkTen];

    // ==========================================
    // BẢNG TIẾT KHÍ SÓC CỤC CHUẨN MỰC
    // ==========================================
    const TIET_KHI_SOC_CUC = { 
      'Đông Chí':{type:'duong',soCuc:1}, 'Tiểu Hàn':{type:'duong',soCuc:2}, 'Đại Hàn':{type:'duong',soCuc:3}, 
      'Lập Xuân':{type:'duong',soCuc:8}, 'Vũ Thủy':{type:'duong',soCuc:9}, 'Kinh Trập':{type:'duong',soCuc:1}, 
      'Xuân Phân':{type:'duong',soCuc:3}, 'Thanh Minh':{type:'duong',soCuc:4}, 'Cốc Vũ':{type:'duong',soCuc:5}, 
      'Lập Hạ':{type:'duong',soCuc:4}, 'Tiểu Mãn':{type:'duong',soCuc:5}, 'Mang Chủng':{type:'duong',soCuc:6}, 
      'Hạ Chí':{type:'am',soCuc:9}, 'Tiểu Thử':{type:'am',soCuc:8}, 'Đại Thử':{type:'am',soCuc:7}, 
      'Lập Thu':{type:'am',soCuc:2}, 'Xử Thử':{type:'am',soCuc:1}, 'Bạch Lộ':{type:'am',soCuc:9}, 
      'Thu Phân':{type:'am',soCuc:7}, 'Hàn Lộ':{type:'am',soCuc:6}, 'Sương Giáng':{type:'am',soCuc:5}, 
      'Lập Đông':{type:'am',soCuc:6}, 'Tiểu Tuyết':{type:'am',soCuc:5}, 'Đại Tuyết':{type:'am',soCuc:4} 
    };
    
    let isDuong = TIET_KHI_SOC_CUC[tkTen] ? TIET_KHI_SOC_CUC[tkTen].type === 'duong' : true;
    let baseCuc = TIET_KHI_SOC_CUC[tkTen] ? TIET_KHI_SOC_CUC[tkTen].soCuc : 1;
    let nguyenOffset = 0, nguyenName = 'Thượng nguyên';

    if (options.anCuc === 'phudau') {
      let offsetDays = dGanIdx % 5;
      let phuDauZhiIdx = (dZhiIdx - offsetDays + 12) % 12;
      let phuDauZhi = DIA_CHI[phuDauZhiIdx];
      
      if (['Tý','Ngọ','Mão','Dậu'].includes(phuDauZhi)) { nguyenOffset = 0; nguyenName = 'Thượng nguyên'; }
      else if (['Dần','Thân','Tỵ','Hợi'].includes(phuDauZhi)) { nguyenOffset = isDuong ? 6 : -6; nguyenName = 'Trung nguyên'; }
      else { nguyenOffset = isDuong ? 3 : -3; nguyenName = 'Hạ nguyên'; }
    } else {
      let jqS = lunar.getPrevJieQi(!1).getSolar();
      let curS = lunar.getSolar();
      let d1 = new Date(nam, thang - 1, ngay);
      let d2 = new Date(jqS.getYear(), jqS.getMonth() - 1, jqS.getDay());
      let diffDays = Math.round((d1.getTime() - d2.getTime()) / 86400000); 
      
      if (diffDays < 5) { nguyenOffset = 0; nguyenName = 'Thượng nguyên'; }
      else if (diffDays < 10) { nguyenOffset = isDuong ? 6 : -6; nguyenName = 'Trung nguyên'; }
      else { nguyenOffset = isDuong ? 3 : -3; nguyenName = 'Hạ nguyên'; }
    }

    let soCuc = baseCuc + nguyenOffset;
    while (soCuc > 9) soCuc -= 9; while (soCuc < 1) soCuc += 9;

    if (options.isDuong !== undefined) isDuong = options.isDuong;

    const isPhiBan = options.diCung === 'phi';
    const kyCungMethod = options.kyCung || 'khon';
    const cungKyTrung = (kyCungMethod === 'can_khon') ? (isDuong ? 8 : 2) : 2;
    
    const xunInfo = tinhTuanThuGio(hGanIdx, hZhiIdx);
    const canTuanThu = xunInfo.canTuanThu; 
    const chiTuanThu = xunInfo.chiTuanThu; 
    const tuanThuName = xunInfo.tuanThuName; 
    
    const khongVong = KHONG_VONG[tuanThuName] || [];
    const mua = tinhMua(thang);
    const isTuQuyThang = laTuQuyThang(thang);

    const diaBan = tinhDiaBan(soCuc, isDuong);
    const cungGocTrucPhu = timCungGocTrucPhu(diaBan, canTuanThu);
    
    const { thienBan, thienCanBan, cungDichSao } = tinhThienBanVaCan(diaBan, cungGocTrucPhu, canGio, canTuanThu, isPhiBan, isDuong, cungKyTrung);
    const batMon = tinhBatMon(cungGocTrucPhu, isDuong, chiGio, chiTuanThu, isPhiBan, cungKyTrung); 
    const batThan = tinhBatThan(cungDichSao, isDuong, isPhiBan, cungKyTrung);
    const anCan = tinhAnCan(diaBan);
    
    // --- LẬP TRỰC PHÙ VÀ TRỰC SỬ (HỖ TRỢ CỬA ĐÓNG & PHỤC NGÂM) ---
    const isPhucNgamTrungCung = isPhiBan && (cungGocTrucPhu === 5);
    const isCuaDong = isPhiBan && batMon._cuaDong === true;
    
    const tsMon = MON_THEO_CUNG[cungGocTrucPhu === 5 ? cungKyTrung : cungGocTrucPhu];
    
    const zhiFu = {
      cung: cungDichSao, ten: CUNG_META[cungDichSao]?.ten || '',
      sao: isPhucNgamTrungCung ? 'Thiên Cầm' : (thienBan[cungDichSao] || ''), 
      gate: batMon[cungDichSao] || '', deity: batThan[cungDichSao] || '',
      isPhucNgam: isPhucNgamTrungCung
    };
    
    const zhiShi = { cung: 1, ten: '', mon: tsMon, isCuaDong: isCuaDong };
    if (isCuaDong) {
      zhiShi.cung = 5; zhiShi.ten = 'Trung Cung';
    } else {
      for (let i=1; i<=9; i++) { 
        if (batMon[i] === tsMon) { 
          zhiShi.cung = i; zhiShi.ten = CUNG_META[i].ten; break; 
        } 
      }
    }

    const thapCan = tinhThapCanKhacUng(thienCanBan, diaBan);
    const monBucChe = tinhMonBucChe(batMon);
    const dichMa = tinhDichMa(chiNgay); 
    const cachCuc = tinhCachCuc(thienBan, diaBan, batMon, batThan, thienCanBan);
    
    // CHÈN CÁCH CỤC "PHỤC NGÂM TRUNG CUNG" NẾU CÓ
    if (isPhucNgamTrungCung) {
      if (!cachCuc.palacePatterns[5]) cachCuc.palacePatterns[5] = [];
      let pat = { ten: 'Phục Ngâm (Tuần thủ nhập Trung)', cung: 5, loai: 'hung' };
      cachCuc.palacePatterns[5].push(pat);
      cachCuc.inauspicious.push(pat);
    }

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

      const hanhSao = NGU_HANH_SAO[starInfo.sao] || '';
      const hanhMon = NGU_HANH_MON[batMon[c]] || '';

      palaces.push({
        cung: c, ten: meta.ten || '', huong: meta.huong || '', hanh: meta.hanh || '',
        diaBan: diaBan[c] || '', thienBan: starInfo.sao, thienBanDongCung: starInfo.dongCung,
        thienCanBan: thienCanBan[c] || '', anCan: anCan[c] || '', batMon: batMon[c] || '', batThan: batThan[c] || '',
        khongVong: { active: khongVong.includes(CHI_CHINH_CUNG[c]), chiKhongVong: khongVong, chiCung: CHI_CHINH_CUNG[c] },
        noiNgoai: noiNgoai,
        trangThai: { sao: starInfo.sao ? tinhTrangThai(hanhSao, mua, isTuQuyThang) : '', mon: batMon[c] ? tinhTrangThai(hanhMon, mua, isTuQuyThang) : '' },
        growthCycle: tinhTruongSinhChiTiet(canNgay, canGio, thienCanBan[c] || '', diaBan[c] || '', CHI_CHINH_CUNG[c], amDuongNgay, amDuongGio),
        thapCanKhacUng: thapCan[c] || '', kyNghiHopXung: kyNghiHopXung[c] || null, monBucChe: monBucChe[c] || { type:'', desc:'' },
        isDichMa: dichMa.cung === c, isMoKho: moKho.cung === c, isQuyNhan: quyNhan.some(q => q.cung === c),
        isThaiTue: thaiTue.thaiTue.cung === c, isTuePha: thaiTue.tuePha.cung === c,
        patterns: cachCuc.palacePatterns[c] || []
      });
    }

    return {
      version:'5.0.9-HeTu',
      timeInfo: { input: dateStr, nam, thang, ngay, gio, phut },
      fourPillars: { year: {can:canNam, chi:chiNam}, month: {can:canThang, chi:chiThang}, day: {can:canNgay, chi:chiNgay}, hour: {can:canGio, chi:chiGio} },
      ju: { soCuc, isDuong, type: isDuong ? 'Dương Độn' : 'Âm Độn', nguyenName },
      season: { tietKhi: tkTen, type: isDuong ? 'duong' : 'am', mua, isTuQuyThang },
      tuanThu: { ten: tuanThuName, khongVong, tamNguyen },
      zhiFu, zhiShi, dichMa, moKho, nguBatNgoThoi, quyNhan, thaiTue, tamNguyen,
      palaces, hiddenStems: anCan, specialPatterns: { auspicious: cachCuc.auspicious, inauspicious: cachCuc.inauspicious }
    };
  }

  return { byDatetime: lapBanKyMon, version:'5.0.9-HeTu', utils: { CUNG_META, NGU_HANH_CAN, tuongSinh, tuongKhac } };
}));