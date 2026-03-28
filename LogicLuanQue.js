// ===================================================================
// LogicLuanQue.js (Bản hoàn chỉnh - deepseek)
// BẢNG LUẬN QUẺ - LOGIC 26 CHỦ ĐỀ
// Tương thích engine: HaDoBanKyMon v4.3.1-hado
// Đã bổ sung đầy đủ các tín hiệu, sao, thần, vượng suy, nội ngoại bàn...
// ===================================================================

(function () {
  'use strict';

  if (typeof HaDoBanKyMon === 'undefined' || !HaDoBanKyMon.utils) {
    throw new Error('Engine KyMonBanHaDo.js hoặc HaDoBanKyMon.utils không khả dụng!');
  }

  const _U = HaDoBanKyMon.utils;

  // ============================ HƯỚNG DẪN TỪNG CHỦ ĐỀ (cột trái) ============================
  // Giữ nguyên như cũ, không thay đổi
  const TOPIC_GUIDES = { /* ... giữ nguyên nội dung từ file cũ ... */ };

  // ============================ HELPER MỞ RỘNG ============================
  function getCurrentChart() { return window.__LAST_CHART || null; }

  function getPalace(chart, pos) { /* như cũ */ }
  function getAllPalaces(chart) { /* như cũ */ }
  function getStemOf(chart, pillar) { /* như cũ */ }
  function getStemElement(stemVI) { return _U.NGU_HANH_CAN[stemVI] || ''; }
  function sheng(a, b) { return _U.tuongSinh(a, b); }
  function khac(a, b) { return _U.tuongKhac(a, b); }
  function normalizeGateName(gateName) { return String(gateName || '').replace(/ ?[Mm]ôn$/, '').trim(); }

  function getEffectiveDeityName(palace, chart) {
    const raw = (palace?.batThan || '').trim();
    if (!raw) return '';
    const isDuong = !!chart?.ju?.isDuong;
    if (!isDuong) {
      if (raw === 'Câu Trận') return 'Bạch Hổ';
      if (raw === 'Chu Tước') return 'Huyền Vũ';
    }
    return raw;
  }

  function findPalaceByGate(chart, gateName) { /* như cũ */ }
  function findPalaceByStarName(chart, starName) { /* như cũ */ }
  function findPalaceByDeityName(chart, deityName) { /* như cũ */ }
  function getZhifuPalace(chart) { /* như cũ */ }
  function getZhishiPalace(chart) { /* như cũ */ }

  function isVoid(chart, palace) { /* như cũ */ }
  function getAllVoidPalaces(chart) { /* như cũ */ }

  function getHeavenlyStem(palace) { return palace?.thienCanBan || ''; }
  function getEarthlyStem(palace) { return palace?.diaBan || ''; }
  function findPalaceByHeavenlyStem(chart, stemVI) { /* như cũ */ }
  function findPalaceByEarthlyStem(chart, stemVI) { /* như cũ */ }

  function hasPattern(palace, nameSubstr) { /* như cũ */ }
  function _flattenChartPatterns(chart) { /* như cũ */ }
  function hasGlobalPattern(chart, nameSubstr) { /* như cũ */ }

  function hasRuMu(palace) {
    if (!palace) return false;
    if (palace.isMoKho === true) return true;
    return hasPattern(palace, 'Nhập Mộ') || hasPattern(palace, 'nhập mộ');
  }

  function palaceName(pos) { /* như cũ */ }
  const PALACE_META = { /* như cũ */ };
  function palaceMeta(pos) { return PALACE_META[Number(pos)] || { direction: '', trigram: '' }; }

  function palaceSummary(p, chart) { /* như cũ */ }

  function getRelation(stemA, stemB) { /* như cũ */ }
  function relType(rel) { /* như cũ */ }

  // --- Bổ sung helper xét vượng/suy (dùng bảng Trường Sinh) ---
  function isProsperous(palace, stem) {
    if (!palace || !stem) return false;
    const growth = palace.growthCycle || {};
    const stage = growth.dayStem || growth.hourStem || '';
    const strongStages = ['Lâm Quan', 'Đế Vượng', 'Trường Sinh'];
    return strongStages.some(s => stage.includes(s));
  }

  // --- Bổ sung helper lấy cung của một can ở thiên bàn hoặc địa bàn ---
  function findPalaceByStemOnHeaven(chart, stem) {
    return getAllPalaces(chart).find(p => (p.thienCanBan || '') === stem) || null;
  }
  function findPalaceByStemOnEarth(chart, stem) {
    return getAllPalaces(chart).find(p => (p.diaBan || '') === stem) || null;
  }

  // --- Bổ sung helper phân biệt nội/ngoại bàn ---
  function isInner(palace) { return palace?.noiNgoai === 'nội'; }
  function isOuter(palace) { return palace?.noiNgoai === 'ngoại'; }

  // --- Helper lấy sao trong cung (chính + đồng cung) ---
  function getStarNames(palace) {
    let star = palace?.thienBan || '';
    if (palace?.thienBanDongCung) star += ' / ' + palace.thienBanDongCung;
    return star;
  }

  // ============================ UI HELPERS ============================
  function h(s) { /* như cũ */ }
  function line(label, value, type) { /* như cũ */ }
  function section(title) { /* như cũ */ }
  function note(text) { /* như cũ */ }

  // ============================ HƯỚNG DẪN CỘT TRÁI ============================
  function renderTopicGuide(topicId) { /* như cũ */ }

  // ============================ ANALYZERS CẢI TIẾN ============================
  const TOPIC_ANALYZERS = {};

  // 1. Cơ thể (bổ sung bộ phận đầy đủ, nhấn mạnh khắc)
  TOPIC_ANALYZERS[1] = function(chart) {
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const bodyMap = {
      'Giáp':['Đầu','Gan','Túi mật'],
      'Ất':['Gan','Túi mật','Thực quản','Cổ họng','Hệ thần kinh'],
      'Bính':['Ruột non','Môi','Vai','Trán'],
      'Đinh':['Răng','Tim','Mắt','Trào ngược','Bốc hỏa'],
      'Mậu':['Cơ bụng','Bao tử','Mũi'],
      'Kỷ':['Mắt','Tỳ','Tạng','Miệng','Bụng'],
      'Canh':['Xương','Sườn','Ruột già'],
      'Tân':['Bụng','Phổi','Phế quản','Ngực','Cổ'],
      'Nhâm':['Tim mạch','Bàng quang','Máu','Hệ thực vật'],
      'Quý':['Thần kinh','Chân','Thận']
    };
    let html = section('⚙️ Can Ngày & Bộ phận');
    html += line('Can ngày', `${dayHS} → ${(bodyMap[dayHS] || []).join(', ') || '—'}`, 'info');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    if (pDay) {
      html += line('Cung can ngày', palaceSummary(pDay, chart), isVoid(chart,pDay) || hasRuMu(pDay) ? 'bad' : 'neutral');
      if (isVoid(chart,pDay)) html += line('⚠️ Không vong', `${(bodyMap[dayHS] || []).join(', ')} có vấn đề`, 'bad');
      if (hasRuMu(pDay)) html += line('⚠️ Nhập mộ', 'Bộ phận liên quan đang trầm trọng', 'bad');
    }
    html += section('⚙️ Can Giờ & Bộ phận');
    html += line('Can giờ', `${hourHS} → ${(bodyMap[hourHS] || []).join(', ') || '—'}`, 'info');
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    if (pHour) {
      html += line('Cung can giờ', palaceSummary(pHour, chart), isVoid(chart,pHour) ? 'bad' : 'neutral');
      if (isVoid(chart,pHour)) html += line('⚠️ Không vong', `${(bodyMap[hourHS] || []).join(', ')} có vấn đề`, 'bad');
    }
    html += section('📋 Tất cả can thiên bàn có vấn đề');
    let found = false;
    for (const p of getAllPalaces(chart)) {
      const hs = p.thienCanBan || '';
      if (!hs) continue;
      const vp = isVoid(chart,p);
      const mp = hasRuMu(p);
      const esEl = getStemElement(p.diaBan || '');
      const hsEl = getStemElement(hs);
      const isK = hsEl && esEl && khac(esEl, hsEl);
      if (vp || mp || isK) {
        const issues = [];
        if (vp) issues.push('Không vong');
        if (mp) issues.push('Nhập mộ');
        if (isK) issues.push(`Bị khắc (${p.diaBan} khắc ${hs})`);
        html += line(`⚠️ ${hs} – ${(bodyMap[hs] || []).join(', ')}`, issues.join(' · '), 'bad');
        found = true;
      }
    }
    if (!found) html += note('Không phát hiện can thiên bàn nào bị vấn đề. Sức khỏe tổng thể ổn.');
    return html;
  };

  // 2. Nghề nghiệp (bổ sung sao Thiên Nhậm, Thiên Cầm, Thiên Anh, Thiên Nhuế; Thái Tuế)
  TOPIC_ANALYZERS[2] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const yearHS = getStemOf(chart,'year');
    const pKhai = findPalaceByGate(chart,'Khai');
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pDo = findPalaceByGate(chart,'Đỗ');
    const pZF = getZhifuPalace(chart);
    const pThaiTue = findPalaceByEarthlyStem(chart, chart?.fourPillars?.year?.chi || '');

    let html = section('👤 Thông tin');
    html += line('Can ngày (người hỏi)', dayHS || '—', 'info');
    html += line('Can năm (quản lý)', yearHS || '—', 'info');
    if (pThaiTue) {
      const rel = getRelation(dayHS, getHeavenlyStem(pThaiTue));
      html += line('Thái Tuế (sếp siêu lớn)', palaceSummary(pThaiTue, chart), 'info');
      html += line('Can ngày ↔ Thái Tuế', rel.label, relType(rel.rel));
    }
    html += section('🏢 Sự nghiệp – Khai Môn');
    if (pKhai) {
      const vk = isVoid(chart,pKhai);
      const mk = hasRuMu(pKhai);
      const pk = hasPattern(pKhai,'Phản Ngâm');
      const fk = hasPattern(pKhai,'Phục Ngâm');
      html += line('Khai Môn tại', palaceSummary(pKhai,chart), vk || mk ? 'bad' : 'good');
      if (vk) html += line('❌ Không vong', 'Nguy cơ chấm dứt công việc', 'bad');
      if (mk) html += line('❌ Nhập mộ', 'Có sai phạm trong công việc', 'bad');
      if (pk) html += line('⚡ Phản ngâm', 'Công việc thay đổi lớn', 'neutral');
      if (fk) html += line('⏳ Phục ngâm', 'Công việc trì trệ', 'bad');
      if (!vk && !mk && !pk && !fk) html += line('✅ Bình thường', 'Sự nghiệp ổn định', 'good');
    }
    html += section('💰 Tiền tài – Sinh Môn');
    if (pSinh) {
      const vs = isVoid(chart,pSinh);
      html += line('Sinh Môn', palaceSummary(pSinh,chart), vs ? 'bad' : 'good');
      if (vs) html += line('❌ Không vong', 'Tài chính hao hụt', 'bad');
    }
    html += section('👔 Quan hệ cấp trên – Trực Phù');
    if (pZF) {
      const zfHS = getHeavenlyStem(pZF);
      const rel = getRelation(dayHS, zfHS);
      html += line('Trực Phù', palaceSummary(pZF,chart), 'info');
      html += line('Can ngày ↔ Trực Phù', rel.label, relType(rel.rel));
    }
    html += section('🌟 Sao nổi bật');
    for (const p of getAllPalaces(chart)) {
      const s = p.thienBan || '';
      if (s.includes('Thiên Phụ')) html += line('Thiên Phụ', `Cung ${palaceName(p.cung)} – Môi trường dễ chịu`, 'good');
      if (s.includes('Thiên Tâm')) html += line('Thiên Tâm', `Cung ${palaceName(p.cung)} – Sếp giỏi`, 'good');
      if (s.includes('Thiên Bồng')) html += line('Thiên Bồng', `Cung ${palaceName(p.cung)} – Bị sếp chèn ép`, 'bad');
      if (s.includes('Thiên Xung')) html += line('Thiên Xung', `Cung ${palaceName(p.cung)} – Áp lực lớn`, 'bad');
      if (s.includes('Thiên Nhậm')) html += line('Thiên Nhậm', `Cung ${palaceName(p.cung)} – Hỗ trợ từ cấp trên và cấp dưới`, 'good');
      if (s.includes('Thiên Cầm')) html += line('Thiên Cầm', `Cung ${palaceName(p.cung)} – Sếp giỏi (cầm tinh)`, 'good');
      if (s.includes('Thiên Anh')) html += line('Thiên Anh', `Cung ${palaceName(p.cung)} – Môi trường làm việc dễ dãi`, 'neutral');
      if (s.includes('Thiên Nhuế')) html += line('Thiên Nhuế', `Cung ${palaceName(p.cung)} – Sếp tham vọng`, 'neutral');
    }
    return html;
  };

  // 3. Thăng chức (bổ sung Thái Tuế, Can năm)
  TOPIC_ANALYZERS[3] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const pKhai = findPalaceByGate(chart,'Khai');
    const pDo = findPalaceByGate(chart,'Đỗ');
    const pZF = getZhifuPalace(chart);
    const pThaiTue = findPalaceByEarthlyStem(chart, chart?.fourPillars?.year?.chi || '');
    const pYear = findPalaceByHeavenlyStem(chart, getStemOf(chart,'year'));

    let html = section('📋 Thăng chức – Khai Môn');
    if (pKhai) {
      const vk = isVoid(chart,pKhai), mk = hasRuMu(pKhai);
      html += line('Khai Môn', palaceSummary(pKhai,chart), vk || mk ? 'bad' : 'good');
      if (!vk && !mk) html += line('✅ Có khả năng thăng chức', '', 'good');
      if (vk) html += line('❌ Không vong', 'Chưa có quyết định', 'bad');
      if (mk) html += line('❌ Nhập mộ', 'Bị trì hoãn', 'bad');
    }
    if (pDo) {
      html += section('📂 Người push hồ sơ – Đỗ Môn');
      html += line('Đỗ Môn', palaceSummary(pDo,chart), isVoid(chart,pDo) ? 'bad' : 'neutral');
      const rel = getRelation(dayHS, getHeavenlyStem(pDo));
      html += line('Can ngày ↔ Đỗ Môn', rel.label, relType(rel.rel));
    }
    if (pZF) {
      html += section('👔 Cấp trên – Trực Phù');
      const rel = getRelation(dayHS, getHeavenlyStem(pZF));
      html += line('Trực Phù', palaceSummary(pZF,chart), 'info');
      html += line('Can ngày ↔ Trực Phù', rel.label, relType(rel.rel));
    }
    if (pThaiTue) {
      html += section('🏛️ Sếp siêu lớn – Thái Tuế');
      const rel = getRelation(dayHS, getHeavenlyStem(pThaiTue));
      html += line('Thái Tuế', palaceSummary(pThaiTue,chart), 'info');
      html += line('Can ngày ↔ Thái Tuế', rel.label, relType(rel.rel));
    }
    if (pYear) {
      html += section('📌 Quản lý – Can năm');
      const rel = getRelation(dayHS, getHeavenlyStem(pYear));
      html += line('Can năm', palaceSummary(pYear,chart), 'info');
      html += line('Can ngày ↔ Can năm', rel.label, relType(rel.rel));
    }
    return html;
  };

  // 4. Tìm kiếm người dẫn đường (giữ nguyên)
  TOPIC_ANALYZERS[4] = function(chart) { /* như cũ */ };

  // 5. Chuyển việc (giữ nguyên)
  TOPIC_ANALYZERS[5] = function(chart) { /* như cũ */ };

  // 6. Xin việc (giữ nguyên)
  TOPIC_ANALYZERS[6] = function(chart) { /* như cũ */ };

  // 7. Mua hàng (bổ sung vượng/suy can giờ)
  TOPIC_ANALYZERS[7] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    let html = section('🛒 Mua hàng');
    html += line('Can ngày (người mua)', `${dayHS} (${getStemElement(dayHS)})`, 'info');
    html += line('Can giờ (sản phẩm)', `${hourHS} (${getStemElement(hourHS)})`, 'info');
    const rel = getRelation(hourHS, dayHS);
    html += line('Sản phẩm ↔ Người mua', rel.label, relType(rel.rel));
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    if (pHour) {
      const pros = isProsperous(pHour, hourHS);
      if (pros) html += line('✅ Can giờ vượng', 'Sản phẩm tốt, phù hợp thị trường', 'good');
      else html += line('⚠️ Can giờ suy', 'Sản phẩm chưa tối ưu', 'neutral');
    }
    const pCanh = findPalaceByGate(chart,'Cảnh');
    if (pCanh) {
      html += section('🏪 Thị trường – Cảnh Môn');
      html += line('Cảnh Môn', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'neutral');
    }
    return html;
  };

  // 8. Bán hàng (bổ sung các quan hệ sinh/khắc với Sinh Môn, Mậu)
  TOPIC_ANALYZERS[8] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pZS = getZhishiPalace(chart);
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');

    let html = section('🏪 Bán hàng');
    html += line('Can ngày (người bán)', dayHS, 'info');
    html += line('Can giờ (sản phẩm)', hourHS, 'info');
    if (pZS) {
      const rel = getRelation(dayHS, getHeavenlyStem(pZS));
      html += line('Can ngày ↔ Trực Sử (khách)', rel.label, relType(rel.rel));
    }
    if (pSinh) {
      html += section('💰 Lợi nhuận – Sinh Môn');
      html += line('Sinh Môn', palaceSummary(pSinh,chart), isVoid(chart,pSinh) ? 'bad' : 'good');
      const relHourSinh = getRelation(hourHS, getHeavenlyStem(pSinh));
      if (relHourSinh.rel === 'a_sinh_b') html += line('📈 Can giờ sinh Sinh Môn', 'Có lợi nhuận', 'good');
      const relSinhHour = getRelation(getHeavenlyStem(pSinh), hourHS);
      if (relSinhHour.rel === 'a_sinh_b') html += line('📈 Sinh Môn sinh can giờ', 'Có lợi nhuận', 'good');
      if (relHourSinh.rel === 'a_khac_b') html += line('❌ Can giờ khắc Sinh Môn', 'Không có lợi nhuận', 'bad');
    }
    if (pMau) {
      const relHourMau = getRelation(hourHS, getHeavenlyStem(pMau));
      if (relHourMau.rel === 'a_khac_b') html += line('❌ Can giờ khắc Mậu (vốn)', 'Không có lợi nhuận', 'bad');
    }
    const relDayHour = getRelation(dayHS, hourHS);
    if (relDayHour.rel === 'a_sinh_b') html += line('📌 Can ngày sinh can giờ', 'Nắm chủ động, có thể thiếu nguồn cung', 'neutral');
    if (relDayHour.rel === 'a_khac_b') html += line('⚠️ Can ngày khắc can giờ', 'Bán chậm, vấn đề từ người bán', 'bad');
    if (relDayHour.rel === 'b_khac_a') html += line('⚠️ Can giờ khắc can ngày', 'Sản phẩm không hợp người bán', 'bad');
    return html;
  };

  // 9. Mở kinh doanh (bổ sung các thần Bạch Hổ, Câu Trận, Cửu Địa, Cửu Thiên)
  TOPIC_ANALYZERS[9] = function(chart) {
    const pKhai = findPalaceByGate(chart,'Khai');
    let html = section('🚀 Mở kinh doanh – Khai Môn');
    if (!pKhai) {
      html += note('Không tìm thấy Khai Môn.');
      return html;
    }
    html += line('Khai Môn', palaceSummary(pKhai,chart), isVoid(chart,pKhai) ? 'bad' : 'good');
    if (isVoid(chart,pKhai)) html += line('❌ Không vong', 'Không nên khởi sự', 'bad');
    if (hasRuMu(pKhai)) html += line('❌ Nhập mộ', 'Rủi ro cao', 'bad');
    const deity = getEffectiveDeityName(pKhai, chart);
    html += section('🔮 Thần đi cùng');
    if (deity.includes('Trực Phù')) html += line('✅ Trực Phù', 'Được hỗ trợ', 'good');
    if (deity.includes('Thái Âm')) html += line('✅ Thái Âm', 'Khách quay lại', 'good');
    if (deity.includes('Lục Hợp')) html += line('✅ Lục Hợp', 'Có hợp tác', 'good');
    if (deity.includes('Đằng Xà')) html += line('⚠️ Đằng Xà', 'Vấn đề pháp lý / rối rắm', 'bad');
    if (deity.includes('Huyền Vũ')) html += line('❌ Huyền Vũ', 'Dễ thất thoát / gian trá', 'bad');
    if (deity.includes('Bạch Hổ') || deity.includes('Câu Trận')) html += line('❌ Bạch Hổ/Câu Trận', 'Bế tắc, mệt mỏi', 'bad');
    if (deity.includes('Cửu Địa')) html += line('⏳ Cửu Địa', 'Chậm', 'neutral');
    if (deity.includes('Cửu Thiên')) html += line('✅ Cửu Thiên', 'Bán tốt, có danh tiếng', 'good');
    return html;
  };

  // 10. Hợp tác (giữ nguyên)
  TOPIC_ANALYZERS[10] = function(chart) { /* như cũ */ };

  // 11. Mua bán BĐS (bổ sung Cửu Địa, Cửu Thiên, Thiên Tâm)
  TOPIC_ANALYZERS[11] = function(chart) {
    let html = '';
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pTu = findPalaceByGate(chart,'Tử');
    const pCanh = findPalaceByGate(chart,'Cảnh');
    const pMau = findPalaceByHeavenlyStem(chart,'Mậu');
    const pThienTam = findPalaceByStarName(chart,'Thiên Tâm');
    html += section('🏠 Nhà – Sinh Môn');
    if (pSinh) html += line('Sinh Môn', palaceSummary(pSinh,chart), isVoid(chart,pSinh) ? 'bad' : 'good');
    html += section('🌍 Đất – Tử Môn');
    if (pTu) html += line('Tử Môn', palaceSummary(pTu,chart), isVoid(chart,pTu) ? 'bad' : 'neutral');
    html += section('📄 Pháp lý – Cảnh Môn');
    if (pCanh) html += line('Cảnh Môn', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'good');
    html += section('💰 Vốn – Mậu');
    if (pMau) html += line('Mậu', palaceSummary(pMau,chart), isVoid(chart,pMau) ? 'bad' : 'good');
    if (pThienTam) html += section('💳 Tài chính – Thiên Tâm');
    html += line('Thiên Tâm', pThienTam ? palaceSummary(pThienTam,chart) : '—', pThienTam && !isVoid(chart,pThienTam) ? 'good' : 'neutral');
    // Cửu Địa, Cửu Thiên
    const pCuuDia = findPalaceByDeityName(chart,'Cửu Địa');
    if (pCuuDia) html += line('🏗️ Cửu Địa', `Cung ${palaceName(pCuuDia.cung)} – Dự án lớn`, 'info');
    const pCuuThien = findPalaceByDeityName(chart,'Cửu Thiên');
    if (pCuuThien) html += line('🏙️ Cửu Thiên', `Cung ${palaceName(pCuuThien.cung)} – Chung cư`, 'info');
    return html;
  };

  // 12. Đi vay, cho vay (giữ nguyên)
  TOPIC_ANALYZERS[12] = function(chart) { /* như cũ */ };

  // 13. Đòi nợ (bổ sung Thái ất – tạm dùng Thiên Ất)
  TOPIC_ANALYZERS[13] = function(chart) {
    const pThuong = findPalaceByGate(chart,'Thương');
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pThaiAt = findPalaceByStarName(chart,'Thiên Ất'); // không có trong engine, có thể bỏ qua
    let html = section('💼 Đòi nợ – Thương Môn');
    if (pThuong) {
      html += line('Thương Môn', palaceSummary(pThuong,chart), isVoid(chart,pThuong) ? 'bad' : 'good');
      if (isVoid(chart,pThuong)) html += line('❌ Không vong', 'Khó tiến triển', 'bad');
    }
    if (pSinh) {
      html += section('💰 Khoản tiền – Sinh Môn');
      html += line('Sinh Môn', palaceSummary(pSinh,chart), isVoid(chart,pSinh) ? 'bad' : 'good');
    }
    return html;
  };

  // 14. Thi đấu (bổ sung chủ nhà/đội khách)
  TOPIC_ANALYZERS[14] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    let html = section('⚔️ Thi đấu');
    const rel = getRelation(dayHS, hourHS);
    html += line('Can ngày ↔ Can giờ', rel.label, relType(rel.rel));
    // Chủ nhà (địa bàn) – đội khách (thiên bàn) của can giờ
    const pHourHeaven = findPalaceByHeavenlyStem(chart, hourHS);
    const pHourEarth = findPalaceByEarthlyStem(chart, hourHS);
    if (pHourEarth) html += line('🏠 Chủ nhà', `${hourHS} tại địa bàn cung ${palaceName(pHourEarth.cung)}`, 'info');
    if (pHourHeaven) html += line('✈️ Đội khách', `${hourHS} tại thiên bàn cung ${palaceName(pHourHeaven.cung)}`, 'info');
    const pZF = getZhifuPalace(chart);
    if (pZF) {
      const relZF = getRelation(dayHS, getHeavenlyStem(pZF));
      html += line('Trọng tài (Trực Phù)', relZF.label, relType(relZF.rel));
    }
    return html;
  };

  // 15. Thi cử (bổ sung Trực Phù, Can năm)
  TOPIC_ANALYZERS[15] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const pCanh = findPalaceByGate(chart,'Cảnh');
    const pZF = getZhifuPalace(chart);
    const pYear = findPalaceByHeavenlyStem(chart, getStemOf(chart,'year'));
    let html = section('📝 Thi cử – Cảnh Môn');
    if (pCanh) {
      html += line('Cảnh Môn (đề thi)', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'good');
      if (isVoid(chart,pCanh)) html += line('❌ Không vong', 'Điểm thấp', 'bad');
      const rel = getRelation(dayHS, getHeavenlyStem(pCanh));
      html += line('Can ngày ↔ Cảnh Môn', rel.label, relType(rel.rel));
    }
    if (pZF) {
      html += section('👮 Người giám sát – Trực Phù');
      html += line('Trực Phù', palaceSummary(pZF,chart), 'info');
    }
    if (pYear) {
      html += section('🏫 Trường thi – Can năm');
      html += line('Can năm', palaceSummary(pYear,chart), 'info');
    }
    return html;
  };

  // 16. Chỗ đỗ xe (giữ nguyên)
  TOPIC_ANALYZERS[16] = function(chart) { /* như cũ */ };

  // 17. Du lịch (bổ sung phương tiện, Thiên Bồng)
  TOPIC_ANALYZERS[17] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    let html = section('🧳 Du lịch');
    html += line('Can giờ (kết quả)', `${hourHS} (${getStemElement(hourHS)})`, 'info');
    if (pHour) {
      html += line('Cung can giờ', palaceSummary(pHour,chart), isVoid(chart,pHour) ? 'bad' : 'good');
      if (isVoid(chart,pHour)) html += line('❌ Không vong', 'Chuyến đi không thuận', 'bad');
    }
    const rel = getRelation(dayHS, hourHS);
    html += line('Can ngày ↔ Can giờ', rel.label, relType(rel.rel));
    // Phương tiện
    const pCanh = findPalaceByGate(chart,'Cảnh');
    const pHuu = findPalaceByGate(chart,'Hưu');
    const pCuuThien = findPalaceByDeityName(chart,'Cửu Thiên');
    const pKhai = findPalaceByGate(chart,'Khai');
    const pThuong = findPalaceByGate(chart,'Thương');
    if (pCanh) html += line('🚗 Phương tiện', 'Đường bộ (Cảnh Môn)', 'info');
    else if (pHuu) html += line('🚤 Phương tiện', 'Đường thủy (Hưu Môn)', 'info');
    else if (pCuuThien || pKhai) html += line('✈️ Phương tiện', 'Hàng không (Cửu Thiên/Khai Môn)', 'info');
    else if (pThuong) html += line('🚌 Phương tiện', 'Phương tiện công cộng (Thương Môn)', 'info');
    // Trở ngại
    const pBon = findPalaceByStarName(chart,'Thiên Bồng');
    if (pBon) html += line('⚠️ Thiên Bồng', `Cung ${palaceName(pBon.cung)} – Có trở ngại`, 'bad');
    return html;
  };

  // 18. Hôn nhân (bổ sung các thần, can năm sinh)
  TOPIC_ANALYZERS[18] = function(chart) {
    const pAt = findPalaceByHeavenlyStem(chart,'Ất');
    const pCanh = findPalaceByHeavenlyStem(chart,'Canh');
    const pLH = findPalaceByDeityName(chart,'Lục Hợp');
    const yearStem = getStemOf(chart,'year');
    const pYear = findPalaceByHeavenlyStem(chart, yearStem);
    let html = section('👫 Hôn nhân');
    if (pAt) html += line('Ất (vợ)', palaceSummary(pAt,chart), isVoid(chart,pAt) ? 'bad' : 'neutral');
    if (pCanh) html += line('Canh (chồng)', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'neutral');
    if (pAt && pCanh) {
      const rel = getRelation('Ất','Canh');
      html += line('Ất ↔ Canh', rel.label, relType(rel.rel));
    }
    if (pLH) {
      html += section('💍 Lục Hợp');
      html += line('Lục Hợp', palaceSummary(pLH,chart), isVoid(chart,pLH) ? 'bad' : 'good');
    }
    if (pYear) {
      html += section('📆 Trạng thái cá nhân – Can năm sinh');
      html += line('Can năm sinh', `${yearStem} tại cung ${palaceName(pYear.cung)}`, 'info');
    }
    html += section('🔮 Tín hiệu');
    for (const p of getAllPalaces(chart)) {
      const d = getEffectiveDeityName(p, chart);
      if (d.includes('Huyền Vũ')) html += line('❌ Huyền Vũ', `Cung ${palaceName(p.cung)} – Lừa dối / khuất tất`, 'bad');
      if (d.includes('Đằng Xà')) html += line('⚠️ Đằng Xà', `Cung ${palaceName(p.cung)} – Thiếu tin tưởng / nghi hoặc`, 'bad');
      if (d.includes('Chu Tước')) html += line('⚠️ Chu Tước', `Cung ${palaceName(p.cung)} – Thiếu tin tưởng`, 'bad');
      if (d.includes('Bạch Hổ') || d.includes('Câu Trận')) html += line('❌ Bạch Hổ/Câu Trận', `Cung ${palaceName(p.cung)} – Mất mát, tai nạn`, 'bad');
      if (d.includes('Cửu Địa')) html += line('🌱 Cửu Địa', `Cung ${palaceName(p.cung)} – Cá nhân`, 'neutral');
      if (d.includes('Cửu Thiên')) html += line('⚡ Cửu Thiên', `Cung ${palaceName(p.cung)} – Nhanh chóng, bất ngờ`, 'neutral');
      if (d.includes('Trực Phù') || d.includes('Thái Âm') || d.includes('Lục Hợp')) html += line('✅ Tốt', `${d} ở cung ${palaceName(p.cung)}`, 'good');
    }
    return html;
  };

  // 19. Sinh nở (giới tính) – bổ sung dùng cửu tinh
  TOPIC_ANALYZERS[19] = function(chart) {
    const pKhon = getPalace(chart,2);
    let html = section('👶 Giới tính – Cung Khôn');
    if (!pKhon) {
      html += note('Không tìm thấy cung Khôn.');
      return html;
    }
    html += line('Cung Khôn', palaceSummary(pKhon,chart), 'info');
    const gate = pKhon.batMon || '';
    const star = pKhon.thienBan || '';
    const yang = ['Khai','Sinh','Thương','Đỗ'];
    const yangStar = ['Thiên Xung','Thiên Phụ','Thiên Anh','Thiên Tâm','Thiên Cầm'];
    let male = false, female = false;
    if (yang.includes(gate)) male = true;
    else female = true;
    if (yangStar.some(s => star.includes(s))) male = true;
    else if (star) female = true;
    if (male && !female) html += line('✅ Môn Dương & tinh Dương', `→ NAM`, 'good');
    else if (female && !male) html += line('🌸 Môn Âm & tinh Âm', `→ NỮ`, 'info');
    else if (male && female) html += line('⚠️ Hỗn hợp', 'Cần thêm yếu tố khác', 'neutral');
    else html += line('⚠️ Không rõ', '', 'neutral');
    html += note('Mang tính tham khảo.');
    return html;
  };

  // 20. Sinh nở (bổ sung chi tiết quan hệ)
  TOPIC_ANALYZERS[20] = function(chart) {
    const pKhon = getPalace(chart,2);
    const pNhue = findPalaceByStarName(chart,'Thiên Nhuế');
    let html = section('🤰 Sinh nở – Cung Khôn');
    if (!pKhon) {
      html += note('Không tìm thấy cung Khôn.');
      return html;
    }
    html += line('Cung Khôn (mẹ)', palaceSummary(pKhon,chart), 'info');
    const deityKhon = getEffectiveDeityName(pKhon, chart);
    if (deityKhon.includes('Bạch Hổ')) html += line('⚡ Bạch Hổ', 'Sinh nhanh / sinh gấp', 'neutral');
    if (hasPattern(pKhon,'Phục Ngâm')) html += line('⏳ Phục ngâm', 'Sinh kéo dài', 'bad');
    if (pNhue) {
      html += section('🔬 Thiên Nhuế ↔ Cung Khôn');
      html += line('Thiên Nhuế', palaceSummary(pNhue,chart), 'info');
      const starKhon = pKhon.thienBan || '';
      const nhueStar = pNhue.thienBan || '';
      // Quan hệ Thiên Nhuế (mẹ) và sao cung Khôn (em bé)
      const hanhNhue = _U.NGU_HANH_SAO[nhueStar] || '';
      const hanhBaby = _U.NGU_HANH_SAO[starKhon] || '';
      if (hanhNhue && hanhBaby) {
        if (khac(hanhNhue, hanhBaby)) html += line('✅ Thiên Nhuế khắc sao em bé', 'Tốt, an toàn', 'good');
        if (sheng(hanhBaby, hanhNhue)) html += line('⏳ Sao em bé sinh Thiên Nhuế', 'Sinh lâu', 'neutral');
        if (khac(hanhBaby, hanhNhue)) html += line('⚠️ Sao em bé khắc Thiên Nhuế', 'Nguy hiểm', 'bad');
      }
      // Cung Thiên Nhuế khắc cung Khôn
      const cungNhue = pNhue.cung;
      const cungKhon = pKhon.cung;
      const hanhCungNhue = _U.CUNG_META[cungNhue]?.hanh || '';
      const hanhCungKhon = _U.CUNG_META[cungKhon]?.hanh || '';
      if (khac(hanhCungNhue, hanhCungKhon)) html += line('✅ Cung Thiên Nhuế khắc cung Khôn', 'Tốt', 'good');
      // Cung Khôn khắc bát môn
      const gateKhon = pKhon.batMon || '';
      const hanhGate = _U.NGU_HANH_MON[gateKhon] || '';
      if (khac(hanhCungKhon, hanhGate)) html += line('⚠️ Cung Khôn khắc bát môn', 'Nguy hiểm, có thể phẫu thuật', 'bad');
    }
    return html;
  };

  // 21. Sức khỏe (bổ sung đầy đủ tín hiệu)
  TOPIC_ANALYZERS[21] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pNhue = findPalaceByStarName(chart,'Thiên Nhuế');
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pTu = findPalaceByGate(chart,'Tử');
    const pAt = findPalaceByHeavenlyStem(chart,'Ất');
    const pThienTam = findPalaceByStarName(chart,'Thiên Tâm');
    const pDinh = findPalaceByHeavenlyStem(chart,'Đinh');
    const pKhai = findPalaceByGate(chart,'Khai');
    const pMau = findPalaceByHeavenlyStem(chart,'Mậu');
    const pKy = findPalaceByHeavenlyStem(chart,'Kỷ');
    const pBinh = findPalaceByHeavenlyStem(chart,'Bính');
    const pNham = findPalaceByHeavenlyStem(chart,'Nhâm');
    const pQuy = findPalaceByHeavenlyStem(chart,'Quý');
    const pNhamEarth = findPalaceByEarthlyStem(chart,'Nhâm');
    const pQuyEarth = findPalaceByEarthlyStem(chart,'Quý');
    const bodyMap = {
      'Giáp':['Đầu','Gan'], 'Ất':['Gan','Cổ họng'], 'Bính':['Ruột non','Vai'], 'Đinh':['Tim','Mắt'],
      'Mậu':['Bao tử','Mũi'], 'Kỷ':['Tỳ','Bụng'], 'Canh':['Xương','Ruột già'], 'Tân':['Phổi','Ngực'],
      'Nhâm':['Tim mạch','Máu'], 'Quý':['Thận','Chân']
    };
    let html = section('🤒 Bệnh – Thiên Nhuế');
    if (pNhue) {
      html += line('Thiên Nhuế', palaceSummary(pNhue,chart), isVoid(chart,pNhue) ? 'good' : 'neutral');
      if (isVoid(chart,pNhue)) html += line('✅ Thiên Nhuế không vong', 'Bệnh mới → dễ khỏi', 'good');
    }
    // Trực Phù – loại bệnh
    const pZF = getZhifuPalace(chart);
    if (pZF) {
      const zfHS = getHeavenlyStem(pZF);
      html += section('🏥 Loại bệnh – Trực Phù');
      html += line('Trực Phù', `${zfHS} → ${(bodyMap[zfHS] || []).join(', ') || '—'}`, 'info');
    }
    html += section('⚕️ Phục hồi');
    const dayP = findPalaceByHeavenlyStem(chart, dayHS);
    if (pSinh && dayP && dayP.cung === pSinh.cung) html += line('✅ Cùng cung Sinh Môn', 'Phục hồi nhanh', 'good');
    if (pTu && dayP && dayP.cung === pTu.cung) html += line('❌ Cùng cung Tử Môn', 'Bệnh kéo dài', 'bad');
    // Thuốc
    if (pAt) html += line('🌿 Thuốc đông y', `Ất ở cung ${palaceName(pAt.cung)}`, 'info');
    if (pThienTam) html += line('💊 Tây y', `Thiên Tâm ở cung ${palaceName(pThienTam.cung)}`, 'info');
    // Phẫu thuật
    if (pDinh && pKhai) html += line('🔪 Đã phẫu thuật', `Đinh + Khai Môn`, 'neutral');
    // U bướu
    if (pMau) html += line('🪨 U bướu / sẹo', `Mậu ở cung ${palaceName(pMau.cung)}`, 'neutral');
    if (pKy) html += line('🪨 U bướu / sẹo', `Kỷ ở cung ${palaceName(pKy.cung)}`, 'neutral');
    // Viêm
    if (pBinh) html += line('🔥 Viêm', `Bính ở cung ${palaceName(pBinh.cung)}`, 'bad');
    // Máu huyết
    if (pNham || pQuy) html += line('🩸 Máu huyết', 'Nhâm/Quý hiện diện', 'bad');
    if (pNhamEarth && pQuyEarth && pNhamEarth.cung === pQuyEarth.cung) html += line('🌊 Thiên la địa võng', 'Nhâm dưới Quý', 'bad');
    html += section('🔬 Nguyên do');
    html += line('Can giờ', `${hourHS} → ${(bodyMap[hourHS] || []).join(', ') || '—'}`, 'info');
    return html;
  };

  // 22. Kiện tụng (bổ sung Đỗ Môn, Đinh, Bính, Kinh Môn, Khai Môn khắc Cảnh Môn)
  TOPIC_ANALYZERS[22] = function(chart) {
    const pKhai = findPalaceByGate(chart,'Khai');
    const pCanh = findPalaceByGate(chart,'Cảnh');
    const pLH = findPalaceByDeityName(chart,'Lục Hợp');
    const pDo = findPalaceByGate(chart,'Đỗ');
    const pDinh = findPalaceByHeavenlyStem(chart,'Đinh');
    const pBinh = findPalaceByHeavenlyStem(chart,'Bính');
    const pKinh = findPalaceByGate(chart,'Kinh');
    let html = section('⚖️ Kiện tụng – Khai Môn');
    if (pKhai) {
      html += line('Khai Môn (quan tòa)', palaceSummary(pKhai,chart), isVoid(chart,pKhai) ? 'bad' : 'good');
      if (isVoid(chart,pKhai)) html += line('⚠️ Không vong', 'Thiếu dữ liệu xét xử', 'bad');
      if (hasRuMu(pKhai)) html += line('⏳ Nhập mộ', 'Phiên tòa hoãn / trì lại', 'bad');
      if (hasPattern(pKhai,'Phục Ngâm')) html += line('⏳ Phục ngâm', 'Kéo dài', 'bad');
      if (hasPattern(pKhai,'Phản Ngâm')) html += line('⚡ Phản ngâm', 'Dời tòa', 'neutral');
      if (pCanh) {
        const rel = getRelation(getHeavenlyStem(pKhai), getHeavenlyStem(pCanh));
        if (rel.rel === 'a_khac_b') html += line('❌ Khai Môn khắc Cảnh Môn', 'Tòa không thụ lý đơn', 'bad');
      }
    }
    if (pCanh) {
      html += section('📋 Đơn kiện – Cảnh Môn');
      html += line('Cảnh Môn', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'good');
      if (isVoid(chart,pCanh) && (hasPattern(pCanh,'Đằng Xà') || hasPattern(pCanh,'Huyền Vũ')))
        html += line('⚠️ Cảnh Môn không vong có Đằng Xà/Huyền Vũ', 'Việc không đúng sự thật', 'bad');
    }
    if (pLH) {
      html += section('🔍 Bằng chứng – Lục Hợp');
      html += line('Lục Hợp', palaceSummary(pLH,chart), isVoid(chart,pLH) ? 'bad' : 'good');
      if (isVoid(chart,pLH)) html += line('❌ Không vong', 'Chưa đủ bằng chứng', 'bad');
    }
    if (pDo) html += line('🏛️ Viện kiểm soát', `Đỗ Môn ở cung ${palaceName(pDo.cung)}`, 'info');
    if (pDinh) html += line('📃 Giấy tờ, lệnh triệu tập', `Đinh ở cung ${palaceName(pDinh.cung)}`, 'info');
    if (pBinh) html += line('📸 Bằng chứng hình ảnh', `Bính ở cung ${palaceName(pBinh.cung)}`, 'info');
    if (pKinh) html += line('⚖️ Luật sư', `Kinh Môn ở cung ${palaceName(pKinh.cung)}`, 'info');
    return html;
  };

  // 23. Tố tụng hình sự (bổ sung các trường hợp)
  TOPIC_ANALYZERS[23] = function(chart) {
    const pTan = findPalaceByHeavenlyStem(chart,'Tân');
    let html = section('⚖️ Tố tụng – Can Tân');
    if (!pTan) {
      html += note('Không tìm thấy can Tân.');
      return html;
    }
    html += line('Tân tại', palaceSummary(pTan,chart), 'info');
    const deity = getEffectiveDeityName(pTan, chart);
    const gate = pTan.batMon || '';
    const star = pTan.thienBan || '';
    const patterns = pTan.patterns || [];
    if (deity.includes('Đằng Xà')) html += line('🐍 Đằng Xà', 'Lừa bịp / quanh co', 'bad');
    if (deity.includes('Huyền Vũ')) html += line('🌊 Huyền Vũ', 'Trộm cắp / khuất tất / mờ ám', 'bad');
    if (gate.includes('Đỗ')) html += line('🚪 Đỗ Môn', 'Bị giam / bị chặn', 'bad');
    if (hasPattern(pTan,'Kích Hình')) html += line('⚡ Kích hình', 'Tội nặng', 'bad');
    if (hasPattern(pTan,'Phản Ngâm') || isVoid(chart,pTan)) html += line('✅ Phản ngâm/Không vong', 'Dễ phóng thích / giảm nặng', 'good');
    const pNham = findPalaceByHeavenlyStem(chart,'Nhâm');
    const pQuy = findPalaceByHeavenlyStem(chart,'Quý');
    if (pNham || pQuy) html += line('🌊 Tân gặp Nhâm/Quý', 'Đi tù', 'bad');
    if (deity.includes('Bạch Hổ')) html += line('🐯 Bạch Hổ', 'Bị giam cầm', 'bad');
    if (star.includes('Thiên Thương')) html += line('⚔️ Tân gặp Thương', 'Đánh nhau', 'bad');
    const pMau = findPalaceByHeavenlyStem(chart,'Mậu');
    if (pMau) html += line('💰 Tân gặp Mậu', 'Vì tiền mà mang họa', 'bad');
    const pLH = findPalaceByDeityName(chart,'Lục Hợp');
    if (pLH) html += line('👥 Tân gặp Lục Hợp hoặc can tháng', 'Dễ có đồng bọn', 'bad');
    return html;
  };

  // 24. Đi lạc (bổ sung dụng thần, các tín hiệu)
  TOPIC_ANALYZERS[24] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pLH = findPalaceByDeityName(chart,'Lục Hợp');
    const pDo = findPalaceByGate(chart,'Đỗ');
    // Dụng thần – mặc định là can ngày, có thể mở rộng theo quan hệ (tạm giữ)
    const pUse = findPalaceByHeavenlyStem(chart, dayHS);
    let html = section('🧭 Đi lạc');
    if (pLH) {
      const meta = palaceMeta(pLH.cung);
      html += line('Lục Hợp (hướng đầu)', `${meta.direction || '—'}`, 'info');
    }
    if (pDo) {
      const meta = palaceMeta(pDo.cung);
      html += line('Đỗ Môn (hướng trốn)', `${meta.direction || '—'}`, 'info');
    }
    const dayP = findPalaceByHeavenlyStem(chart, dayHS);
    const hourP = findPalaceByHeavenlyStem(chart, hourHS);
    if (dayP && hourP && dayP.cung === hourP.cung) html += line('✅ Đồng cung', 'Dễ tìm thấy', 'good');
    if (hasGlobalPattern(chart,'Phục Ngâm')) html += line('⏳ Phục ngâm', 'Khó về', 'bad');
    if (hasGlobalPattern(chart,'Phản Ngâm')) html += line('✅ Phản ngâm', 'Sẽ về', 'good');
    // Dụng thần vượng có Khai, Hưu, Sinh, Đỗ
    if (pUse) {
      const gateUse = pUse.batMon || '';
      const pros = isProsperous(pUse, dayHS);
      if (pros && ['Khai','Hưu','Sinh','Đỗ'].includes(gateUse))
        html += line('⚠️ Dụng thần vượng với Khai/Hưu/Sinh/Đỗ', 'Khó tìm', 'bad');
    }
    // Các thần
    const deity = getEffectiveDeityName(pUse, chart);
    if (deity.includes('Cửu Địa') || deity.includes('Thái Âm')) html += line('🕵️ Cửu Địa/Thái Âm', 'Có người cất giấu', 'bad');
    if (deity.includes('Huyền Vũ')) html += line('🦹 Huyền Vũ', 'Bị lừa', 'bad');
    if (deity.includes('Đằng Xà')) html += line('⛓️ Đằng Xà', 'Bị bắt giữ', 'bad');
    if (deity.includes('Bạch Hổ')) html += line('💢 Bạch Hổ', 'Đề phòng bị đánh', 'bad');
    return html;
  };

  // 25. Mất đồ (bổ sung nội/ngoại bàn)
  TOPIC_ANALYZERS[25] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    let html = section('🔍 Mất đồ');
    html += line('Can ngày (chủ)', dayHS, 'info');
    html += line('Can giờ (đồ)', hourHS, 'info');
    if (pDay && pHour && pDay.cung === pHour.cung) {
      html += line('✅ Đồng cung', 'Sẽ tìm lại', 'good');
    } else {
      const rel = getRelation(hourHS, dayHS);
      html += line('Can giờ ↔ Can ngày', rel.label, relType(rel.rel));
    }
    if (pHour && isVoid(chart,pHour)) html += line('❌ Can giờ không vong', 'Khó tìm lại', 'bad');
    // Nội/ngoại bàn
    if (pDay && pHour) {
      if (isInner(pDay) && isInner(pHour)) html += line('🏠 Cả hai nội bàn', 'Mất trong nhà', 'info');
      else if (isOuter(pDay) && isOuter(pHour)) html += line('🏙️ Cả hai ngoại bàn', 'Mất ngoài nhà', 'info');
      else if (isInner(pDay) && isOuter(pHour)) html += line('🏠→🏙️ Can ngày nội, can giờ ngoại', 'Mất bên ngoài', 'info');
      else if (isOuter(pDay) && isInner(pHour)) html += line('🏙️→🏠 Can ngày ngoại, can giờ nội', 'Mất bên trong', 'info');
    }
    // Huyền Vũ
    for (const p of getAllPalaces(chart)) {
      const deity = getEffectiveDeityName(p, chart);
      if (deity.includes('Huyền Vũ')) {
        const es = p.diaBan || '';
        const yang = ['Giáp','Bính','Mậu','Canh','Nhâm'];
        if (yang.includes(es)) html += line('👨 Huyền Vũ dương', `Cung ${palaceName(p.cung)} – Đàn ông lấy`, 'bad');
        else html += line('👩 Huyền Vũ âm', `Cung ${palaceName(p.cung)} – Phụ nữ lấy`, 'bad');
      }
    }
    if (hasGlobalPattern(chart,'Phản Ngâm')) html += line('✅ Phản ngâm', 'Có thể tìm lại', 'good');
    return html;
  };

  // 26. Thời tiết (bổ sung Thiên Xung, Thiên Phụ, điều kiện mưa theo cung)
  TOPIC_ANALYZERS[26] = function(chart) {
    const WSTEM = {
      'Giáp':'Gió','Ất':'Gió','Bính':'Nóng','Đinh':'Nóng',
      'Mậu':'Mây','Kỷ':'Mây','Canh':'Băng tuyết','Tân':'Băng tuyết',
      'Nhâm':'Mưa','Quý':'Mưa'
    };
    const WSTAR = {
      'Thiên Anh':'Nắng','Thiên Phụ':'Gió','Thiên Trụ':'Mưa',
      'Thiên Bồng':'Mưa','Thiên Xung':'Sấm'
    };
    const WDEITY = {
      'Trực Phù':'Nắng','Cửu Thiên':'Nắng','Cửu Địa':'Mây',
      'Lục Hợp':'Gió','Bạch Hổ':'Gió','Huyền Vũ':'Mưa'
    };
    const wc = {};
    let html = section('☀️ Thời tiết');
    for (const p of getAllPalaces(chart)) {
      const hs = p.thienCanBan || '';
      const s = p.thienBan || '';
      const d = getEffectiveDeityName(p, chart);
      if (WSTEM[hs]) wc[WSTEM[hs]] = (wc[WSTEM[hs]] || 0) + 1;
      for (const [name, w] of Object.entries(WSTAR)) {
        if (s.includes(name)) wc[w] = (wc[w] || 0) + 1;
      }
      for (const [name, w] of Object.entries(WDEITY)) {
        if (d.includes(name)) wc[w] = (wc[w] || 0) + 1;
      }
      // Điều kiện mưa: Thiên Bồng/Trụ + Nhâm/Quý + cung Khảm/Chấn/Đoài
      const rainStar = s.includes('Thiên Bồng') || s.includes('Thiên Trụ');
      const rainStem = hs === 'Nhâm' || hs === 'Quý';
      const rainPalace = [1,3,9].includes(p.cung); // Khảm(1), Chấn(3), Đoài(9)
      if (rainStar && rainStem && rainPalace) wc['Mưa'] = (wc['Mưa'] || 0) + 2;
    }
    const sorted = Object.entries(wc).sort((a,b) => b[1] - a[1]);
    if (!sorted.length) {
      html += note('Chưa đủ dữ liệu.');
      return html;
    }
    const icon = { 'Mưa':'🌧️','Gió':'💨','Nắng':'☀️','Mây':'☁️','Sấm':'⛈️','Băng tuyết':'❄️','Nóng':'🔥' };
    for (const [w,cnt] of sorted) {
      html += line(`${icon[w] || '🌤️'} ${w}`, `${cnt} chỉ dấu${cnt >= 3 ? ' → Xác suất cao' : ''}`, cnt >= 3 ? 'bad' : cnt >= 2 ? 'neutral' : 'info');
    }
    html += `<div style="margin-top:8px;padding:6px 10px;background:#e7f7f2;border-left:4px solid #0f766e;font-weight:700;font-size:12px;color:#064e3b;">🌤️ Dự báo: ${sorted[0][0]}</div>`;
    return html;
  };

  // ============================ DISPATCHER ============================
  function analyzeByTopic(topicId, chart) { /* giữ nguyên */ }
  function runAnalysis(chartArg) { /* giữ nguyên */ }

  // ============================ ĐĂNG KÝ SỰ KIỆN ============================
  function bindUIEvents() { /* giữ nguyên */ }
  function bindChartEvents() { /* giữ nguyên */ }
  function initLogicLuanQue() { /* giữ nguyên */ }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogicLuanQue);
  } else {
    initLogicLuanQue();
  }
})();