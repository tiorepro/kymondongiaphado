// main.js

(function () {
  'use strict';

  var PALACE_META = {
    1:{direction:'Bắc',      trigram:'Khảm', element:'Thủy', color:'#2563eb', rgb:'37,99,235'},
    2:{direction:'Đông Nam', trigram:'Khôn', element:'Thổ',  color:'#a16207', rgb:'161,98,7'},
    3:{direction:'Đông',     trigram:'Chấn', element:'Mộc',  color:'#2f855a', rgb:'47,133,90'},
    4:{direction:'Tây Nam',  trigram:'Tốn',  element:'Mộc',  color:'#3f8f63', rgb:'63,143,99'},
    5:{direction:'',         trigram:'',     element:'Thổ',  color:'#7c6f64', rgb:'124,111,100'},
    6:{direction:'Tây Bắc',  trigram:'Kiền', element:'Kim',  color:'#64748b', rgb:'100,116,139'},
    7:{direction:'Nam',      trigram:'Ly',   element:'Hỏa',  color:'#c2410c', rgb:'194,65,12'},
    8:{direction:'Đông Bắc', trigram:'Cấn',  element:'Thổ',  color:'#a1743b', rgb:'161,116,59'},
    9:{direction:'Tây',      trigram:'Đoài', element:'Kim',  color:'#6b7280', rgb:'107,114,128'}
  };

  var ORDER = [2,7,4, 3,5,9, 8,1,6];

  function pad2(n){ return String(n).padStart(2, '0'); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function is3MetaReady() {
    return typeof ThreeMeta !== 'undefined';
  }

  function formatDtLocal(v){
    if(!v) return '';
    var p = String(v).split('T');
    if(p.length < 2) return '';
    var d = p[0].split('-').map(Number);
    var t = p[1].split(':').map(Number);
    if(!d[0]) return '';
    return pad2(d[2]) + '/' + pad2(d[1]) + '/' + d[0] + ' - ' + pad2(t[0] || 0) + ':' + pad2(t[1] || 0);
  }

  function dtLocalToStr(v){
    if(!v) return null;
    var p = v.split('T');
    if(p.length < 2) return null;
    var d = p[0].split('-').map(Number);
    var t = p[1].split(':').map(Number);
    return d[0] + '-' + pad2(d[1]) + '-' + pad2(d[2]) + ' ' + pad2(t[0] || 0) + ':' + pad2(t[1] || 0) + ':00';
  }

  function metaCaption(m){
    var c = [];
    if(m.direction) c.push(m.direction);
    if(m.trigram) c.push(m.trigram);
    return c.join(' · ');
  }

  function getEffectiveDeity(palace, chart) {
    var raw = (palace && palace.batThan) || '';
    if (!raw) return '';
    var isDuong = !!(chart && chart.ju && chart.ju.isDuong);
    if (!isDuong) {
      if (raw === 'Câu Trận') return 'Bạch Hổ';
      if (raw === 'Chu Tước') return 'Huyền Vũ';
    }
    return raw;
  }

  function getDisplayStar(palace) {
    if (!palace) return '';
    var star = palace.thienBan || '';
    if (palace.thienBanDongCung) {
      star += ' / ' + palace.thienBanDongCung;
    }
    return star;
  }

  function renderInfo(chart){
    var el = document.getElementById('info');
    var dtVal = document.getElementById('dt').value || '';
    var solarStr = formatDtLocal(dtVal) || chart.timeInfo.input || '';

    // --- Âm lịch ---
    var lunarStr = '--';
    if (typeof ThreeMeta !== 'undefined' && ThreeMeta.Solar && ThreeMeta.Lunar) {
      try {
        var dtValue = document.getElementById('dt').value;
        if (dtValue) {
          var dateObj = new Date(dtValue);
          if (!isNaN(dateObj.getTime())) {
            var hour = dateObj.getHours();
            // Nếu giờ >= 23, coi như thuộc ngày hôm sau (theo giờ Tý)
            if (hour >= 23) {
              dateObj.setDate(dateObj.getDate() + 1);
            }
            var solar = ThreeMeta.Solar.fromDate(dateObj);
            var lunar = ThreeMeta.Lunar.fromSolar(solar);
            var lunarDay = lunar.getDay();
            var lunarMonth = Math.abs(lunar.getMonth());
            var lunarYear = lunar.getYear();
            var hourMin = '';
            var timePart = dtValue.split('T')[1];
            if (timePart) hourMin = timePart.substring(0,5);
            if (!hourMin && solarStr) {
              var match = solarStr.match(/(\d{2}:\d{2})$/);
              if (match) hourMin = match[1];
            }
            lunarStr = lunarDay + '/' + lunarMonth + '/' + lunarYear + ' - ' + (hourMin || '--');
          }
        }
      } catch(e) {
        console.error('Lỗi âm lịch:', e);
      }
    }

    var tk = chart.season.tietKhi || '';
    var xunShou = chart.tuanThu.ten || '';
    
    // --- TÍNH KHÔNG VONG TỪ TUẦN THỦ (FIX) ---
    var kv = '—';
    var tuan = xunShou;
    var voidMap = {
      'Giáp Tý': ['Tuất', 'Hợi'],
      'Giáp Tuất': ['Thân', 'Dậu'],
      'Giáp Thân': ['Ngọ', 'Mùi'],
      'Giáp Ngọ': ['Thìn', 'Tỵ'],
      'Giáp Thìn': ['Dần', 'Mão'],
      'Giáp Dần': ['Tý', 'Sửu']
    };
    if (voidMap[tuan]) {
      kv = voidMap[tuan].join(', ');
    } else if (chart.tuanThu.khongVong && chart.tuanThu.khongVong.length) {
      kv = chart.tuanThu.khongVong.join(', ');
    }
    
    var fp = chart.fourPillars || {};
    
    // Lấy can chi an toàn (đã được chuyển sang tiếng Việt)
    function getGanZhi(obj) {
      if (!obj) return '—';
      var gan = obj.can || '';
      var chi = obj.chi || '';
      if (gan && chi) return gan + ' ' + chi;
      if (gan) return gan;
      if (chi) return chi;
      return '—';
    }
    
    var canChi = [
      getGanZhi(fp.year),
      getGanZhi(fp.month),
      getGanZhi(fp.day),
      getGanZhi(fp.hour)
    ].filter(Boolean).join(' — ') || '—';
    
    var juType = chart.ju.type || '';
    var juNum = chart.ju.soCuc || '';
    var yuan = chart.tuanThu.tamNguyen || '';
    var zf = chart.zhiFu || {};
    var zs = chart.zhiShi || {};
    var zhifuLine = zf.sao ? (zf.sao + (zf.ten ? (' lạc cung ' + zf.ten + '(' + zf.cung + ')') : '')) : '—';
    var zhishiLine = zs.ten ? (zs.ten + '(' + zs.cung + ')') : '—';
    var juLine = [tk, yuan, juType + ' cục ' + juNum].filter(Boolean).join(', ') || '—';

    var html = `
      <div class="kv"><div class="k">Dương lịch :</div><div class="v">${esc(solarStr)}</div></div>
      <div class="kv"><div class="k">Hệ thống :</div><div class="v">Hà Đồ Cửu Cung</div></div>
      <div class="kv"><div class="k">Âm lịch :</div><div class="v">${esc(lunarStr)}</div></div>
      <div class="kv"><div class="k">Lập cục :</div><div class="v">${esc(juLine)}</div></div>
      <div class="kv"><div class="k">Can chi :</div><div class="v">${esc(canChi)}</div></div>
      <div class="kv"><div class="k">Trực Phù :</div><div class="v">${esc(zhifuLine)}</div></div>
      <div class="kv"><div class="k">Tiết khí :</div><div class="v">${esc(tk || '—')}</div></div>
      <div class="kv"><div class="k">Trực Sử :</div><div class="v">${esc(zhishiLine)}</div></div>
      <div class="kv"><div class="k">Tuần thủ :</div><div class="v">${esc(xunShou || '—')}</div></div>
      <div class="kv"><div class="k">Không vong :</div><div class="v">${esc(kv)}</div></div>
    `;
    el.innerHTML = html;
  }

  function renderQimenGrid(chart){
    var grid = document.getElementById('gridQimen');
    grid.innerHTML = '';

    ORDER.forEach(function(pos){
      var p = (chart.palaces || []).find(function(x){ return x.cung === pos; }) || {};
      var meta = PALACE_META[pos] || {direction:'', trigram:'', color:'#666', rgb:'102,102,102'};
      var deity = getEffectiveDeity(p, chart) || '';
      var star = getDisplayStar(p) || '';
      var gate = p.batMon || '';
      var hs = 'T: ' + (p.thienCanBan || '—');
      var es = 'Đ: ' + (p.diaBan || '—');
      var mc = metaCaption(meta);
      var metaHtml = mc ? '<span class="meta-chip">' + esc(mc) + '</span>' : '';

      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.setProperty('--dir-color', meta.color);
      cell.style.setProperty('--dir-rgb', meta.rgb);
      cell.innerHTML =
        '<div class="cell-shell">' +
          '<div class="cell-topline"><div class="cell-meta">' + metaHtml + '</div><div class="pos">' + pos + '</div></div>' +
          '<div class="qm-main"><div class="qm-block"><span class="qm-value">' + esc(deity) + '</span></div><div class="qm-block"><span class="qm-value">' + esc(star) + '</span></div></div>' +
          '<div class="qm-gate">' + esc(gate) + '</div>' +
          '<div class="qm-stems"><div class="stem-line">' + esc(hs) + '</div><div class="stem-line">' + esc(es) + '</div></div>' +
        '</div>';
      grid.appendChild(cell);
    });
  }

  function getPatternLines(palace){
    var pats = Array.isArray(palace.patterns) ? palace.patterns : [];
    return pats.map(function(p){
      return { kind:p.loai === 'cat' ? 'good' : 'bad', name:p.ten || '' };
    }).filter(function(x){ return x.name; });
  }

  function renderPatternsGrid(chart){
    var grid = document.getElementById('gridPatterns');
    grid.innerHTML = '';

    ORDER.forEach(function(pos){
      var palace = (chart.palaces || []).find(function(x){ return x.cung === pos; }) || {};
      var meta = PALACE_META[pos] || {color:'#666', rgb:'102,102,102'};
      var lines = getPatternLines(palace);

      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.setProperty('--dir-color', meta.color);
      cell.style.setProperty('--dir-rgb', meta.rgb);

      if (lines.length === 0) cell.classList.add('dim');

      var content;
      if (!lines.length) {
        content = '<div class="empty">Không có</div>';
      } else {
        content = '<div class="pat-wrap">' + lines.map(function(x){
          return '<div class="pat ' + (x.kind === 'bad' ? 'bad' : 'good') + '">' + esc(x.name) + '</div>';
        }).join('') + '</div>';
      }

      cell.innerHTML = '<div class="cell-shell pattern-shell">' + content + '</div>';
      grid.appendChild(cell);
    });
  }

  function calculate(){
    try{
      if(!window.HaDoBanKyMon){
        alert('Không tải được engine Hà Đồ (KyMonBanHaDo.js).');
        return;
      }
      if(!is3MetaReady()){
        alert('Không tải được 3meta.js hoặc 3meta chưa sẵn sàng.');
        return;
      }

      var dtInput = document.getElementById('dt');
      var dtStr = dtLocalToStr(dtInput.value);
      if(!dtStr){
        alert('Vui lòng chọn ngày và giờ.');
        return;
      }

      var chart = window.HaDoBanKyMon.byDatetime(dtStr);
      if (window.fixChartGanZhi) {
        chart = window.fixChartGanZhi(chart);
      }
      window.__LAST_CHART = chart;

      renderInfo(chart);
      renderQimenGrid(chart);
      renderPatternsGrid(chart);

      if (window.ChartEvents) {
        window.ChartEvents.emit('chartCalculated', chart);
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi lập bàn: ' + (e.message || e));
    }
  }

  window.calculate = calculate;

  function setNow(){
    var d = new Date();
    document.getElementById('dt').value =
      d.getFullYear() + '-' +
      pad2(d.getMonth() + 1) + '-' +
      pad2(d.getDate()) + 'T' +
      pad2(d.getHours()) + ':' +
      pad2(d.getMinutes());
  }

  document.getElementById('btnNow').addEventListener('click', function () {
    setNow();
    calculate();
  });

  document.getElementById('btnCalc').addEventListener('click', function () {
    calculate();
  });

  // Chạy lần đầu sau khi toàn bộ tài nguyên/script tải xong
  window.addEventListener('load', function () {
    setNow();
    calculate();
  });
})();
