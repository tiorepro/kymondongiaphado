// KyMonBanHaDo.js - Hà Đồ Kỳ Môn Độn Giáp Engine
// Version: 4.3.1-hado
// Sao đi theo QUẺ | Sinh Môn = Mộc
// Nâng cấp:
// - Tiết khí ưu tiên lấy từ 3meta (chính xác hơn)
// - Can chi năm tính theo thời điểm Lập Xuân thực, không cắt cứng 4/2
// - Giữ nguyên cấu trúc output để tương thích với KMDGHD.html / LogicLuanQue.js

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.HaDoBanKyMon = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // ============================================================
  // 1. HẰNG SỐ CƠ BẢN
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
  const GIO_CHI_MAP = [
    [23,1,'Tý'],[1,3,'Sửu'],[3,5,'Dần'],[5,7,'Mão'],
    [7,9,'Thìn'],[9,11,'Tỵ'],[11,13,'Ngọ'],[13,15,'Mùi'],
    [15,17,'Thân'],[17,19,'Dậu'],[19,21,'Tuất'],[21,23,'Hợi']
  ];

  // ============================================================
  // 2. CUNG META — HÀ ĐỒ
  // ============================================================
  const CUNG_META = {
    1:{ten:'Khảm',huong:'Bắc',direction:'North',que:'☵',hanh:'Thủy'},
    2:{ten:'Khôn',huong:'Đông Nam',direction:'Southeast',que:'☷',hanh:'Thổ'},
    3:{ten:'Chấn',huong:'Đông',direction:'East',que:'☳',hanh:'Mộc'},
    4:{ten:'Tốn',huong:'Tây Nam',direction:'Southwest',que:'☴',hanh:'Mộc'},
    5:{ten:'Trung Cung',huong:'Trung tâm',direction:'Center',que:'',hanh:'Thổ'},
    6:{ten:'Kiền',huong:'Tây Bắc',direction:'Northwest',que:'☰',hanh:'Kim'},
    7:{ten:'Ly',huong:'Nam',direction:'South',que:'☲',hanh:'Hỏa'},
    8:{ten:'Cấn',huong:'Đông Bắc',direction:'Northeast',que:'☶',hanh:'Thổ'},
    9:{ten:'Đoài',huong:'Tây',direction:'West',que:'☱',hanh:'Kim'}
  };

  // ============================================================
  // 3. SAO GỐC — HÀ ĐỒ
  // ============================================================
  const SAO_THEO_CUNG = {
    1:'Thiên Bồng',2:'Thiên Nhuế',3:'Thiên Xung',
    4:'Thiên Phụ',5:'Thiên Cầm',6:'Thiên Tâm',
    7:'Thiên Anh',8:'Thiên Nhậm',9:'Thiên Trụ'
  };
  const SAO_GOC_CUNG = {};
  Object.entries(SAO_THEO_CUNG).forEach(([c,s])=>{ SAO_GOC_CUNG[s]=Number(c); });

  // ============================================================
  // 4. MÔN GỐC — HÀ ĐỒ
  // ============================================================
  const MON_THEO_CUNG = {
    1:'Hưu',2:'Đỗ',3:'Thương',4:'Tử',
    5:'',6:'Khai',7:'Cảnh',8:'Sinh',9:'Kinh'
  };
  const MON_ORDER = ['Hưu','Sinh','Thương','Đỗ','Cảnh','Tử','Kinh','Khai'];

  // ============================================================
  // 5. CHIỀU XOAY, CHI CUNG, CUNG XUNG, NỘI NGOẠI
  // ============================================================
  const CHIEU_THUAN = [1,2,3,4,6,7,8,9];
  const CHI_CUNG = {
    'Tý':1,'Sửu':8,'Dần':3,'Mão':3,'Thìn':2,'Tỵ':2,
    'Ngọ':7,'Mùi':4,'Thân':4,'Dậu':9,'Tuất':6,'Hợi':1
  };
  const CHI_CHINH_CUNG = {1:'Tý',2:'Thìn',3:'Mão',4:'Mùi',5:'',6:'Tuất',7:'Ngọ',8:'Sửu',9:'Dậu'};
  const CUNG_XUNG = {1:7,7:1,2:6,6:2,3:9,9:3,4:8,8:4};
  const NOI_BAN = [1,8,3,4];
  const NGOAI_BAN = [7,2,9,6];

  // ============================================================
  // 6. LỤC NGHI TAM KỲ, BÁT THẦN, ẨN CAN
  // ============================================================
  const LUC_NGHI_TAM_KY = ['Mậu','Kỷ','Canh','Tân','Nhâm','Quý','Đinh','Bính','Ất'];
  const BAT_THAN = ['Trực Phù','Đằng Xà','Thái Âm','Lục Hợp','Câu Trận','Chu Tước','Cửu Địa','Cửu Thiên'];
  const GIAP_AN_NGHI = {
    'Mậu':'Giáp Tý','Kỷ':'Giáp Tuất','Canh':'Giáp Thân',
    'Tân':'Giáp Ngọ','Nhâm':'Giáp Thìn','Quý':'Giáp Dần'
  };

  // ============================================================
  // 7. THIÊN CAN HỢP
  // ============================================================
  const THIEN_CAN_HOP = {
    'Giáp Kỷ':'Thổ','Ất Canh':'Kim','Bính Tân':'Thủy',
    'Đinh Nhâm':'Mộc','Mậu Quý':'Hỏa'
  };

  function timCanHop(can1, can2) {
    const k1 = can1 + ' ' + can2;
    const k2 = can2 + ' ' + can1;
    return THIEN_CAN_HOP[k1] || THIEN_CAN_HOP[k2] || null;
  }

  function tinhKyNghiHopXung(thienCanBan, diaBan) {
    const result = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const ct = thienCanBan[c] || '';
      const cd = diaBan[c] || '';
      if (!ct || !cd) {
        result[c] = null;
        continue;
      }
      const hop = timCanHop(ct, cd);
      if (hop) {
        result[c] = {
          type:'hợp',
          can1:ct,
          can2:cd,
          hoaHanh:hop,
          desc:`${ct}+${cd} hợp hóa ${hop}`
        };
      } else {
        const i1 = THIEN_CAN.indexOf(ct);
        const i2 = THIEN_CAN.indexOf(cd);
        if (i1 >= 0 && i2 >= 0 && Math.abs(i1 - i2) === 6) {
          result[c] = {
            type:'xung',
            can1:ct,
            can2:cd,
            desc:`${ct}↔${cd} tương xung`
          };
        } else {
          result[c] = null;
        }
      }
    }
    return result;
  }

  // ============================================================
  // 8. ĐỊA CHI LỤC HỢP / TAM HỢP / LỤC XUNG
  // ============================================================
  const DIA_CHI_LUC_HOP = {
    'Tý':'Sửu','Sửu':'Tý','Dần':'Hợi','Hợi':'Dần',
    'Mão':'Tuất','Tuất':'Mão','Thìn':'Dậu','Dậu':'Thìn',
    'Tỵ':'Thân','Thân':'Tỵ','Ngọ':'Mùi','Mùi':'Ngọ'
  };
  const DIA_CHI_TAM_HOP = {
    'Thân Tý Thìn':'Thủy','Dần Ngọ Tuất':'Hỏa',
    'Tỵ Dậu Sửu':'Kim','Hợi Mão Mùi':'Mộc'
  };
  const DIA_CHI_LUC_XUNG = {
    'Tý':'Ngọ','Ngọ':'Tý','Sửu':'Mùi','Mùi':'Sửu',
    'Dần':'Thân','Thân':'Dần','Mão':'Dậu','Dậu':'Mão',
    'Thìn':'Tuất','Tuất':'Thìn','Tỵ':'Hợi','Hợi':'Tỵ'
  };

  function timLucHop(chi) { return DIA_CHI_LUC_HOP[chi] || null; }
  function timLucXung(chi) { return DIA_CHI_LUC_XUNG[chi] || null; }
  function timTamHop(chi) {
    for (const [k,v] of Object.entries(DIA_CHI_TAM_HOP)) {
      if (k.includes(chi)) return { nho:k.split(' '), hoaHanh:v };
    }
    return null;
  }

  // ============================================================
  // 9. TAM KỲ ĐẮC SỬ
  // ============================================================
  function tinhTamKyDacSu(thienCanBan, batMon) {
    const result = [];
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const can = thienCanBan[c] || '';
      const mon = batMon[c] || '';
      if (can === 'Ất' && mon === 'Hưu') {
        result.push({ cung:c, type:'Ất kỳ đắc sử', can, mon, loai:'cat', desc:'Ất kỳ + Hưu Môn: đại cát' });
      }
      if (can === 'Bính' && mon === 'Sinh') {
        result.push({ cung:c, type:'Bính kỳ đắc sử', can, mon, loai:'cat', desc:'Bính kỳ + Sinh Môn: đại cát' });
      }
      if (can === 'Đinh' && mon === 'Khai') {
        result.push({ cung:c, type:'Đinh kỳ đắc sử', can, mon, loai:'cat', desc:'Đinh kỳ + Khai Môn: đại cát' });
      }
    }
    return result;
  }

  // ============================================================
  // 10. LỤC NGHI KÍCH HÌNH
  // ============================================================
  const LUC_NGHI_KICH_HINH = [
    { can:'Mậu',  cungHD:[2],   desc:'Mậu tại Khôn(2)' },
    { can:'Mậu',  cungHD:[7],   desc:'Mậu tại Ly(7)' },
    { can:'Canh', cungHD:[4],   desc:'Canh tại Tốn(4)' },
    { can:'Canh', cungHD:[9],   desc:'Canh tại Đoài(9)' },
    { can:'Tân',  cungHD:[6],   desc:'Tân tại Kiền(6)' },
    { can:'Nhâm', cungHD:[3],   desc:'Nhâm tại Chấn(3)' },
    { can:'Quý',  cungHD:[1,8], desc:'Quý tại Khảm(1)/Cấn(8)' },
    { can:'Kỷ',   cungHD:[4],   desc:'Kỷ tại Tốn(4)' }
  ];

  function tinhLucNghiKichHinh(diaBan) {
    const result = [];
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const can = diaBan[c] || '';
      const chiCung = CHI_CHINH_CUNG[c] || '';
      for (const rule of LUC_NGHI_KICH_HINH) {
        if (can === rule.can && rule.cungHD.includes(c)) {
          result.push({
            cung:c,
            can,
            chiCung,
            loai:'hung',
            desc:`Lục Nghi kích hình: ${rule.desc}`
          });
        }
      }
    }
    return result;
  }

  // ============================================================
  // 11. THIÊN ẤT QUÝ NHÂN
  // ============================================================
  const QUY_NHAN_MAP = {
    'Giáp':['Sửu','Mùi'],'Mậu':['Sửu','Mùi'],
    'Ất':['Tý','Thân'],  'Kỷ':['Tý','Thân'],
    'Bính':['Hợi','Dậu'],'Đinh':['Hợi','Dậu'],
    'Canh':['Dần','Ngọ'],'Tân':['Ngọ','Dần'],
    'Nhâm':['Tỵ','Mão'],'Quý':['Mão','Tỵ']
  };

  function tinhQuyNhan(canNgay) {
    const chiList = QUY_NHAN_MAP[canNgay] || [];
    return chiList.map(chi => ({
      chi,
      cung: CHI_CUNG[chi] || 0,
      desc: `Quý nhân ${canNgay}: ${chi} → cung ${CHI_CUNG[chi] || '?'}`
    }));
  }

  // ============================================================
  // 12. THÁI TUẾ / TUẾ PHÁ
  // ============================================================
  function tinhThaiTue(chiNam) {
    const cungThaiTue = CHI_CUNG[chiNam] || 0;
    const chiXung = DIA_CHI_LUC_XUNG[chiNam] || '';
    const cungTuePha = chiXung ? (CHI_CUNG[chiXung] || 0) : 0;
    return {
      thaiTue: { chi: chiNam, cung: cungThaiTue },
      tuePha:  { chi: chiXung, cung: cungTuePha },
      desc: `Thái Tuế: ${chiNam}(cung ${cungThaiTue}), Tuế Phá: ${chiXung}(cung ${cungTuePha})`
    };
  }

  // ============================================================
  // 13. TAM NGUYÊN
  // ============================================================
  const NGUYEN_MAP = {
    'Giáp Tý':'Thượng nguyên','Giáp Ngọ':'Thượng nguyên',
    'Giáp Thân':'Trung nguyên','Giáp Dần':'Trung nguyên',
    'Giáp Tuất':'Hạ nguyên','Giáp Thìn':'Hạ nguyên'
  };

  function tinhTamNguyen(tuanThu) {
    return NGUYEN_MAP[tuanThu] || 'Không xác định';
  }

  // ============================================================
  // 14. TIẾT KHÍ
  // ============================================================
  const TIET_KHI_ORDER = [
    {ten:'Xuân Phân',goc:0},{ten:'Thanh Minh',goc:15},
    {ten:'Cốc Vũ',goc:30},{ten:'Lập Hạ',goc:45},
    {ten:'Tiểu Mãn',goc:60},{ten:'Mang Chủng',goc:75},
    {ten:'Hạ Chí',goc:90},{ten:'Tiểu Thử',goc:105},
    {ten:'Đại Thử',goc:120},{ten:'Lập Thu',goc:135},
    {ten:'Xử Thử',goc:150},{ten:'Bạch Lộ',goc:165},
    {ten:'Thu Phân',goc:180},{ten:'Hàn Lộ',goc:195},
    {ten:'Sương Giáng',goc:210},{ten:'Lập Đông',goc:225},
    {ten:'Tiểu Tuyết',goc:240},{ten:'Đại Tuyết',goc:255},
    {ten:'Đông Chí',goc:270},{ten:'Tiểu Hàn',goc:285},
    {ten:'Đại Hàn',goc:300},{ten:'Lập Xuân',goc:315},
    {ten:'Vũ Thủy',goc:330},{ten:'Kinh Trập',goc:345}
  ];

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

  const TIET_KHI_NAME_MAP = {
    '冬至':'Đông Chí','小寒':'Tiểu Hàn','大寒':'Đại Hàn',
    '立春':'Lập Xuân','雨水':'Vũ Thủy','惊蛰':'Kinh Trập','驚蟄':'Kinh Trập',
    '春分':'Xuân Phân','清明':'Thanh Minh','谷雨':'Cốc Vũ','穀雨':'Cốc Vũ',
    '立夏':'Lập Hạ','小满':'Tiểu Mãn','小滿':'Tiểu Mãn',
    '芒种':'Mang Chủng','芒種':'Mang Chủng',
    '夏至':'Hạ Chí','小暑':'Tiểu Thử','大暑':'Đại Thử',
    '立秋':'Lập Thu','处暑':'Xử Thử','處暑':'Xử Thử','白露':'Bạch Lộ',
    '秋分':'Thu Phân','寒露':'Hàn Lộ','霜降':'Sương Giáng',
    '立冬':'Lập Đông','小雪':'Tiểu Tuyết','大雪':'Đại Tuyết',
    'Winter Solstice':'Đông Chí','Lesser Cold':'Tiểu Hàn',
    'Great Cold':'Đại Hàn','Spring Beginning':'Lập Xuân',
    'Rain Water':'Vũ Thủy','Awakening from Hibernation':'Kinh Trập',
    'Spring Equinox':'Xuân Phân','Fresh Green':'Thanh Minh',
    'Grain Rain':'Cốc Vũ','Beginning of Summer':'Lập Hạ',
    'Lesser Fullness':'Tiểu Mãn','Grain in Ear':'Mang Chủng',
    'Summer Solstice':'Hạ Chí','Lesser Heat':'Tiểu Thử',
    'Greater Heat':'Đại Thử','Beginning of Autumn':'Lập Thu',
    'End of Heat':'Xử Thử','White Dew':'Bạch Lộ',
    'Autumnal Equinox':'Thu Phân','Cold Dew':'Hàn Lộ',
    'First Frost':'Sương Giáng','Beginning of Winter':'Lập Đông',
    'Light Snow':'Tiểu Tuyết','Heavy Snow':'Đại Tuyết',
    'Đông Chí':'Đông Chí','Tiểu Hàn':'Tiểu Hàn','Đại Hàn':'Đại Hàn',
    'Lập Xuân':'Lập Xuân','Vũ Thủy':'Vũ Thủy','Kinh Trập':'Kinh Trập',
    'Xuân Phân':'Xuân Phân','Thanh Minh':'Thanh Minh','Cốc Vũ':'Cốc Vũ',
    'Lập Hạ':'Lập Hạ','Tiểu Mãn':'Tiểu Mãn','Mang Chủng':'Mang Chủng',
    'Hạ Chí':'Hạ Chí','Tiểu Thử':'Tiểu Thử','Đại Thử':'Đại Thử',
    'Lập Thu':'Lập Thu','Xử Thử':'Xử Thử','Bạch Lộ':'Bạch Lộ',
    'Thu Phân':'Thu Phân','Hàn Lộ':'Hàn Lộ','Sương Giáng':'Sương Giáng',
    'Lập Đông':'Lập Đông','Tiểu Tuyết':'Tiểu Tuyết','Đại Tuyết':'Đại Tuyết'
  };

  function mapTietKhiName(raw) {
    if (!raw) return null;
    const name = String(raw).trim();
    if (TIET_KHI_NAME_MAP[name]) return TIET_KHI_NAME_MAP[name];
    if (TIET_KHI_SOC_CUC[name]) return name;
    return null;
  }

  function tinhSoCuc(tk) {
    return TIET_KHI_SOC_CUC[tk] || { soCuc:1, type:'duong' };
  }

  function tinhJDNTietKhi(n, goc) {
    const D = Math.PI / 180;
    const j = 2451545;
    let jd = tinhJDN(n, 3, 20) + (goc / 360) * 365.25;
    for (let i = 0; i < 3; i++) {
      const T = (jd - j) / 36525;
      const L = 280.46646 + 36000.76983 * T;
      const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
      const Mr = M * D;
      const C =
        (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
        0.000289 * Math.sin(3 * Mr);
      const s = ((L + C) % 360 + 360) % 360;
      let d = goc - s;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      jd += d / 360 * 365.25;
    }
    return Math.round(jd);
  }

  const _tkCache = {};
  function buildTietKhiNam(n) {
    if (_tkCache[n]) return _tkCache[n];
    const tao = (year) => TIET_KHI_ORDER.map(t => {
      const jdn = tinhJDNTietKhi(year, t.goc);
      const info = TIET_KHI_SOC_CUC[t.ten] || { type:'duong', soCuc:1 };
      return { ten:t.ten, jdn, type:info.type, soCuc:info.soCuc };
    }).sort((a,b) => a.jdn - b.jdn);
    const result = [...tao(n - 1).slice(-6), ...tao(n)];
    _tkCache[n] = result;
    return result;
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  // ============================================================
  // 15. 3META HELPERS
  // ============================================================
  function _get3metaSolar(nam, thang, ngay, gio, phut, giay) {
    if (typeof Solar !== 'undefined' && Solar.fromYmdHms) {
      return Solar.fromYmdHms(nam, thang, ngay, gio || 0, phut || 0, giay || 0);
    }
    if (typeof ThreeMeta !== 'undefined') {
      if (ThreeMeta.Solar && ThreeMeta.Solar.fromYmdHms) {
        return ThreeMeta.Solar.fromYmdHms(nam, thang, ngay, gio || 0, phut || 0, giay || 0);
      }
    }
    return null;
  }

  function _get3metaLunar(nam, thang, ngay, gio, phut, giay) {
    const solar = _get3metaSolar(nam, thang, ngay, gio, phut, giay);
    if (solar && typeof solar.getLunar === 'function') return solar.getLunar();
    if (typeof Lunar !== 'undefined' && Lunar.fromSolar && solar) return Lunar.fromSolar(solar);
    if (typeof ThreeMeta !== 'undefined' && ThreeMeta.Lunar && ThreeMeta.Lunar.fromSolar && solar) {
      return ThreeMeta.Lunar.fromSolar(solar);
    }
    return null;
  }

  function _extractJieQiName(jqObj) {
    if (!jqObj) return '';
    if (typeof jqObj === 'string') return jqObj;
    if (typeof jqObj.getName === 'function') return jqObj.getName();
    if (jqObj.name) return jqObj.name;
    if (jqObj._name) return jqObj._name;
    if (typeof jqObj.toString === 'function') {
      const s = jqObj.toString();
      if (s && s !== '[object Object]') return s;
    }
    return '';
  }

  function _solarObjToYmdHms(solarObj) {
    if (!solarObj) return '';
    if (typeof solarObj.toYmdHms === 'function') return solarObj.toYmdHms();
    if (typeof solarObj.toYmd === 'function') return solarObj.toYmd() + ' 00:00:00';
    if (
      typeof solarObj.getYear === 'function' &&
      typeof solarObj.getMonth === 'function' &&
      typeof solarObj.getDay === 'function'
    ) {
      const y = solarObj.getYear();
      const m = solarObj.getMonth();
      const d = solarObj.getDay();
      const h = typeof solarObj.getHour === 'function' ? solarObj.getHour() : 0;
      const mi = typeof solarObj.getMinute === 'function' ? solarObj.getMinute() : 0;
      const s = typeof solarObj.getSecond === 'function' ? solarObj.getSecond() : 0;
      return `${y}-${pad2(m)}-${pad2(d)} ${pad2(h)}:${pad2(mi)}:${pad2(s)}`;
    }
    if (typeof solarObj.toString === 'function') {
      const s = solarObj.toString();
      if (s && s !== '[object Object]') return s;
    }
    return '';
  }

  function _solarObjToDate(solarObj) {
    const s = _solarObjToYmdHms(solarObj);
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(s);
    if (!m) return null;
    return new Date(
      Number(m[1]),
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4]),
      Number(m[5]),
      Number(m[6] || 0)
    );
  }

  function _tryPrevJieQi(lunar, jdn) {
    if (!lunar || typeof lunar.getPrevJieQi !== 'function') return null;
    const prevJQ = lunar.getPrevJieQi();
    if (!prevJQ) return null;
    const tkName = mapTietKhiName(_extractJieQiName(prevJQ));
    if (tkName && TIET_KHI_SOC_CUC[tkName]) {
      return {
        ten: tkName,
        jdn,
        type: TIET_KHI_SOC_CUC[tkName].type,
        soCuc: TIET_KHI_SOC_CUC[tkName].soCuc
      };
    }
    return null;
  }

  function _tryGetJieQi(lunar, jdn) {
    if (!lunar || typeof lunar.getJieQi !== 'function') return null;
    const jq = lunar.getJieQi();
    if (!jq) return null;
    const tkName = mapTietKhiName(_extractJieQiName(jq));
    if (tkName && TIET_KHI_SOC_CUC[tkName]) {
      return {
        ten: tkName,
        jdn,
        type: TIET_KHI_SOC_CUC[tkName].type,
        soCuc: TIET_KHI_SOC_CUC[tkName].soCuc
      };
    }
    return null;
  }

  function _tryJieQiTable(lunar, jdn, nam, thang, ngay, gio, phut) {
    if (!lunar || typeof lunar.getJieQiTable !== 'function') return null;
    const table = lunar.getJieQiTable();
    if (!table || typeof table !== 'object') return null;

    const targetFull = `${nam}-${pad2(thang)}-${pad2(ngay)} ${pad2(gio)}:${pad2(phut)}:59`;

    let bestTk = null;
    let bestTime = '';

    const keys = Object.keys(table);
    for (let i = 0; i < keys.length; i++) {
      const tkRaw = keys[i];
      const solarObj = table[tkRaw];
      if (!solarObj) continue;
      const sHms = _solarObjToYmdHms(solarObj);
      if (sHms && sHms <= targetFull) {
        if (!bestTime || sHms > bestTime) {
          bestTime = sHms;
          bestTk = tkRaw;
        }
      }
    }

    if (bestTk) {
      const tkName = mapTietKhiName(bestTk);
      if (tkName && TIET_KHI_SOC_CUC[tkName]) {
        return {
          ten: tkName,
          jdn,
          type: TIET_KHI_SOC_CUC[tkName].type,
          soCuc: TIET_KHI_SOC_CUC[tkName].soCuc
        };
      }
    }
    return null;
  }

  function _tryNearJieQi(lunar, jdn) {
    if (!lunar) return null;
    try {
      if (typeof lunar.getNearJieQi === 'function') {
        const jq = lunar.getNearJieQi(false, [], false);
        const tkName = mapTietKhiName(_extractJieQiName(jq));
        if (tkName && TIET_KHI_SOC_CUC[tkName]) {
          return {
            ten: tkName,
            jdn,
            type: TIET_KHI_SOC_CUC[tkName].type,
            soCuc: TIET_KHI_SOC_CUC[tkName].soCuc
          };
        }
      }
    } catch(e) {}
    try {
      if (typeof lunar.getCurrentJieQi === 'function') {
        const jq = lunar.getCurrentJieQi();
        const tkName = mapTietKhiName(_extractJieQiName(jq));
        if (tkName && TIET_KHI_SOC_CUC[tkName]) {
          return {
            ten: tkName,
            jdn,
            type: TIET_KHI_SOC_CUC[tkName].type,
            soCuc: TIET_KHI_SOC_CUC[tkName].soCuc
          };
        }
      }
    } catch(e) {}
    return null;
  }

  function tinhTietKhi(jdn, nam, thang, ngay, gio, phut) {
    const y = nam;
    const m = thang || 1;
    const d = ngay || 1;
    const h = gio == null ? 12 : gio;
    const mi = phut || 0;

    try {
      const lunar = _get3metaLunar(y, m, d, h, mi, 0);
      const r1 = _tryPrevJieQi(lunar, jdn);
      if (r1) return r1;

      const r2 = _tryGetJieQi(lunar, jdn);
      if (r2) return r2;

      const r3 = _tryJieQiTable(lunar, jdn, y, m, d, h, mi);
      if (r3) return r3;

      const r4 = _tryNearJieQi(lunar, jdn);
      if (r4) return r4;
    } catch (e) {
      // fallback gần đúng
    }

    const ls = buildTietKhiNam(y);
    let k = ls[0];
    for (let i = ls.length - 1; i >= 0; i--) {
      if (jdn >= ls[i].jdn) {
        k = ls[i];
        break;
      }
    }
    return k;
  }

  function _getJieQiSolarByName(year, targetName) {
    const candidates = [];
    const seen = new Set();
    const probes = [
      [year, 1, 15],
      [year, 2, 1],
      [year, 2, 15],
      [year, 3, 1]
    ];

    for (let i = 0; i < probes.length; i++) {
      const p = probes[i];
      const lunar = _get3metaLunar(p[0], p[1], p[2], 12, 0, 0);
      if (!lunar || typeof lunar.getJieQiTable !== 'function') continue;
      const table = lunar.getJieQiTable();
      if (!table || typeof table !== 'object') continue;

      const keys = Object.keys(table);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const mapped = mapTietKhiName(key);
        if (mapped !== targetName) continue;
        const solarObj = table[key];
        const tag = _solarObjToYmdHms(solarObj);
        if (tag && !seen.has(tag)) {
          seen.add(tag);
          candidates.push(solarObj);
        }
      }
    }

    if (!candidates.length) return null;

    // ưu tiên ứng viên có năm dương lịch đúng year
    const exactYear = candidates.filter(obj => {
      const dt = _solarObjToDate(obj);
      return dt && dt.getFullYear() === year;
    });
    if (exactYear.length) {
      exactYear.sort((a, b) => _solarObjToDate(a) - _solarObjToDate(b));
      return exactYear[0];
    }

    candidates.sort((a, b) => _solarObjToDate(a) - _solarObjToDate(b));
    return candidates[0];
  }

  // ============================================================
  // 16. TUẦN THỦ, CAN CHI, MÙA
  // ============================================================
  const TUAN_CHU = ['Giáp Tý','Giáp Tuất','Giáp Thân','Giáp Ngọ','Giáp Thìn','Giáp Dần'];
  const KHONG_VONG = {
    'Giáp Tý':['Tuất','Hợi'],'Giáp Tuất':['Thân','Dậu'],
    'Giáp Thân':['Ngọ','Mùi'],'Giáp Ngọ':['Thìn','Tỵ'],
    'Giáp Thìn':['Dần','Mão'],'Giáp Dần':['Tý','Sửu']
  };
  const TUAN_MAP = {};
  (function() {
    let s = 0;
    for (let i = 0; i < 60; i++) {
      const c = THIEN_CAN[i % 10];
      const h = DIA_CHI[i % 12];
      const cc = c + ' ' + h;
      if (c === 'Giáp') s++;
      const tc = TUAN_CHU[s - 1] || 'Giáp Tý';
      TUAN_MAP[cc] = { tuanThu:s, tuanChu:tc, khongVong:KHONG_VONG[tc] };
    }
  })();

  function tinhJDN(n, t, ng) {
    const a = Math.floor((14 - t) / 12);
    const y = n + 4800 - a;
    const m = t + 12 * a - 3;
    return ng + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  const EPOCH_JDN = 2445735;

  function tinhCanChiNgay(j) {
    const o = j - EPOCH_JDN;
    return {
      can: THIEN_CAN[((o % 10) + 10) % 10],
      chi: DIA_CHI[((o % 12) + 12) % 12]
    };
  }

  function tinhGioChi(g) {
    for (const [s,e,c] of GIO_CHI_MAP) {
      if (s === 23) {
        if (g >= 23 || g < 1) return c;
      } else {
        if (g >= s && g < e) return c;
      }
    }
    return 'Tý';
  }

  function tinhCanGio(canNgay, chiGio) {
    const goc = {
      'Giáp':0,'Kỷ':0,
      'Ất':2,'Canh':2,
      'Bính':4,'Tân':4,
      'Đinh':6,'Nhâm':6,
      'Mậu':8,'Quý':8
    };
    return THIEN_CAN[((goc[canNgay] || 0) + DIA_CHI.indexOf(chiGio)) % 10];
  }

  function tinhCanChiNamGanDung(n, t, ng) {
    const a = (t < 2 || (t === 2 && ng < 4)) ? n - 1 : n;
    return {
      can: THIEN_CAN[((a - 4) % 10 + 10) % 10],
      chi: DIA_CHI[((a - 4) % 12 + 12) % 12]
    };
  }

  function tinhCanChiNam(n, t, ng, gio, phut) {
    try {
      const current = new Date(n, t - 1, ng, gio || 0, phut || 0, 0);
      const liChunSolar = _getJieQiSolarByName(n, 'Lập Xuân');
      if (liChunSolar) {
        const liChunDate = _solarObjToDate(liChunSolar);
        if (liChunDate) {
          const a = current < liChunDate ? n - 1 : n;
          return {
            can: THIEN_CAN[((a - 4) % 10 + 10) % 10],
            chi: DIA_CHI[((a - 4) % 12 + 12) % 12]
          };
        }
      }
    } catch (e) {}
    return tinhCanChiNamGanDung(n, t, ng);
  }

  function tinhCanChiThang(canNam, tietKhi) {
    const tietIndex = {
      'Lập Xuân':0,'Vũ Thủy':0,
      'Kinh Trập':1,'Xuân Phân':1,
      'Thanh Minh':2,'Cốc Vũ':2,
      'Lập Hạ':3,'Tiểu Mãn':3,
      'Mang Chủng':4,'Hạ Chí':4,
      'Tiểu Thử':5,'Đại Thử':5,
      'Lập Thu':6,'Xử Thử':6,
      'Bạch Lộ':7,'Thu Phân':7,
      'Hàn Lộ':8,'Sương Giáng':8,
      'Lập Đông':9,'Tiểu Tuyết':9,
      'Đại Tuyết':10,'Đông Chí':10,
      'Tiểu Hàn':11,'Đại Hàn':11
    }[tietKhi] || 0;

    const startStem = {
      'Giáp':2,'Kỷ':2,
      'Ất':4,'Canh':4,
      'Bính':6,'Tân':6,
      'Đinh':8,'Nhâm':8,
      'Mậu':0,'Quý':0
    }[canNam] || 0;

    const monthBranches = ['Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi','Tý','Sửu'];
    return {
      can: THIEN_CAN[(startStem + tietIndex) % 10],
      chi: monthBranches[tietIndex]
    };
  }

  function tinhTuanThu(jdn, canNgay) {
    const lech = ((THIEN_CAN.indexOf(canNgay) % 10) + 10) % 10;
    const cc = tinhCanChiNgay(jdn - lech);
    return cc.can + ' ' + cc.chi;
  }

  function isAmCan(c) {
    return THIEN_CAN.indexOf(c) % 2 !== 0;
  }

  function adjustDayForLateZi(jdn, gio) {
    return gio >= 23 ? jdn + 1 : jdn;
  }

  function tinhMua(thang) {
    if ([2,3,4].includes(thang)) return 'Xuân';
    if ([5,6,7].includes(thang)) return 'Hạ';
    if ([8,9,10].includes(thang)) return 'Thu';
    return 'Đông';
  }

  function laTuQuyThang(thang) {
    return [3,6,9,12].includes(thang);
  }

  // ============================================================
  // 17. NGŨ HÀNH, TRẠNG THÁI
  // ============================================================
  const TRANG_THAI_MUA = {
    'Xuân': {'Mộc':'Vượng','Hỏa':'Tướng','Thổ':'Tử','Kim':'Tù','Thủy':'Hưu'},
    'Hạ':   {'Hỏa':'Vượng','Thổ':'Tướng','Kim':'Tử','Thủy':'Tù','Mộc':'Hưu'},
    'Thu':  {'Kim':'Vượng','Thủy':'Tướng','Mộc':'Tử','Hỏa':'Tù','Thổ':'Hưu'},
    'Đông': {'Thủy':'Vượng','Mộc':'Tướng','Hỏa':'Tử','Thổ':'Tù','Kim':'Hưu'},
    'Tứ Quý': {'Thổ':'Vượng','Kim':'Tướng','Thủy':'Tử','Mộc':'Tù','Hỏa':'Hưu'}
  };

  function tinhTrangThai(nguHanh, mua, laTuQuy) {
    if (laTuQuy) return (TRANG_THAI_MUA['Tứ Quý'] || {})[nguHanh] || '';
    return (TRANG_THAI_MUA[mua] || {})[nguHanh] || '';
  }

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

  // ============================================================
  // 18. ĐỊA BÀN, ẨN CAN, TRỰC PHÙ, THIÊN BÀN
  // ============================================================
  function tinhDiaBan(soCuc, isDuong) {
    const db = {};
    const order = isDuong ? [...CHIEU_THUAN] : [...CHIEU_THUAN].reverse();
    let startIdx = order.indexOf(soCuc);
    if (startIdx === -1) {
      startIdx = order.indexOf(isDuong ? 2 : 8); // cục 5
      if (startIdx === -1) startIdx = 0;
    }
    for (let i = 0; i < 8; i++) {
      db[order[(startIdx + i) % 8]] = LUC_NGHI_TAM_KY[i];
    }
    db[5] = '';
    return db;
  }

  function tinhAnCan(db) {
    const ac = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) {
        ac[c] = '';
        continue;
      }
      ac[c] = GIAP_AN_NGHI[db[c]] || '';
    }
    return ac;
  }

  function timCungTrucPhu(db, canNgay) {
    for (const [k,v] of Object.entries(db)) {
      if (Number(k) !== 5 && v === canNgay) return Number(k);
    }
    for (const [k,v] of Object.entries(db)) {
      if (Number(k) !== 5 && v === 'Mậu') return Number(k);
    }
    return 1;
  }

  function tinhThienBan(soCuc, isDuong) {
    const allStars = [
      'Thiên Bồng','Thiên Nhuế','Thiên Xung','Thiên Phụ',
      'Thiên Cầm','Thiên Tâm','Thiên Anh','Thiên Nhậm','Thiên Trụ'
    ];
    const start = soCuc - 1;
    const seq = [];
    for (let i = 0; i < 9; i++) {
      const x = isDuong ? (start + i) % 9 : ((start - i) % 9 + 9) % 9;
      if (allStars[x] !== 'Thiên Cầm') seq.push(allStars[x]);
    }
    const tb = {};
    for (let i = 0; i < CHIEU_THUAN.length; i++) {
      tb[CHIEU_THUAN[i]] = seq[i] || '';
    }
    tb[5] = '';
    tb._cungCam = isDuong ? 2 : 8;
    return tb;
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

  function tinhThienCanBan(tb, db) {
    const tcb = {};
    for (const c of CHIEU_THUAN) {
      const sao = tb[c] || '';
      const cungGoc = SAO_GOC_CUNG[sao];
      tcb[c] = (cungGoc && cungGoc !== 5) ? (db[cungGoc] || '') : '';
    }
    tcb[5] = '';
    const cc = tb._cungCam;
    if (cc) tcb._canCam = db[cc] || '';
    return tcb;
  }

  function tinhBatMon(cungTrucPhu, isDuong) {
    const bm = {};
    const order = isDuong ? [...CHIEU_THUAN] : [...CHIEU_THUAN].reverse();
    let startIdx = order.indexOf(cungTrucPhu);
    if (startIdx === -1) startIdx = 0;
    const monGoc = MON_THEO_CUNG[cungTrucPhu] || 'Hưu';
    const monStart = MON_ORDER.indexOf(monGoc);
    for (let i = 0; i < 8; i++) {
      bm[order[(startIdx + i) % 8]] = MON_ORDER[(monStart + i) % 8];
    }
    bm[5] = '';
    return bm;
  }

  function tinhBatThan(cungTrucPhu, isDuong) {
    const r = {};
    const order = isDuong ? [...CHIEU_THUAN] : [...CHIEU_THUAN].reverse();
    let startIdx = order.indexOf(cungTrucPhu);
    if (startIdx === -1) startIdx = 0;
    for (let i = 0; i < 8; i++) {
      r[order[(startIdx + i) % 8]] = BAT_THAN[i];
    }
    r[5] = '';
    return r;
  }

  function tinhTrucSu(bm) {
    for (const [c,m] of Object.entries(bm)) {
      if (m === 'Sinh') return { cung:Number(c), ten:CUNG_META[Number(c)]?.ten || '' };
    }
    return { cung:8, ten:'Cấn' };
  }

  // ============================================================
  // 19. TRƯỜNG SINH, DỊCH MÃ, MỘ KHỐ
  // ============================================================
  const TRUONG_SINH_12 = ['Trường Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'];
  const TRUONG_SINH_GOC = {
    'Mộc': { duong:'Hợi', am:'Ngọ' },
    'Hỏa': { duong:'Dần', am:'Dậu' },
    'Thổ': { duong:'Thân', am:'Tý' },
    'Kim': { duong:'Tỵ', am:'Dần' },
    'Thủy': { duong:'Thân', am:'Mão' }
  };

  function tinhTruongSinh(can, chiCung, amDuong) {
    const hanh = NGU_HANH_CAN[can];
    if (!hanh || !TRUONG_SINH_GOC[hanh]) return '';
    const gocChi = TRUONG_SINH_GOC[hanh][amDuong] || TRUONG_SINH_GOC[hanh].duong;
    const bi = DIA_CHI.indexOf(gocChi);
    const ci = DIA_CHI.indexOf(chiCung);
    if (bi === -1 || ci === -1) return '';
    const offset = amDuong === 'am'
      ? ((bi - ci) % 12 + 12) % 12
      : ((ci - bi) % 12 + 12) % 12;
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

  const DICH_MA_MAP = {
    'Thân Tý Thìn':'Dần',
    'Dần Ngọ Tuất':'Thân',
    'Tỵ Dậu Sửu':'Hợi',
    'Hợi Mão Mùi':'Tỵ'
  };

  function tinhDichMa(chiNgay) {
    for (const [k,m] of Object.entries(DICH_MA_MAP)) {
      if (k.includes(chiNgay)) return { chi:m, cung:CHI_CUNG[m] || 0 };
    }
    return { chi:'', cung:0 };
  }

  const MO_KHO_MAP = {
    'Mộc':'Mùi',
    'Hỏa':'Tuất',
    'Kim':'Sửu',
    'Thủy':'Thìn',
    'Thổ':'Tuất'
  };

  function tinhMoKho(canNgay) {
    const hanh = NGU_HANH_CAN[canNgay] || '';
    const chiMo = MO_KHO_MAP[hanh] || '';
    const cung = chiMo ? (CHI_CUNG[chiMo] || 0) : 0;
    return {
      hanh,
      chiMo,
      cung,
      desc: chiMo ? `${canNgay}(${hanh}) mộ tại ${chiMo}(cung ${cung})` : ''
    };
  }

  // ============================================================
  // 20. THẬP CAN, MÔN BỨC/CHẾ, NGŨ BẤT NGỘ THỜI
  // ============================================================
  function tinhThapCanKhacUng(thienCanBan, diaBan) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) continue;
      const ct = thienCanBan[c] || '';
      const cd = diaBan[c] || '';
      if (!ct || !cd) {
        r[c] = '';
        continue;
      }
      const ht = NGU_HANH_CAN[ct] || '';
      const hd = NGU_HANH_CAN[cd] || '';
      r[c] = (ht && hd) ? quanHeNguHanh(ht, hd) : '';
    }
    return r;
  }
  function tinhMonBucChe(batMon) {
    const r = {};
    for (let c = 1; c <= 9; c++) {
      if (c === 5) {
        r[c] = { type:'', desc:'' };
        continue;
      }
      const mon = batMon[c] || '';
      if (!mon) {
        r[c] = { type:'', desc:'' };
        continue;
      }
      const hm = NGU_HANH_MON[mon] || '';
      const hc = CUNG_META[c]?.hanh || '';
      const tenCung = CUNG_META[c]?.ten || '';

      if (tuongKhac(hm, hc)) {
        r[c] = { type:'bức', desc:`${mon}(${hm})khắc${tenCung}(${hc})` };
      } else if (tuongKhac(hc, hm)) {
        r[c] = { type:'chế', desc:`${tenCung}(${hc})khắc${mon}(${hm})` };
      } else if (tuongSinh(hm, hc)) {
        r[c] = { type:'môn sinh cung', desc:`${mon}(${hm})sinh${tenCung}(${hc})` };
      } else if (biSinh(hm, hc)) {
        r[c] = { type:'cung sinh môn', desc:`${tenCung}(${hc})sinh${mon}(${hm})` };
      } else if (dongHanh(hm, hc)) {
        r[c] = { type:'tỷ hòa', desc:`${mon}(${hm})≡${tenCung}(${hc})` };
      } else {
        r[c] = { type:'', desc:'' };
      }
    }
    return r;
  }

  function tinhNguBatNgoThoi(canNgay, canGio) {
    const hn = NGU_HANH_CAN[canNgay] || '';
    const hg = NGU_HANH_CAN[canGio] || '';
    if (tuongKhac(hg, hn)) {
      return { active:true, desc:`${canGio}(${hg})khắc${canNgay}(${hn})` };
    }
    return { active:false, desc:'' };
  }

  // ============================================================
  // 21. CÁCH CỤC
  // ============================================================
  function tinhCachCuc(tb, db, bm, bt, tcb) {
    const palacePatterns = {};
    for (let c = 1; c <= 9; c++) {
      if (c !== 5) palacePatterns[c] = [];
    }

    const auspicious = [];
    const inauspicious = [];
    const seen = {};

    const push = (cung, pattern) => {
      const key = cung + ':' + pattern.ten;
      if (seen[key]) return;
      seen[key] = true;
      palacePatterns[cung].push(pattern);
      if (pattern.loai === 'cat') auspicious.push(pattern);
      else inauspicious.push(pattern);
    };

    const tamKy = ['Ất','Bính','Đinh'];
    const catMon = ['Khai','Hưu','Sinh'];

    for (let cung = 1; cung <= 9; cung++) {
      if (cung === 5) continue;

      const sao = tb[cung] || '';
      const mon = bm[cung] || '';
      const than = bt[cung] || '';
      const ct = tcb[cung] || '';
      const cd = db[cung] || '';
      const hc = CUNG_META[cung]?.hanh || '';
      const hs = NGU_HANH_SAO[sao] || '';
      const hm = NGU_HANH_MON[mon] || '';
      const dsSao = danhSachSaoTaiCung(tb, cung);

      // Phục ngâm / phản ngâm
      if (sao === SAO_THEO_CUNG[cung] && mon === MON_THEO_CUNG[cung]) {
        push(cung, { ten:'Phục Ngâm', cung, loai:'hung' });
      }
      const cx = CUNG_XUNG[cung];
      if (cx && sao === SAO_THEO_CUNG[cx] && (bm[cx] || '') === MON_THEO_CUNG[cung]) {
        push(cung, { ten:'Phản Ngâm', cung, loai:'hung' });
      }

      // Sao ↔ cung
      if (tuongSinh(hs, hc)) push(cung, { ten:'Sao Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hs, hc)) push(cung, { ten:'Sao Khắc Cung', cung, loai:'hung' });
      if (biSinh(hs, hc))    push(cung, { ten:'Cung Sinh Sao', cung, loai:'cat' });
      if (biKhac(hs, hc))    push(cung, { ten:'Cung Khắc Sao', cung, loai:'hung' });

      // Môn ↔ cung
      if (tuongSinh(hm, hc)) push(cung, { ten:'Môn Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hm, hc)) push(cung, { ten:'Môn Bức Cung', cung, loai:'hung' });
      if (biKhac(hm, hc))    push(cung, { ten:'Cung Chế Môn', cung, loai:'hung' });

      // Cửu Độn
      if (than === 'Cửu Thiên' && mon === 'Sinh'  && dsSao.includes('Thiên Tâm'))  push(cung, { ten:'Thiên Độn', cung, loai:'cat' });
      if (than === 'Cửu Địa'   && mon === 'Khai'  && dsSao.includes('Thiên Nhậm')) push(cung, { ten:'Địa Độn', cung, loai:'cat' });
      if (than === 'Thái Âm'   && mon === 'Hưu'   && dsSao.includes('Thiên Bồng')) push(cung, { ten:'Nhân Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Khai') push(cung, { ten:'Phong Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Sinh') push(cung, { ten:'Vân Độn', cung, loai:'cat' });
      if (than === 'Cửu Địa'   && mon === 'Hưu')  push(cung, { ten:'Long Độn', cung, loai:'cat' });
      if (than === 'Cửu Thiên' && mon === 'Khai') push(cung, { ten:'Hổ Độn', cung, loai:'cat' });
      if (than === 'Cửu Thiên' && mon === 'Sinh') push(cung, { ten:'Thần Độn', cung, loai:'cat' });
      if (than === 'Đằng Xà'   && mon === 'Tử')   push(cung, { ten:'Quỷ Độn', cung, loai:'hung' });

      // Thần + Môn
      if (than === 'Cửu Địa' && mon === 'Sinh') push(cung, { ten:'Cửu Địa Sinh Môn', cung, loai:'cat' });
      if (than === 'Thái Âm' && mon === 'Hưu')  push(cung, { ten:'Thái Âm Hưu Môn', cung, loai:'cat' });

      // Hung sao + hung môn
      if (dsSao.includes('Thiên Nhuế') && mon === 'Tử') push(cung, { ten:'Thiên Nhuế Tử Môn', cung, loai:'hung' });
      if (dsSao.includes('Thiên Bồng') && mon === 'Tử') push(cung, { ten:'Thiên Bồng Tử Môn', cung, loai:'hung' });

      // Tam Trá
      if (catMon.includes(mon) && than === 'Thái Âm') push(cung, { ten:'Chân Trá', cung, loai:'cat' });
      if (tamKy.includes(ct) && catMon.includes(mon)) push(cung, { ten:'Hưu Trá', cung, loai:'cat' });
      if (tamKy.includes(ct) && ['Thái Âm','Cửu Thiên','Cửu Địa'].includes(than)) push(cung, { ten:'Trùng Trá', cung, loai:'cat' });

      // Ngũ Giả
      if (tamKy.includes(ct) && than === 'Cửu Thiên') push(cung, { ten:'Thiên Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Địa')   push(cung, { ten:'Địa Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Thái Âm' && catMon.includes(mon)) push(cung, { ten:'Nhân Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Lục Hợp')   push(cung, { ten:'Thần Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && ['Đằng Xà','Chu Tước'].includes(than)) push(cung, { ten:'Quỷ Giả', cung, loai:'hung' });

      // Thanh Long Phản Thủ / Phi Điểu Điệt Huyệt
      if (ct === 'Mậu'  && cd === 'Bính' && [7,3].includes(cung)) push(cung, { ten:'Thanh Long Phản Thủ', cung, loai:'cat' });
      if (ct === 'Bính' && cd === 'Mậu'  && [7,3].includes(cung)) push(cung, { ten:'Phi Điểu Điệt Huyệt', cung, loai:'cat' });

      // Thiên Hiển Thời Cách
      if (tamKy.includes(ct) && than === 'Trực Phù') push(cung, { ten:'Thiên Hiển Thời Cách', cung, loai:'cat' });

      // Thiên Cầm
      if (dsSao.includes('Thiên Cầm') && ['Khai','Hưu','Sinh','Cảnh'].includes(mon)) {
        push(cung, { ten:'Thiên Cầm Tứ Trương', cung, loai:'cat' });
      }
      if (dsSao.includes('Thiên Cầm') && ['Tử','Kinh','Thương','Đỗ'].includes(mon)) {
        push(cung, { ten:'Thiên Võng Tứ Trương', cung, loai:'hung' });
      }

      // Tam kỳ đắc sử
      if (ct === 'Ất'   && mon === 'Hưu')  push(cung, { ten:'Ất Kỳ Đắc Sử', cung, loai:'cat' });
      if (ct === 'Bính' && mon === 'Sinh') push(cung, { ten:'Bính Kỳ Đắc Sử', cung, loai:'cat' });
      if (ct === 'Đinh' && mon === 'Khai') push(cung, { ten:'Đinh Kỳ Đắc Sử', cung, loai:'cat' });
    }

    // Lục nghi kích hình
    const lnkh = tinhLucNghiKichHinh(db);
    for (const item of lnkh) {
      push(item.cung, { ten:'Lục Nghi Kích Hình', cung:item.cung, loai:'hung', desc:item.desc });
    }

    return {
      auspicious,
      inauspicious,
      palacePatterns
    };
  }

  // ============================================================
  // 22. LẬP BÀN TỔNG HỢP
  // ============================================================
  function lapBanKyMon(dateStr, options = {}) {
    let nam, thang, ngay, gio = 12, phut = 0;
    const pts = dateStr.split(' ');
    const dp = pts[0].split('-');
    nam = +dp[0];
    thang = +dp[1];
    ngay = +dp[2];
    if (pts[1]) {
      const tp = pts[1].split(':');
      gio = +tp[0];
      phut = +(tp[1] || 0);
    }

    const jdn = tinhJDN(nam, thang, ngay);
    const jdnAdj = adjustDayForLateZi(jdn, gio);

    const ccNgay = tinhCanChiNgay(jdnAdj);
    const canNgay = ccNgay.can;
    const chiNgay = ccNgay.chi;

    const chiGio = tinhGioChi(gio);
    const canGio = tinhCanGio(canNgay, chiGio);

    const tkInfo = tinhTietKhi(jdn, nam, thang, ngay, gio, phut);
    const ccNam = tinhCanChiNam(nam, thang, ngay, gio, phut);
    const ccThang = tinhCanChiThang(ccNam.can, tkInfo.ten);

    const isDuong = options.isDuong !== undefined ? options.isDuong : tkInfo.type === 'duong';
    const soCuc = tinhSoCuc(tkInfo.ten).soCuc;
    const tuanThu = tinhTuanThu(jdnAdj, canNgay);
    const khongVong = KHONG_VONG[tuanThu] || [];
    const mua = tinhMua(thang);
    const isTuQuyThang = laTuQuyThang(thang);

    const diaBan = tinhDiaBan(soCuc, isDuong);
    const anCan = tinhAnCan(diaBan);
    const cungTrucPhu = timCungTrucPhu(diaBan, canNgay);
    const thienBan = tinhThienBan(soCuc, isDuong);
    const thienCanBan = tinhThienCanBan(thienBan, diaBan);
    const batMon = tinhBatMon(cungTrucPhu, isDuong);
    const batThan = tinhBatThan(cungTrucPhu, isDuong);
    const zhiFu = {
      cung: cungTrucPhu,
      ten: CUNG_META[cungTrucPhu]?.ten || '',
      sao: thienBan[cungTrucPhu] || '',
      gate: batMon[cungTrucPhu] || '',
      deity: batThan[cungTrucPhu] || ''
    };
    const zhiShi = tinhTrucSu(batMon);

    const thapCan = tinhThapCanKhacUng(thienCanBan, diaBan);
    const monBucChe = tinhMonBucChe(batMon);
    const dichMa = tinhDichMa(chiNgay);
    const moKho = tinhMoKho(canNgay);
    const nguBatNgoThoi = tinhNguBatNgoThoi(canNgay, canGio);
    const cachCuc = tinhCachCuc(thienBan, diaBan, batMon, batThan, thienCanBan);

    const amDuongNgay = isAmCan(canNgay) ? 'am' : 'duong';
    const amDuongGio = isAmCan(canGio) ? 'am' : 'duong';

    const kyNghiHopXung = tinhKyNghiHopXung(thienCanBan, diaBan);
    const tamKyDacSu = tinhTamKyDacSu(thienCanBan, batMon);
    const lucNghiKichHinh = tinhLucNghiKichHinh(diaBan);
    const quyNhan = tinhQuyNhan(canNgay);
    const thaiTue = tinhThaiTue(ccNam.chi);
    const tamNguyen = tinhTamNguyen(tuanThu);

    const palaces = [];
    for (let c = 1; c <= 9; c++) {
      const meta = CUNG_META[c] || {};
      const chiCung = CHI_CHINH_CUNG[c] || '';
      const starInfo = laySaoTaiCung(thienBan, c);
      const sao = starInfo.sao;
      const mon = batMon[c] || '';
      const hanhSao = NGU_HANH_SAO[sao] || '';
      const hanhMon = NGU_HANH_MON[mon] || '';

      let noiNgoai = 'trung';
      if (NOI_BAN.includes(c)) noiNgoai = 'nội';
      if (NGOAI_BAN.includes(c)) noiNgoai = 'ngoại';

      const chiInfo = chiCung ? {
        lucHop: timLucHop(chiCung),
        lucXung: timLucXung(chiCung),
        tamHop: timTamHop(chiCung)
      } : null;

      palaces.push({
        cung: c,
        ten: meta.ten || '',
        huong: meta.huong || '',
        direction: meta.direction || '',
        que: meta.que || '',
        hanh: meta.hanh || '',

        diaBan: diaBan[c] || '',
        thienBan: sao,
        thienBanDongCung: starInfo.dongCung,
        thienCanBan: thienCanBan[c] || '',
        anCan: anCan[c] || '',
        batMon: mon,
        batThan: batThan[c] || '',

        khongVong: {
          active: khongVong.includes(chiCung),
          chiKhongVong: khongVong,
          chiCung: chiCung
        },
        noiNgoai: noiNgoai,

        trangThai: {
          sao: sao ? tinhTrangThai(hanhSao, mua, isTuQuyThang) : '',
          mon: mon ? tinhTrangThai(hanhMon, mua, isTuQuyThang) : ''
        },

        growthCycle: tinhTruongSinhChiTiet(
          canNgay,
          canGio,
          thienCanBan[c] || '',
          diaBan[c] || '',
          chiCung,
          amDuongNgay,
          amDuongGio
        ),

        thapCanKhacUng: thapCan[c] || '',
        kyNghiHopXung: kyNghiHopXung[c] || null,
        monBucChe: monBucChe[c] || { type:'', desc:'' },

        isDichMa: dichMa.cung === c,
        isMoKho: moKho.cung === c,
        isQuyNhan: quyNhan.some(q => q.cung === c),
        isThaiTue: thaiTue.thaiTue.cung === c,
        isTuePha: thaiTue.tuePha.cung === c,

        chiInfo,
        patterns: cachCuc.palacePatterns[c] || []
      });
    }

    return {
      version:'4.3.1-hado',
      timeInfo:{
        input: dateStr,
        nam, thang, ngay, gio, phut,
        dayOfWeek: new Date(nam, thang - 1, ngay).toLocaleDateString('vi-VN', { weekday:'long' }),
        julianDay: jdn
      },
      fourPillars:{
        year: ccNam,
        month: ccThang,
        day: { can:canNgay, chi:chiNgay },
        hour:{ can:canGio, chi:chiGio }
      },
      ju:{
        soCuc,
        isDuong,
        type: isDuong ? 'Dương Độn' : 'Âm Độn'
      },
      season:{
        tietKhi: tkInfo.ten,
        type: tkInfo.type,
        mua,
        isTuQuyThang
      },
      tuanThu:{
        ten: tuanThu,
        khongVong,
        tamNguyen
      },
      zhiFu,
      zhiShi,
      dichMa,
      moKho,
      nguBatNgoThoi,
      tamKyDacSu,
      lucNghiKichHinh,
      quyNhan,
      thaiTue,
      tamNguyen,
      palaces,
      hiddenStems: anCan,
      specialPatterns:{
        auspicious: cachCuc.auspicious,
        inauspicious: cachCuc.inauspicious
      },
      patterns:[...cachCuc.auspicious, ...cachCuc.inauspicious]
    };
  }

  // ============================================================
  // 23. EXPORT
  // ============================================================
  return {
    byDatetime: lapBanKyMon,
    version:'4.3.1-hado',
    utils:{
      // core
      tinhJDN,
      tinhCanChiNgay,
      tinhGioChi,
      tinhCanGio,
      tinhCanChiNam,
      tinhCanChiNamGanDung,
      tinhCanChiThang,
      tinhTietKhi,
      tinhSoCuc,
      tinhTuanThu,
      tinhMua,
      laTuQuyThang,

      // board
      tinhDiaBan,
      tinhThienBan,
      tinhThienCanBan,
      laySaoTaiCung,
      danhSachSaoTaiCung,
      tinhBatMon,
      tinhBatThan,
      tinhAnCan,
      timCungTrucPhu,
      tinhTrucSu,

      // growth / pattern
      tinhTruongSinh,
      tinhTruongSinhChiTiet,
      tinhCachCuc,
      tinhTrangThai,
      tinhThapCanKhacUng,
      tinhMonBucChe,
      tinhDichMa,
      tinhNguBatNgoThoi,
      adjustDayForLateZi,
      tinhMoKho,
      MO_KHO_MAP,

      // extra features
      timCanHop,
      tinhKyNghiHopXung,
      timLucHop,
      timLucXung,
      timTamHop,
      tinhTamKyDacSu,
      tinhLucNghiKichHinh,
      tinhQuyNhan,
      tinhThaiTue,
      tinhTamNguyen,

      // ngũ hành
      tuongSinh,
      tuongKhac,
      biKhac,
      biSinh,
      dongHanh,
      quanHeNguHanh,
      isAmCan,

      // tiết khí helpers
      tinhJDNTietKhi,
      buildTietKhiNam,
      mapTietKhiName,
      _get3metaSolar,
      _get3metaLunar,
      _getJieQiSolarByName,

      // constants
      CUNG_META,
      SAO_THEO_CUNG,
      SAO_GOC_CUNG,
      MON_THEO_CUNG,
      MON_ORDER,
      BAT_THAN,
      GIAP_AN_NGHI,
      THIEN_CAN_HOP,
      DIA_CHI_LUC_HOP,
      DIA_CHI_TAM_HOP,
      DIA_CHI_LUC_XUNG,
      QUY_NHAN_MAP,
      LUC_NGHI_KICH_HINH,
      NGUYEN_MAP,
      TRUONG_SINH_12,
      TRUONG_SINH_GOC,
      TIET_KHI_ORDER,
      TIET_KHI_SOC_CUC,
      TIET_KHI_NAME_MAP,
      LUC_NGHI_TAM_KY,
      KHONG_VONG,
      TUAN_CHU,
      TUAN_MAP,
      CHI_CUNG,
      CHI_CHINH_CUNG,
      CUNG_XUNG,
      NOI_BAN,
      NGOAI_BAN,
      DICH_MA_MAP,
      NGU_HANH_CAN,
      NGU_HANH_CHI,
      NGU_HANH_SAO,
      NGU_HANH_MON,
      TRANG_THAI_MUA,
      CHIEU_THUAN
    }
  };
}));

