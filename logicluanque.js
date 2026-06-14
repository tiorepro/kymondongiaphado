// LogicLuanQue.js
// BẢNG LUẬN QUẺ - LOGIC 26 CHỦ ĐỀ CHUYÊN SÂU
// Tự động tương thích hệ Lạc Thư & Hà Đồ qua chart.sys + Phân tích Cát Hung toàn diện

(function () {
  'use strict';

  let activeEngine = null;
  if (typeof window.KyMonEngine !== 'undefined') {
    activeEngine = window.KyMonEngine;
  } else if (typeof window.HaDoBanKyMon !== 'undefined') {
    activeEngine = window.HaDoBanKyMon;
  }

  if (!activeEngine || !activeEngine.utils) {
    console.error('Không tìm thấy Engine Kỳ Môn. Bảng luận quẻ vô hiệu hóa.');
    return;
  }

  const _U = activeEngine.utils;

  // ============================ HƯỚNG DẪN TỪNG CHỦ ĐỀ ============================
  const TOPIC_GUIDES = {
    1: {
      title: '1. Cơ thể',
      vars: [
        ['Giáp (thiên bàn)', 'Đầu, gan, túi mật'],
        ['Ất (thiên bàn)', 'Gan, túi mật, thực quản, cổ họng, hệ thần kinh'],
        ['Bính (thiên bàn)', 'Ruột non, môi, vai, trán'],
        ['Đinh (thiên bàn)', 'Răng, tim, mắt, trào ngược, bốc hỏa'],
        ['Mậu (thiên bàn)', 'Cơ bụng, bao tử, mũi'],
        ['Kỷ (thiên bàn)', 'Mắt, tỳ, tạng, miệng, bụng'],
        ['Canh (thiên bàn)', 'Xương, sườn, ruột già'],
        ['Tân (thiên bàn)', 'Bụng, phổi, phế quản, ngực, cổ'],
        ['Nhâm (thiên bàn)', 'Tim mạch, bàng quang, máu, hệ thực vật'],
        ['Quý (thiên bàn)', 'Thần kinh, chân, thận'],
      ],
      signals: [],
      how: 'Xem can nào đại diện bệnh/bị thương → quy chiếu sang bộ phận. Nếu bị khắc, không vong, nhập mộ → bộ phận đó yếu hoặc có vấn đề.'
    },
    2: {
      title: '2. Nghề nghiệp',
      vars: [
        ['Can năm', 'Quản lý'],
        ['Can tháng', 'Đồng nghiệp'],
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Nhân viên cấp dưới'],
        ['Trực Phù', 'Sếp lớn'],
        ['Thái Tuế', 'Sếp siêu lớn'],
        ['Khai Môn', 'Sự nghiệp'],
        ['Sinh Môn', 'Lợi nhuận, tiền'],
        ['Đỗ Môn', 'Công việc sắp tới'],
      ],
      signals: [
        ['Khai Môn phản ngâm', 'Công việc có sự thay đổi lớn'],
        ['Khai Môn không vong', 'Chấm dứt công việc'],
        ['Khai Môn nhập mộ', 'Sai phạm'],
        ['Can ngày khắc Thái Tuế', 'Không hợp sếp'],
        ['Thiên Phụ tinh', 'Môi trường làm việc dễ chịu'],
        ['Thiên Nhậm tinh', 'Được hỗ trợ bởi cấp dưới và cấp trên'],
        ['Thiên Tâm tinh', 'Sếp giỏi'],
        ['Thiên Xung tinh', 'Áp lực công việc lớn'],
        ['Thiên Bồng tinh', 'Bị sếp chèn ép'],
      ],
      how: 'Lấy can ngày làm mình. Xem Khai Môn (nghề nghiệp), Sinh Môn (tiền). Xem quan hệ mình với Thái Tuế / Trực Phù / Can năm để biết hợp cấp trên hay không. Xem sao đi kèm để luận môi trường và áp lực.'
    },
    3: {
      title: '3. Thăng chức',
      vars: [
        ['Khai Môn', 'Quyết định thăng chức'],
        ['Can ngày', 'Người hỏi'],
        ['Đỗ Môn', 'Người đang đề bạt/push hồ sơ'],
        ['Trực Phù', 'Sếp lớn'],
        ['Thái Tuế', 'Sếp siêu lớn'],
        ['Can năm', 'Quản lý cấp cao'],
      ],
      signals: [],
      how: 'Trọng tâm là Khai Môn (có quyết định nâng chức không). Đỗ Môn cho biết người đang push hồ sơ. Trực Phù, Thái Tuế, Can năm cho biết hệ cấp trên có ủng hộ không.'
    },
    4: {
      title: '4. Tìm kiếm người dẫn đường',
      vars: [
        ['Thiên Phụ tinh', 'Vị trí / phương hướng của người dẫn đường'],
      ],
      signals: [],
      how: 'Xác định Thiên Phụ tinh đang ở cung nào, phương nào, trạng thái thế nào để suy vị trí hoặc hướng của người dẫn đường.'
    },
    5: {
      title: '5. Chuyển việc',
      vars: [
        ['Khai Môn', 'Sự nghiệp sau khi xin nghỉ'],
        ['Can ngày', 'Người hỏi / công việc hiện tại'],
        ['Đỗ Môn', 'Công ty đang xin việc mới'],
      ],
      signals: [],
      how: 'So sánh can ngày với Đỗ Môn để biết có hợp công ty mới không. Xem Khai Môn để biết tương lai nghề nghiệp sau khi rời công việc hiện tại.'
    },
    6: {
      title: '6. Xin việc',
      vars: [
        ['Khai Môn', 'Quyết định (đậu/rớt)'],
        ['Can ngày', 'Người hỏi'],
        ['Đỗ Môn', 'Phỏng vấn / buổi thử việc'],
      ],
      signals: [],
      how: 'Đỗ Môn cho biết tình hình phỏng vấn. Khai Môn quyết định đậu hay không. Quan hệ giữa can ngày và Đỗ Môn / Khai Môn cho biết mức phù hợp.'
    },
    7: {
      title: '7. Mua hàng',
      vars: [
        ['Can ngày', 'Người mua'],
        ['Can giờ', 'Sản phẩm / dịch vụ'],
        ['Cảnh Môn', 'Thị trường'],
      ],
      signals: [
        ['Can giờ vượng + cách cục tốt', 'Sản phẩm tốt, phù hợp thị trường'],
        ['Can giờ suy + cách cục tốt', 'Sản phẩm chưa tốt nhất nhưng thị trường vẫn đón nhận ban đầu'],
        ['Can giờ sinh can ngày', 'Người mua muốn mua sản phẩm'],
        ['Can giờ khắc can ngày', 'Sản phẩm không phù hợp người mua'],
        ['Can giờ không vong', 'Sản phẩm không phù hợp người mua'],
        ['Can ngày sinh can giờ', 'Người mua yêu thích sản phẩm'],
        ['Can ngày khắc can giờ', 'Phải thay đổi sản phẩm, thị trường nhanh bão hòa'],
      ],
      how: 'Dùng can ngày làm bên mua, can giờ làm món hàng. Xem sinh-khắc để biết có nhu cầu thực không. Xem Cảnh Môn để biết thị trường có ủng hộ không.'
    },
    8: {
      title: '8. Bán hàng',
      vars: [
        ['Can ngày', 'Người bán'],
        ['Trực Sử', 'Người mua / khách hàng'],
        ['Can giờ', 'Sản phẩm / dịch vụ'],
        ['Mậu', 'Vốn'],
        ['Sinh Môn', 'Tiền lời / lợi nhuận'],
      ],
      signals: [
        ['Can giờ sinh Sinh Môn', 'Có lợi nhuận'],
        ['Can giờ khắc Sinh Môn / Mậu', 'Không có lợi nhuận'],
        ['Can ngày sinh Trực Sử', 'Phụ thuộc khách hàng'],
        ['Can ngày khắc Trực Sử', 'Gặp nhiều vấn đề với khách hàng'],
        ['Can giờ khắc can ngày', 'Người bán không nắm bắt xu thế sản phẩm'],
      ],
      how: 'Xem 4 yếu tố: người bán – khách – sản phẩm – lợi nhuận. Nếu can giờ tốt và sinh Sinh Môn → bán ra tiền. Nếu can giờ khắc Sinh Môn/Mậu → lợi nhuận kém.'
    },
    9: {
      title: '9. Mở kinh doanh',
      vars: [
        ['Khai Môn', 'Dụng thần chính'],
      ],
      signals: [
        ['Trực Phù đi cùng Khai Môn', 'Nhận được nhiều hỗ trợ, thuận lợi'],
        ['Thái Âm đi cùng', 'Khách hàng yêu thích và quay lại'],
        ['Lục Hợp đi cùng', 'Sẽ có kêu gọi hợp tác'],
        ['Cửu Thiên đi cùng', 'Bán tốt, có danh tiếng'],
        ['Đằng Xà đi cùng', 'Dễ gặp vấn đề pháp lý'],
        ['Bạch Hổ / Câu Trần', 'Bế tắc, mệt mỏi'],
        ['Huyền Vũ / Chu Tước', 'Thất thoát, cãi vã'],
        ['Cửu Địa đi cùng', 'Phát triển chậm'],
        ['Không vong / nhập mộ', 'Không nên khởi sự'],
      ],
      how: 'Lấy Khai Môn làm trọng tâm. Xem môn này đi cùng thần/tinh nào để biết cát hung khi khởi sự.'
    },
    10: {
      title: '10. Hợp tác',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Người hợp tác'],
        ['Lục Hợp', 'Mối quan hệ hợp tác / người môi giới'],
        ['Sinh Môn', 'Lợi ích tài chính'],
      ],
      signals: [],
      how: 'So can ngày với can giờ để biết hợp hay khắc. Lục Hợp cho biết cầu nối, tính gắn kết. Sinh Môn cho biết lợi ích tài chính.'
    },
    11: {
      title: '11. Mua bán BĐS',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Sinh Môn', 'Nhà'],
        ['Tử Môn', 'Đất'],
        ['Cửu Địa', 'Dự án lớn'],
        ['Cửu Thiên', 'Chung cư'],
        ['Cảnh Môn', 'Giấy tờ / pháp lý'],
        ['Mậu', 'Vốn'],
        ['Thiên Tâm', 'Tình hình tài chính'],
        ['Lục Hợp', 'Môi giới / trung gian'],
      ],
      signals: [],
      how: 'Mua nhà → chú ý Sinh Môn. Mua đất → chú ý Tử Môn. Cảnh Môn quyết định giấy tờ. Mậu và Thiên Tâm cho thấy vốn và khả năng tài chính. Lục Hợp biểu thị môi giới.'
    },
    12: {
      title: '12. Đi vay, cho vay',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Trực Phù', 'Người cho vay'],
        ['Trực Sử', 'Người đi vay'],
      ],
      signals: [],
      how: 'Tùy người hỏi đang ở vai nào (bên vay hay bên cho vay), lấy can ngày đối chiếu với Trực Phù và Trực Sử để xem thế mạnh, khả năng được vay hoặc đòi vốn.'
    },
    13: {
      title: '13. Đòi nợ',
      vars: [
        ['Can ngày', 'Người hỏi (chủ nợ)'],
        ['Thương Môn', 'Việc đòi nợ'],
        ['Thái Ất', 'Người vay (con nợ)'],
        ['Sinh Môn', 'Khoản tiền'],
      ],
      signals: [],
      how: 'Xem Thương Môn để biết việc đòi nợ có tiến triển không. Thái Ất là bên đang nợ. Sinh Môn là khoản tiền – mạnh, sinh trợ thì dễ thu.'
    },
    14: {
      title: '14. Thi đấu',
      vars: [
        ['Can ngày', 'Đội muốn hỏi'],
        ['Can giờ (địa bàn)', 'Chủ nhà'],
        ['Can giờ (thiên bàn)', 'Đội khách'],
        ['Trực Phù', 'Trọng tài'],
      ],
      signals: [],
      how: 'So can ngày với can giờ để biết bên nào mạnh hơn. Dùng địa bàn/thiên bàn để tách chủ nhà – đội khách. Trực Phù cho biết yếu tố trọng tài, điều hành trận.'
    },
    15: {
      title: '15. Thi cử',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can năm cá nhân', 'Người thi'],
        ['Cảnh Môn', 'Đề thi / điểm số'],
        ['Thiên Phụ', 'Giáo viên / phòng thi'],
        ['Trực Phù', 'Người giám sát'],
        ['Can năm', 'Trường thi'],
      ],
      signals: [],
      how: 'Cảnh Môn là trọng tâm nếu xem kết quả thi. Can năm cá nhân là thí sinh. So tương quan với Cảnh Môn để biết mức thuận lợi về điểm số.'
    },
    16: {
      title: '16. Chỗ đỗ xe',
      vars: [
        ['Không vong', 'Vị trí còn chỗ trống'],
      ],
      signals: [],
      how: 'Tìm cung hoặc phương có Không vong để luận chỗ trống còn đỗ được. Đi theo phương đó sẽ tìm được chỗ.'
    },
    17: {
      title: '17. Du lịch',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Kết quả chuyến đi'],
        ['Cảnh Môn', 'Đường bộ'],
        ['Thương Môn', 'Phương tiện di chuyển'],
        ['Hưu Môn', 'Đường thủy'],
        ['Cửu Thiên / Khai Môn', 'Hàng không / máy bay'],
        ['Thiên Bồng', 'Trở ngại, trục trặc'],
      ],
      signals: [],
      how: 'Can giờ và phương hướng cho biết chuyến đi có thuận không. Xem môn để luận loại hình di chuyển. Thiên Bồng báo trở ngại, trục trặc.'
    },
    18: {
      title: '18. Hôn nhân',
      vars: [
        ['Ất', 'Vợ (nữ)'],
        ['Canh', 'Chồng (nam)'],
        ['Lục Hợp', 'Hôn nhân (trọng tâm)'],
        ['Đinh', 'Người thứ 3 là nữ'],
        ['Bính', 'Người thứ 3 là nam'],
        ['Huyền Vũ', 'Lừa dối'],
        ['Đằng Xà / Chu Tước', 'Thiếu tin tưởng'],
        ['Câu Trần / Bạch Hổ', 'Mất mát, tai nạn'],
        ['Cửu Thiên', 'Nhanh chóng, bất ngờ'],
      ],
      signals: [],
      how: 'Dùng Ất và Canh để định hai bên vợ chồng. Lục Hợp là trọng tâm hôn nhân. Nếu Bính/Đinh nổi bật → xét khả năng người thứ ba. Huyền Vũ, Đằng Xà, Chu Tước báo tín hiệu bất ổn niềm tin.'
    },
    19: {
      title: '19. Sinh nở (giới tính)',
      vars: [
        ['Cung Khôn', 'Mẹ'],
        ['Cửu tinh trong cung Khôn', 'Em bé'],
        ['Bát Môn dương', 'Giới tính nam'],
        ['Bát Môn âm', 'Giới tính nữ'],
      ],
      signals: [],
      how: 'Xác định cung Khôn (cung 2) là mẹ. Lấy cửu tinh trong cung Khôn làm em bé. Xem bát môn thuộc âm hay dương để luận giới tính.'
    },
    20: {
      title: '20. Sinh nở',
      vars: [
        ['Cung Khôn (cung 2)', 'Cung sinh / mẹ'],
        ['Thiên Nhuế', 'Mẹ'],
        ['Cửu tinh cung Khôn', 'Em bé'],
        ['Bạch Hổ cung Khôn', 'Sinh nhanh'],
        ['Phục ngâm', 'Sinh lâu, kéo dài'],
        ['Cung Khôn khắc bát môn', 'Nguy hiểm / cần phẫu thuật'],
      ],
      signals: [
        ['Thiên Nhuế khắc sao cung Khôn', 'Tốt, an toàn'],
        ['Sao cung Khôn sinh Thiên Nhuế', 'Sinh lâu'],
        ['Sao cung Khôn khắc Thiên Nhuế', 'Nguy hiểm'],
        ['Cung Thiên Nhuế khắc cung Khôn', 'Tốt'],
        ['Cung Khôn môn bách', 'Mẹ có nhiều bệnh, biến chứng'],
      ],
      how: 'Xem quan hệ giữa mẹ (Thiên Nhuế) và em bé (cửu tinh cung Khôn). Nếu khắc theo chiều tốt → sinh an toàn. Ngược lại → dễ nguy hiểm. Bạch Hổ cung Khôn: nhanh. Phục ngâm: kéo dài.'
    },
    21: {
      title: '21. Sức khỏe',
      vars: [
        ['Can ngày', 'Người hỏi / người bệnh'],
        ['Thiên Nhuế', 'Tình hình tiến triển của bệnh'],
        ['Thiên Xung', 'Cơ sở y tế'],
        ['Can giờ', 'Nguyên do bệnh'],
        ['Trực Phù', 'Loại bệnh'],
        ['Trực Sử', 'Thời gian phục hồi'],
        ['Ất', 'Thuốc đông y'],
        ['Thiên Tâm tinh', 'Tây y'],
        ['Đinh + Khai Môn', 'Đã trải qua phẫu thuật'],
        ['Mậu / Kỷ', 'Có vết sẹo, u bướu'],
        ['Bính', 'Viêm'],
        ['Nhâm / Quý', 'Máu huyết'],
      ],
      signals: [
        ['Người bệnh cùng cung Sinh Môn', 'Phục hồi nhanh'],
        ['Người bệnh cùng cung Tử Môn', 'Bệnh khó chữa, kéo dài'],
        ['Thiên Nhuế khắc người bệnh', 'Sức khỏe xấu, trở nặng'],
        ['Thiên Nhuế không vong (bệnh mới)', 'Tốt'],
        ['Người bệnh không vong', 'Bệnh khó chữa, kéo dài'],
      ],
      how: 'Xem Thiên Nhuế để biết bệnh đang tiến triển ra sao. Trực Sử cho biết tốc độ hồi phục. Sinh Môn/Tử Môn phân biệt bệnh dễ hồi hay kéo dài. Kết hợp bảng Cơ thể để xác định bộ phận liên quan.'
    },
    22: {
      title: '22. Kiện tụng',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Trực Phù', 'Người thưa kiện'],
        ['Thiên Ất', 'Người bị kiện'],
        ['Khai Môn', 'Quan tòa'],
        ['Lục Hợp', 'Nhân chứng / bằng chứng'],
        ['Đỗ Môn', 'Viện kiểm sát'],
        ['Đinh', 'Giấy tờ, lệnh triệu tập'],
        ['Bính', 'Bằng chứng hình ảnh/video'],
        ['Kinh Môn', 'Luật sư'],
        ['Cảnh Môn', 'Đơn khởi kiện'],
      ],
      signals: [
        ['Khai Môn nhập mộ', 'Phiên tòa bị hoãn'],
        ['Khai Môn không vong', 'Còn kiện tiếp vì thiếu dữ liệu'],
        ['Khai Môn khắc Cảnh Môn', 'Tòa không thụ lý đơn'],
        ['Cảnh Môn không vong + Đằng Xà / Huyền Vũ', 'Việc không đúng sự thật'],
        ['Lục Hợp không vong', 'Chưa đủ bằng chứng'],
        ['Khai Môn phục ngâm', 'Vụ kiện kéo dài'],
        ['Khai Môn phản ngâm', 'Dời tòa / thay đổi phiên xét xử'],
      ],
      how: 'Khai Môn là then chốt (tượng tòa/quan xét xử). Cảnh Môn là đơn kiện – bị khắc thì khó thụ lý. Lục Hợp là chứng cứ – không vong thì hồ sơ yếu.'
    },
    23: {
      title: '23. Tố tụng hình sự',
      vars: [
        ['Tân', 'Tội phạm (chủ điểm)'],
      ],
      signals: [
        ['Tân gặp Nhâm Quý', 'Đi tù'],
        ['Tân gặp kích hình', 'Tội nặng'],
        ['Tân gặp Bạch Hổ / Đỗ Môn', 'Bị giam cầm'],
        ['Tân gặp Đằng Xà', 'Lừa bịp'],
        ['Tân gặp Huyền Vũ', 'Trộm cắp'],
        ['Tân gặp Thương Môn + kích hình', 'Đánh nhau'],
        ['Tân gặp Mậu', 'Vì tiền mà mang họa'],
        ['Tân gặp Lục Hợp / can tháng', 'Dễ có đồng bọn'],
        ['Tân gặp Phục ngâm', 'Bắt giữ kéo dài'],
        ['Tân gặp Phản ngâm / Không vong', 'Dễ được phóng thích'],
      ],
      how: 'Chủ điểm là Tân. Xem Tân gặp gì để luận loại hành vi, mức độ nặng nhẹ và kết quả pháp lý.'
    },
    24: {
      title: '24. Đi lạc',
      vars: [
        ['Can ngày', 'Dụng thần (xác định qua quan hệ người thân)'],
        ['Lục Hợp', 'Hướng bắt đầu của người đi lạc'],
        ['Cung Trực Phù / Trực Sử', 'Điểm dừng chân'],
        ['Đỗ Môn', 'Hướng người đi lạc trốn'],
      ],
      signals: [
        ['Thời can và nhật can đồng cung', 'Dễ tìm được hoặc tự quay về'],
        ['Dụng thần có Cửu Địa / Thái Âm', 'Có người cất giấu'],
        ['Dụng thần có Huyền Vũ', 'Bị người khác lừa'],
        ['Dụng thần có Đằng Xà', 'Bị bắt giữ'],
        ['Dụng thần có Bạch Hổ', 'Đề phòng bị đánh'],
        ['Phục ngâm', 'Khó về'],
        ['Phản ngâm', 'Sẽ về'],
      ],
      how: 'Trước hết xác định đúng dụng thần theo quan hệ thân thuộc. Xem Lục Hợp để đoán hướng ban đầu, cung dụng thần để đoán hướng cuối. Phản ngâm = có cơ hội quay về; Phục ngâm = khó về.'
    },
    25: {
      title: '25. Mất đồ',
      vars: [
        ['Can ngày', 'Người chủ'],
        ['Can giờ', 'Tài sản bị mất'],
      ],
      signals: [
        ['Ngày giờ đồng cung', 'Không bị mất, sẽ tìm lại được'],
        ['Can giờ vượng sinh can ngày', 'Tìm lại được'],
        ['Phản ngâm', 'Tìm lại được'],
        ['Thời can không vong / mộ tuyệt', 'Khó tìm lại'],
        ['Can ngày + can giờ nội bàn', 'Mất trong nhà / nơi gần'],
        ['Can ngày + can giờ ngoại bàn', 'Mất ngoài nhà / nơi xa'],
        ['Can giờ có Huyền Vũ', 'Người khác lấy hoặc tự để quên'],
        ['Can giờ bị Huyền Vũ / Thiên Bồng khắc', 'Bị lấy trộm'],
        ['Huyền Vũ dương tính', 'Người lấy là đàn ông'],
        ['Huyền Vũ âm tính', 'Người lấy là phụ nữ'],
      ],
      how: 'Can giờ là món đồ. Xem nội bàn/ngoại bàn để định trong hay ngoài. Xem Huyền Vũ để đoán có người lấy, quên, hay nam/nữ liên quan.'
    },
    26: {
      title: '26. Thời tiết',
      vars: [
        ['Giáp / Ất', 'Gió'],
        ['Bính / Đinh', 'Lửa / nóng'],
        ['Mậu / Kỷ', 'Mây'],
        ['Canh / Tân', 'Băng tuyết'],
        ['Nhâm / Quý', 'Mưa'],
        ['Thiên Anh', 'Mặt trời'],
        ['Thiên Phụ', 'Gió'],
        ['Thiên Trụ / Thiên Bồng', 'Mưa'],
        ['Thiên Xung', 'Sấm'],
        ['Trực Phù / Cửu Thiên', 'Mặt trời'],
        ['Cửu Địa', 'Mây'],
        ['Lục Hợp / Bạch Hổ', 'Gió'],
        ['Huyền Vũ', 'Mưa'],
      ],
      signals: [
        ['Thiên Bồng + Nhâm/Quý + Khảm/Chấn/Đoài', 'Mưa (xác suất cao)'],
        ['Thiên Trụ + Nhâm/Quý + Khảm/Chấn/Đoài', 'Mưa (xác suất cao)'],
      ],
      how: 'Xem can chủ và sao chủ hiện ra gì để quy loại thời tiết. Nếu mưa xuất hiện đồng thời ở nhiều chỉ dấu (Nhâm Quý + Thiên Bồng/Thiên Trụ), xác suất mưa càng cao.'
    }
  };

  // ============================ HELPERS TỰ ĐỘNG TƯƠNG THÍCH HỆ ============================
  function getCurrentChart() { return window.__LAST_CHART || null; }
  function getPalace(chart, pos) { return (chart.palaces || []).find(p => p.cung === pos) || null; }
  function getAllPalaces(chart) { return chart.palaces || []; }
  
  function getStemOf(chart, pillar) {
    const fp = chart.fourPillars || {};
    const obj = fp[pillar];
    if (!obj) return '';
    let can = obj.can || '';
    if (can.includes(' ')) can = can.split(' ')[0];
    return can;
  }
  function getEarthlyStemOf(chart, pillar) {
    const fp = chart.fourPillars || {};
    const obj = fp[pillar];
    if (!obj) return '';
    return obj.chi || '';
  }

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

  function findPalaceByGate(chart, gateName) {
    const gn = normalizeGateName(gateName);
    return getAllPalaces(chart).find(p => normalizeGateName(p.batMon) === gn) || null;
  }
  function findPalaceByStarName(chart, starName) {
    return getAllPalaces(chart).find(p => {
      const star = p.thienBan || '';
      const star2 = p.thienBanDongCung || '';
      return star.includes(starName) || star2.includes(starName);
    }) || null;
  }
  function findPalaceByDeityName(chart, deityName) {
    return getAllPalaces(chart).find(p => getEffectiveDeityName(p, chart).includes(deityName)) || null;
  }

  function getZhifuPalace(chart) { return chart?.zhiFu?.cung ? getPalace(chart, chart.zhiFu.cung) : null; }
  function getZhishiPalace(chart) { return chart?.zhiShi?.cung ? getPalace(chart, chart.zhiShi.cung) : null; }

  function isVoid(chart, palace) {
    if (!palace) return false;
    const kv = chart.tuanThu?.khongVong || [];
    const chiDaiDien = chart.palaces.find(p=>p.cung === palace.cung)?.khongVong?.chiCung;
    return kv.includes(chiDaiDien);
  }
  function isHorse(chart, palace) { return palace?.isDichMa === true; }

  function getHeavenlyStem(palace) { return palace?.thienCanBan || ''; }
  function getEarthlyStem(palace) { return palace?.diaBan || ''; }

  function findPalaceByHeavenlyStem(chart, stemVI) { return getAllPalaces(chart).find(p => p.thienCanBan === stemVI) || null; }
  function findPalaceByEarthlyStem(chart, stemVI) { return getAllPalaces(chart).find(p => p.diaBan === stemVI) || null; }

  function hasPattern(palace, nameSubstr) {
    if (!palace || !Array.isArray(palace.patterns)) return false;
    return palace.patterns.some(p => (p.ten || '').toLowerCase().includes(nameSubstr.toLowerCase()));
  }
  function hasRuMu(palace) {
    if (!palace) return false;
    if (palace.isMoKho === true) return true;
    return hasPattern(palace, 'nhập mộ');
  }
  function hasGlobalPattern(chart, nameSubstr) {
    return getAllPalaces(chart).some(p => hasPattern(p, nameSubstr));
  }

  function palaceName(pos, chart) { return chart?.sys?.CUNG_META[pos]?.ten || ''; }
  function palaceDirection(pos, chart) { return chart?.sys?.CUNG_META[pos]?.huong || ''; }

  function palaceSummary(p, chart) {
    if (!p) return '—';
    const t = palaceName(p.cung, chart);
    const d = palaceDirection(p.cung, chart);
    let parts = [];
    if (t) parts.push(t);
    if (d) parts.push(`(${d})`);
    if (p.batMon) parts.push(p.batMon);
    if (p.thienBan) parts.push(p.thienBan);
    const deity = getEffectiveDeityName(p, chart);
    if (deity) parts.push(deity);
    const hs = getHeavenlyStem(p), es = getEarthlyStem(p);
    if (hs || es) parts.push(`${hs || '—'}/${es || '—'}`);
    
    let badges = [];
    if (isVoid(chart, p)) badges.push('⭕ K.Vong');
    if (isHorse(chart, p)) badges.push('🐎 D.Mã');
    if (hasRuMu(p)) badges.push('🪦 Nhập Mộ');
    
    let baseStr = parts.join(' · ');
    return badges.length ? `${baseStr} [${badges.join(' ')}]` : baseStr;
  }

  function getRelation(stemA, stemB) {
    if (!stemA || !stemB) return { rel: 'khong', label: 'Không xác định', isAuspicious: false };
    const aEl = getStemElement(stemA), bEl = getStemElement(stemB);
    if (!aEl || !bEl) return { rel: 'khong', label: 'Không xác định', isAuspicious: false };
    if (sheng(aEl, bEl)) return { rel: 'a_sinh_b', label: `${stemA}(${aEl}) sinh ${stemB}(${bEl})`, isAuspicious: true };
    if (sheng(bEl, aEl)) return { rel: 'b_sinh_a', label: `${stemB}(${bEl}) sinh ${stemA}(${aEl})`, isAuspicious: true };
    if (khac(aEl, bEl)) return { rel: 'a_khac_b', label: `${stemA}(${aEl}) khắc ${stemB}(${bEl})`, isAuspicious: false };
    if (khac(bEl, aEl)) return { rel: 'b_khac_a', label: `${stemB}(${bEl}) khắc ${stemA}(${aEl})`, isAuspicious: false };
    if (aEl === bEl) return { rel: 'dong_hanh', label: `${stemA} & ${stemB} (Tỷ hòa ${aEl})`, isAuspicious: true };
    return { rel: 'khong', label: 'Không quan hệ', isAuspicious: false };
  }

  function getRelationPalace(pA, pB, chart) {
    if(!pA || !pB) return { rel: 'khong', label: 'Không rõ' };
    const hA = chart.sys.CUNG_META[pA.cung].hanh;
    const hB = chart.sys.CUNG_META[pB.cung].hanh;
    if (sheng(hA, hB)) return { rel: 'a_sinh_b', label: `Cung ${pA.cung}(${hA}) sinh Cung ${pB.cung}(${hB})` };
    if (sheng(hB, hA)) return { rel: 'b_sinh_a', label: `Cung ${pB.cung}(${hB}) sinh Cung ${pA.cung}(${hA})` };
    if (khac(hA, hB)) return { rel: 'a_khac_b', label: `Cung ${pA.cung}(${hA}) khắc Cung ${pB.cung}(${hB})` };
    if (khac(hB, hA)) return { rel: 'b_khac_a', label: `Cung ${pB.cung}(${hB}) khắc Cung ${pA.cung}(${hA})` };
    if (hA === hB) return { rel: 'dong_hanh', label: `Tỷ hòa (${hA})` };
    return { rel: 'khong', label: 'Không rõ' };
  }

  function getGrowthStage(palace, stem) {
    if (!palace || !stem) return '';
    const dayHS = getStemOf(window.__LAST_CHART, 'day'), hourHS = getStemOf(window.__LAST_CHART, 'hour');
    if (stem === dayHS) return palace.growthCycle?.dayStem || '';
    if (stem === hourHS) return palace.growthCycle?.hourStem || '';
    if (palace.thienCanBan === stem) return palace.growthCycle?.heavenlyStem || '';
    if (palace.diaBan === stem) return palace.growthCycle?.earthlyStem || '';
    return '';
  }

  // ============================ UI FORMATTING ============================
  function line(label, value, type) {
    let cls = '';
    if (type === 'good') cls = 'style="color:var(--good);"';
    else if (type === 'bad') cls = 'style="color:var(--bad);"';
    else if (type === 'neutral') cls = 'style="color:var(--muted);"';
    return `<div style="margin-bottom:6px; font-size: 14.5px;"><strong>${label}:</strong> <span ${cls}>${value}</span></div>`;
  }
  function section(title) {
    return `<div style="margin:16px 0 8px 0;font-weight:700;border-left:4px solid #8a1f1f;padding-left:10px; background:#f9f9f9; padding-top:4px; padding-bottom:4px; border-radius: 2px;">${title}</div>`;
  }
  function note(text) {
    return `<div style="margin:8px 0;padding:8px;background:#fefce8;border-left:4px solid #ca8a04;color:#713f12; font-style: italic;">${text}</div>`;
  }

  function analyzePalaceDeep(palace, roleName, chart) {
    if (!palace) return line(roleName, 'Không xác định / Ẩn phục', 'neutral');
    let html = line(roleName, palaceSummary(palace, chart), 'info');
    let ts = getGrowthStage(palace, getHeavenlyStem(palace));
    if (ts) html += line(`  ↳ Vượng/Suy`, ts, ['Đế Vượng', 'Trường Sinh', 'Lâm Quan'].includes(ts) ? 'good' : 'neutral');
    const badPats = palace.patterns?.filter(p => p.loai === 'hung').map(p => p.ten) || [];
    const goodPats = palace.patterns?.filter(p => p.loai === 'cat').map(p => p.ten) || [];
    if (badPats.length) html += line(`  ↳ Hung cục`, badPats.join(', '), 'bad');
    if (goodPats.length) html += line(`  ↳ Cát cục`, goodPats.join(', '), 'good');
    return html;
  }

  function summarizeResult(score) {
    let summary = '', bg = '';
    if (score >= 3) { summary = '✅ TỔNG QUAN: Rất cát lợi, hanh thông, tỷ lệ thành công cao.'; bg = '#dcfce7; color: #166534;'; }
    else if (score > 0) { summary = '🌤️ TỔNG QUAN: Tương đối khả quan, có thể tiến hành nhưng cần chuẩn bị kỹ.'; bg = '#f0fdf4; color: #166534;'; }
    else if (score === 0) { summary = '⚖️ TỔNG QUAN: Trạng thái giằng co, 50/50. Cần quan sát thêm biến động.'; bg = '#f3f4f6; color: #1f2937;'; }
    else if (score > -3) { summary = '⚠️ TỔNG QUAN: Gặp trở ngại, nhiều rủi ro. Nên chậm lại hoặc tìm hướng khác.'; bg = '#fef08a; color: #92400e;'; }
    else { summary = '❌ TỔNG QUAN: Hung hiểm, bế tắc, nguy cơ thất bại cao. Tuyệt đối không nên manh động.'; bg = '#fee2e2; color: #991b1b;'; }
    return `<div style="margin-top:20px;padding:12px;background:${bg};border-radius:6px;font-weight:bold; font-size:15px; border: 1px solid rgba(0,0,0,0.1);">${summary}</div>`;
  }

  // ============================ PHÂN TÍCH CHUYÊN SÂU 26 CHỦ ĐỀ ============================
  const TOPIC_ANALYZERS = {};

  // 1. Cơ thể
  TOPIC_ANALYZERS[1] = function(chart) {
    let score = 0, html = section('Thông Số Bản Thân');
    const dayHS = getStemOf(chart, 'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    html += analyzePalaceDeep(pDay, 'Can Ngày (Bản thân)', chart);
    if (pDay && (isVoid(chart,pDay) || hasRuMu(pDay))) score -= 2;

    html += section('Triệu Chứng Bệnh Lý');
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế');
    html += analyzePalaceDeep(pNhue, 'Thiên Nhuế (Sao Bệnh)', chart);
    if (pNhue && pDay) {
        const rel = getRelationPalace(pNhue, pDay, chart);
        html += line('Quan hệ Bệnh ↔ Cơ thể', rel.label, rel.rel === 'a_khac_b' ? 'bad' : 'neutral');
        if (rel.rel === 'a_khac_b') { html += note('Bệnh khắc người: Bệnh tình chuyển biến xấu.'); score -= 3; }
        else if (rel.rel === 'b_khac_a') { html += note('Người khắc bệnh: Sức đề kháng tốt, sớm khỏi.'); score += 2; }
    }
    if (pNhue && isVoid(chart, pNhue)) { html += note('Bệnh rơi Không Vong: Bệnh giả, hoặc sớm khỏi.'); score += 1; }
    return { html, score };
  };

  // 2. Nghề nghiệp
  TOPIC_ANALYZERS[2] = function(chart) {
    let score = 0, html = section('Sự Nghiệp (Khai Môn)');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart,'Khai'), pSinh = findPalaceByGate(chart,'Sinh');
    const pZF = getZhifuPalace(chart), pThaiTue = findPalaceByEarthlyStem(chart, getEarthlyStemOf(chart,'year'));

    html += analyzePalaceDeep(pKhai, 'Khai Môn (Công việc)', chart);
    if (pKhai && isVoid(chart, pKhai)) { html += note('Khai Môn Không Vong: Công việc đình trệ, dễ mất việc.'); score -= 2; }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('Khai Môn Phản Ngâm: Sắp có biến động/thay đổi công việc.'); score -= 1; }

    html += section('Tài Lộc (Sinh Môn)');
    html += analyzePalaceDeep(pSinh, 'Sinh Môn (Lương thưởng)', chart);
    if (pSinh && pDay) {
        const rel = getRelationPalace(pSinh, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Lộc sinh người: Lương thưởng tốt, kiếm tiền dễ.'); score += 2; }
        else if (rel.rel === 'b_khac_a') { html += note('Người khắc lộc: Phải vất vả mới có tiền.'); score -= 1; }
    }

    html += section('Quan Hệ Cấp Trên');
    if(pZF) html += analyzePalaceDeep(pZF, 'Trực Phù (Sếp Trực Tiếp)', chart);
    if (pZF && pDay) {
        const rel = getRelationPalace(pZF, pDay, chart);
        if (rel.rel === 'a_khac_b') { html += note('Sếp khắc người: Dễ bị chèn ép, bất đồng.'); score -= 2; }
        else if (rel.rel === 'a_sinh_b') { html += note('Sếp sinh người: Được nâng đỡ cất nhắc.'); score += 2; }
    }
    return { html, score };
  };

  // 3. Thăng chức
  TOPIC_ANALYZERS[3] = function(chart) {
    let score = 0, html = section('Khả năng thăng chức');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart,'Khai'), pDo = findPalaceByGate(chart,'Đỗ');
    
    html += analyzePalaceDeep(pDay, 'Bản thân', chart);
    html += analyzePalaceDeep(pKhai, 'Khai Môn (Quyết định thăng chức)', chart);
    if (pKhai && isVoid(chart, pKhai)) { html += note('Khai Môn Tuần Không: Chưa có quyết định, hồ sơ bị treo.'); score -= 2; }
    else if (pKhai && pDay) {
        const rel = getRelationPalace(pKhai, pDay, chart);
        if (rel.rel === 'a_sinh_b' || rel.rel === 'dong_hanh') { html += note('Quyết định sinh/hòa Bản thân: Cơ hội thăng chức cực cao.'); score += 3; }
        else if (rel.rel === 'a_khac_b') { html += note('Quyết định khắc Bản thân: Thăng chức thất bại hoặc vị trí mới áp lực lớn.'); score -= 2; }
    }
    
    html += section('Người Đề Bạt / Hỗ Trợ');
    html += analyzePalaceDeep(pDo, 'Đỗ Môn (Hồ sơ/Người push)', chart);
    return { html, score };
  };

  // 4. Tìm người dẫn đường
  TOPIC_ANALYZERS[4] = function(chart) {
    let score = 0, html = section('Xác Định Phương Hướng');
    const pPhu = findPalaceByStarName(chart, 'Thiên Phụ');
    html += analyzePalaceDeep(pPhu, 'Thiên Phụ (Người dẫn đường)', chart);
    if (pPhu) {
        html += note(`Hãy tìm kiếm ở hướng: ${palaceDirection(pPhu.cung, chart)} (Cung ${palaceName(pPhu.cung, chart)}).`);
        score += 1;
        if(isVoid(chart, pPhu)) { html += note('Cung Không Vong: Người dẫn đường vắng mặt hoặc chỉ dẫn sai.'); score -= 2; }
    } else { html += note('Ẩn phục: Khó tìm thấy người dẫn đường lúc này.'); score -= 1; }
    return { html, score };
  };

  // 5. Chuyển việc
  TOPIC_ANALYZERS[5] = function(chart) {
    let score = 0, html = section('Đánh Giá Chuyển Việc');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart,'Khai'), pDo = findPalaceByGate(chart,'Đỗ');
    
    html += analyzePalaceDeep(pDay, 'Công việc hiện tại (Bản thân)', chart);
    html += analyzePalaceDeep(pKhai, 'Sự nghiệp tương lai', chart);
    html += analyzePalaceDeep(pDo, 'Công ty dự định chuyển đến', chart);

    if (pKhai && isVoid(chart, pKhai)) { html += note('Tương lai Không Vong: Không nên chuyển lúc này, dễ thất nghiệp.'); score -= 2; }
    if (pDo && pDay) {
        const rel = getRelationPalace(pDo, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Công ty mới sinh Bản thân: Nơi mới rất tốt, đãi ngộ cao.'); score += 2; }
        else if (rel.rel === 'a_khac_b') { html += note('Công ty mới khắc Bản thân: Môi trường mới khắcệt, không hợp.'); score -= 2; }
    }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('Có dấu hiệu dịch chuyển thành công nhưng bấp bênh ban đầu.'); score += 1; }
    return { html, score };
  };

  // 6. Xin việc
  TOPIC_ANALYZERS[6] = function(chart) {
    let score = 0, html = section('Phỏng Vấn & Quyết Định');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart,'Khai'), pDo = findPalaceByGate(chart,'Đỗ');

    html += analyzePalaceDeep(pDo, 'Đỗ Môn (Buổi phỏng vấn)', chart);
    if (pDo && isVoid(chart, pDo)) { html += note('Buổi phỏng vấn rủi ro cao, chuẩn bị kém hoặc bị dời lịch.'); score -= 1; }

    html += analyzePalaceDeep(pKhai, 'Khai Môn (Kết quả)', chart);
    if (pKhai && pDay) {
        const rel = getRelationPalace(pKhai, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Khai Môn sinh Người: Chắc chắn đậu, công ty chủ động mời.'); score += 3; }
        else if (rel.rel === 'a_khac_b') { html += note('Khai Môn khắc Người: Đánh rớt hoặc điều kiện không thể nhận.'); score -= 2; }
        else if (isVoid(chart, pKhai)) { html += note('Khai Môn Không Vong: Chưa có kết quả, cần chờ đợi.'); score -= 1; }
    }
    return { html, score };
  };

  // 7. Mua hàng
  TOPIC_ANALYZERS[7] = function(chart) {
    let score = 0, html = section('Tương Quan Mua Hàng');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pCanh = findPalaceByGate(chart,'Cảnh');

    html += analyzePalaceDeep(pDay, 'Người Mua', chart);
    html += analyzePalaceDeep(pHour, 'Sản Phẩm', chart);
    
    if (pDay && pHour) {
        const rel = getRelationPalace(pHour, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Sản phẩm sinh Người mua: Hàng cực tốt, đáp ứng đúng nhu cầu.'); score += 2; }
        else if (rel.rel === 'a_khac_b') { html += note('Sản phẩm khắc Người mua: Hàng kém chất lượng hoặc không phù hợp.'); score -= 2; }
    }
    
    html += analyzePalaceDeep(pCanh, 'Thị Trường (Cảnh Môn)', chart);
    if (pCanh && isVoid(chart, pCanh)) { html += note('Thị trường ảo, giá bị thổi phồng, cẩn thận mua hớ.'); score -= 1; }
    return { html, score };
  };

  // 8. Bán hàng
  TOPIC_ANALYZERS[8] = function(chart) {
    let score = 0, html = section('Phân Tích Bán Hàng');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pSinh = findPalaceByGate(chart,'Sinh');
    const pTS = getZhishiPalace(chart); // Khách hàng

    html += analyzePalaceDeep(pHour, 'Sản Phẩm', chart);
    html += analyzePalaceDeep(pTS, 'Khách Hàng (Trực Sử)', chart);
    
    if (pHour && pTS) {
        const rel = getRelationPalace(pHour, pTS, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Sản phẩm hợp thị hiếu Khách hàng, rất dễ chốt sale.'); score += 2; }
        else if (rel.rel === 'a_khac_b') { html += note('Khách chê sản phẩm, khó bán.'); score -= 1; }
    }

    html += analyzePalaceDeep(pSinh, 'Lợi Nhuận (Sinh Môn)', chart);
    if (pSinh && pHour) {
        const rel2 = getRelationPalace(pHour, pSinh, chart);
        if (rel2.rel === 'a_sinh_b') { html += note('Bán ra tiền, biên độ lợi nhuận cao.'); score += 2; }
        else if (rel2.rel === 'a_khac_b') { html += note('Sản phẩm bào mòn lợi nhuận (khuyến mãi nhiều, chi phí cao).'); score -= 2; }
    }
    return { html, score };
  };

  // 9. Mở kinh doanh
  TOPIC_ANALYZERS[9] = function(chart) {
    let score = 0, html = section('Khởi Sự Kinh Doanh');
    const pKhai = findPalaceByGate(chart,'Khai');
    html += analyzePalaceDeep(pKhai, 'Dụng Thần Khởi Sự (Khai Môn)', chart);

    if (!pKhai) { html += note('Khai Môn ẩn phục: Chưa tới thời cơ mở cửa.'); return { html, score: -2 }; }
    if (isVoid(chart, pKhai)) { html += note('Khai Môn Tuần Không: Kế hoạch dễ đổ vỡ, vốn liếng hụt.'); score -= 3; }
    
    const deity = getEffectiveDeityName(pKhai, chart);
    if (deity.includes('Trực Phù')) { html += note('Có Trực Phù: Hanh thông, có người đỡ đầu lớn.'); score += 2; }
    if (deity.includes('Huyền Vũ') || deity.includes('Đằng Xà')) { html += note('Gặp Huyền Vũ/Đằng Xà: Dễ dính pháp lý, tiểu nhân phá hoại, thất thoát.'); score -= 2; }
    
    if (hasPattern(pKhai, 'phục ngâm')) { html += note('Cục Phục Ngâm: Trì trệ, khách lưa thưa, kẹt vốn.'); score -= 2; }
    return { html, score };
  };

  // 10. Hợp tác
  TOPIC_ANALYZERS[10] = function(chart) {
    let score = 0, html = section('Đánh Giá Đối Tác');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');

    html += analyzePalaceDeep(pDay, 'Bản Thân', chart);
    html += analyzePalaceDeep(pHour, 'Đối Tác', chart);
    
    if (pDay && pHour) {
        const rel = getRelationPalace(pDay, pHour, chart);
        if (rel.rel === 'dong_hanh' || rel.rel.includes('sinh')) { html += note('Hai bên hòa hợp, dễ làm việc chung.'); score += 2; }
        else if (rel.rel.includes('khac')) { html += note('Hai bên tương khắc, sẽ nảy sinh mâu thuẫn lợi ích gay gắt.'); score -= 2; }
    }

    html += analyzePalaceDeep(pLH, 'Sợi Dây Liên Kết (Lục Hợp)', chart);
    if (pLH && isVoid(chart, pLH)) { html += note('Lục Hợp Tuần Không: Hợp đồng ảo, đối tác dễ bỏ ngang giữa chừng.'); score -= 2; }
    return { html, score };
  };

  // 11. Mua bán BĐS
  TOPIC_ANALYZERS[11] = function(chart) {
    let score = 0, html = section('Hạng Mục Bất Động Sản');
    const pSinh = findPalaceByGate(chart,'Sinh'), pTu = findPalaceByGate(chart,'Tử');
    const pCanh = findPalaceByGate(chart,'Cảnh'), pMau = findPalaceByHeavenlyStem(chart,'Mậu');

    html += analyzePalaceDeep(pSinh, 'Nhà Cửa (Sinh Môn)', chart);
    html += analyzePalaceDeep(pTu, 'Đất Đai (Tử Môn)', chart);
    html += analyzePalaceDeep(pCanh, 'Pháp Lý / Sổ Đỏ (Cảnh Môn)', chart);
    
    if (pCanh && isVoid(chart, pCanh)) { html += note('Pháp lý Không Vong: Chú ý giấy tờ giả, chưa ra sổ được.'); score -= 2; }
    
    html += analyzePalaceDeep(pMau, 'Vốn Liếng (Mậu)', chart);
    if (pMau && hasRuMu(pMau)) { html += note('Vốn Nhập Mộ: Kẹt tiền, khó xoay vòng vốn.'); score -= 2; }
    
    return { html, score };
  };

  // 12. Đi vay, cho vay
  TOPIC_ANALYZERS[12] = function(chart) {
    let score = 0, html = section('Giao Dịch Vay Mượn');
    const pZF = getZhifuPalace(chart); // Chủ nợ
    const pTS = getZhishiPalace(chart); // Con nợ

    html += analyzePalaceDeep(pZF, 'Người Cho Vay (Trực Phù)', chart);
    html += analyzePalaceDeep(pTS, 'Người Đi Vay (Trực Sử)', chart);

    if (pZF && pTS) {
        const rel = getRelationPalace(pTS, pZF, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Người Vay sinh Người Cho Vay: Trả lãi sòng phẳng, giao dịch tốt.'); score += 2; }
        else if (rel.rel === 'a_khac_b') { html += note('Người Vay khắc Người Cho Vay: Dễ giật nợ, xù nợ.'); score -= 2; }
        else if (rel.rel === 'b_khac_a') { html += note('Cho Vay khắc Vay: Ép uổng, siết nợ gắt gao.'); score += 1; }
    }
    return { html, score };
  };

  // 13. Đòi nợ
  TOPIC_ANALYZERS[13] = function(chart) {
    let score = 0, html = section('Tiến Trình Đòi Nợ');
    const pThuong = findPalaceByGate(chart,'Thương'), pSinh = findPalaceByGate(chart,'Sinh');
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS); // Con nợ

    html += analyzePalaceDeep(pThuong, 'Hành Động Đòi Nợ (Thương Môn)', chart);
    if (pThuong && isVoid(chart, pThuong)) { html += note('Thương Môn Không Vong: Đòi nợ bất thành, tốn công vô ích.'); score -= 2; }

    html += analyzePalaceDeep(pHour, 'Con Nợ (Can Giờ)', chart);
    if (pHour && isHorse(chart, pHour)) { html += note('Con nợ có Dịch Mã: Dấu hiệu bỏ trốn, lẩn tránh.'); score -= 2; }

    html += analyzePalaceDeep(pSinh, 'Khoản Tiền (Sinh Môn)', chart);
    if (pSinh && hasRuMu(pSinh)) { html += note('Tiền Nhập Mộ: Tiền chết, chưa thể lấy ra được.'); score -= 1; }
    return { html, score };
  };

  // 14. Thi đấu
  TOPIC_ANALYZERS[14] = function(chart) {
    let score = 0, html = section('Tương Quan Lực Lượng');
    const hourHS = getStemOf(chart,'hour');
    const pHourEarth = findPalaceByEarthlyStem(chart, hourHS); // Chủ nhà
    const pHourHeaven = findPalaceByHeavenlyStem(chart, hourHS); // Khách
    const pZF = getZhifuPalace(chart); // Trọng tài

    html += analyzePalaceDeep(pHourEarth, 'Đội Chủ Nhà (Địa Bàn Giờ)', chart);
    html += analyzePalaceDeep(pHourHeaven, 'Đội Khách (Thiên Bàn Giờ)', chart);

    if (pHourEarth && pHourHeaven) {
        const rel = getRelationPalace(pHourHeaven, pHourEarth, chart);
        if (rel.rel === 'a_khac_b') { html += note('Khách khắc Chủ: Đội khách áp đảo, khả năng thắng cao.'); score -= 1; }
        else if (rel.rel === 'b_khac_a') { html += note('Chủ khắc Khách: Sân nhà phát huy uy lực, chủ nhà thắng.'); score += 1; }
        else { html += note('Hai bên ngang tài ngang sức.'); }
    }

    html += analyzePalaceDeep(pZF, 'Trọng Tài (Trực Phù)', chart);
    return { html, score };
  };

  // 15. Thi cử
  TOPIC_ANALYZERS[15] = function(chart) {
    let score = 0, html = section('Đánh Giá Kì Thi');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pCanh = findPalaceByGate(chart,'Cảnh'); // Bài thi
    const pPhu = findPalaceByStarName(chart,'Thiên Phụ'); // Giám khảo

    html += analyzePalaceDeep(pDay, 'Thí Sinh', chart);
    html += analyzePalaceDeep(pCanh, 'Bài Thi / Điểm Số (Cảnh Môn)', chart);
    
    if (pCanh && isVoid(chart, pCanh)) { html += note('Cảnh Môn Tuần Không: Điểm thấp, làm bài lạc đề.'); score -= 2; }
    if (pCanh && pDay) {
        const rel = getRelationPalace(pCanh, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('Đề thi sinh Thí sinh: Trúng tủ, điểm cao.'); score += 3; }
        else if (rel.rel === 'b_khac_a') { html += note('Thí sinh khắc Đề: Làm bài vất vả nhưng vẫn qua.'); score += 1; }
    }
    
    html += analyzePalaceDeep(pPhu, 'Giám Khảo (Thiên Phụ)', chart);
    return { html, score };
  };

  // 16. Chỗ đỗ xe
  TOPIC_ANALYZERS[16] = function(chart) {
    let score = 0, html = section('Tọa Độ Đỗ Xe');
    const voids = getAllVoidPalaces(chart);
    if (voids.length) {
        voids.forEach(p => {
            html += note(`Có chỗ trống tại Cung ${palaceName(p.cung, chart)} - Hướng ${palaceDirection(p.cung, chart)}.`);
            score += 1;
        });
    } else {
        html += note('Không tìm thấy cung Không Vong, bãi xe có thể đã đầy.'); score -= 1;
    }
    return { html, score };
  };

  // 17. Du lịch
  TOPIC_ANALYZERS[17] = function(chart) {
    let score = 0, html = section('Chuyến Đi');
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS);
    
    html += analyzePalaceDeep(pHour, 'Hành Trình (Can Giờ)', chart);
    if (pHour && isVoid(chart, pHour)) { html += note('Can Giờ Không Vong: Chuyến đi dễ bị hủy hoặc không như ý.'); score -= 2; }
    if (pHour && hasPattern(pHour, 'Lục Nghi Kích Hình')) { html += note('Gặp Kích Hình: Cẩn thận tai nạn, xô xát dọc đường.'); score -= 2; }
    
    const pBong = findPalaceByStarName(chart,'Thiên Bồng');
    if (pBong && pBong.cung === pHour?.cung) { html += note('Gặp Thiên Bồng: Đề phòng trộm cắp, thời tiết xấu làm lỡ chuyến.'); score -= 1; }
    
    return { html, score };
  };

  // 18. Hôn nhân
  TOPIC_ANALYZERS[18] = function(chart) {
    let score = 0, html = section('Định Vị Tình Trạng Hôn Nhân');
    const pAt = findPalaceByHeavenlyStem(chart,'Ất'); // Vợ
    const pCanh = findPalaceByHeavenlyStem(chart,'Canh'); // Chồng
    const pLH = findPalaceByDeityName(chart,'Lục Hợp'); // Hôn nhân

    html += analyzePalaceDeep(pAt, 'Ất (Bên Nữ/Vợ)', chart);
    html += analyzePalaceDeep(pCanh, 'Canh (Bên Nam/Chồng)', chart);
    html += analyzePalaceDeep(pLH, 'Lục Hợp (Sợi dây hôn nhân)', chart);

    if (pLH && isVoid(chart, pLH)) { html += note('Lục Hợp Không Vong: Hôn nhân chưa thành hoặc liên kết lỏng lẻo, dễ đứt gãy.'); score -= 2; }
    if (pLH && hasPattern(pLH, 'phục ngâm')) { html += note('Lục Hợp Phục Ngâm: Quan hệ bế tắc kéo dài, chưa dứt được.'); score -= 1; }

    if (pAt && pCanh) {
        html += section('Tương Tác Vợ Chồng');
        const rel = getRelationPalace(pAt, pCanh, chart);
        html += line('Vợ (Ất) ↔ Chồng (Canh)', rel.label, rel.rel.includes('sinh') ? 'good' : (rel.rel.includes('khac') ? 'bad' : 'neutral'));
        if (rel.rel === 'dong_hanh' || rel.rel.includes('sinh')) { html += note('Hai bên hòa hợp, sinh trợ lẫn nhau.'); score += 3; }
        else if (rel.rel.includes('khac')) { html += note('Hai bên tương khắc, dễ mâu thuẫn cãi vã lớn.'); score -= 2; }
        if (pAt.cung === pCanh.cung) { html += note('Canh Ất Đồng Cung: Vợ chồng dính chặt như sam.'); score += 2; }
    }

    // Yếu tố người thứ 3
    let thirdParty = [];
    if (pAt && (pAt.thienBan === 'Bính' || pAt.diaBan === 'Bính')) thirdParty.push('Bên nữ có bóng dáng nam giới khác (Bính).');
    if (pCanh && (pCanh.thienBan === 'Đinh' || pCanh.diaBan === 'Đinh')) thirdParty.push('Bên nam có bóng dáng nữ giới khác (Đinh).');
    if (thirdParty.length) {
        html += section('⚠️ Tín Hiệu Rủi Ro Ngoại Tình');
        thirdParty.forEach(t => { html += line('Cảnh báo', t, 'bad'); score -= 3; });
    }
    return { html, score };
  };

  // 19. Sinh nở (giới tính)
  TOPIC_ANALYZERS[19] = function(chart) {
    let score = 0, html = section('Dự Đoán Giới Tính');
    const pKhon = getPalace(chart, 2); // Khôn là mẹ
    html += analyzePalaceDeep(pKhon, 'Cung Khôn (Người Mẹ)', chart);
    
    if (pKhon) {
        const gate = pKhon.batMon || '', star = pKhon.thienBan || '';
        const yangGates = ['Khai','Sinh','Thương','Đỗ'], yangStars = ['Thiên Xung','Thiên Phụ','Thiên Anh','Thiên Tâm','Thiên Cầm'];
        let male = yangGates.includes(gate) || yangStars.some(s => star.includes(s));
        
        if (male) { html += note('Tín hiệu Dương mạnh: Dự sinh BÉ TRAI.'); score += 1; }
        else { html += note('Tín hiệu Âm bao trùm: Dự sinh BÉ GÁI.'); score += 1; }
    }
    return { html, score };
  };

  // 20. Sinh nở (An toàn)
  TOPIC_ANALYZERS[20] = function(chart) {
    let score = 0, html = section('Mức Độ An Toàn');
    const pKhon = getPalace(chart,2), pNhue = findPalaceByStarName(chart,'Thiên Nhuế');
    
    html += analyzePalaceDeep(pKhon, 'Cung Khôn (Em Bé)', chart);
    html += analyzePalaceDeep(pNhue, 'Thiên Nhuế (Mẹ)', chart);
    
    if (hasPattern(pKhon, 'phục ngâm')) { html += note('Cung Khôn Phục Ngâm: Sinh lâu, trở dạ kéo dài.'); score -= 1; }
    if (getEffectiveDeityName(pKhon, chart).includes('Bạch Hổ')) { html += note('Có Bạch Hổ: Sinh nhanh, nhưng coi chừng băng huyết.'); score -= 1; }

    if (pNhue && pKhon) {
        const rel = getRelationPalace(pNhue, pKhon, chart);
        if (rel.rel === 'a_khac_b') { html += note('Mẹ khắc Bé: Sinh đẻ an toàn, thuận lợi.'); score += 2; }
        else if (rel.rel === 'b_khac_a') { html += note('Bé khắc Mẹ: Đẻ khó, mẹ gặp nguy hiểm.'); score -= 2; }
    }
    return { html, score };
  };

  // 21. Sức khỏe
  TOPIC_ANALYZERS[21] = function(chart) {
    let score = 0, html = section('Chẩn Đoán Bệnh');
    const dayHS = getStemOf(chart, 'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế'); // Bệnh
    const pTam = findPalaceByStarName(chart, 'Thiên Tâm'); // Thuốc Tây/Bác sĩ
    
    html += analyzePalaceDeep(pDay, 'Người Bệnh', chart);
    html += analyzePalaceDeep(pNhue, 'Nguồn Bệnh (Thiên Nhuế)', chart);

    if (pNhue && pDay) {
        const rel = getRelationPalace(pNhue, pDay, chart);
        if (rel.rel === 'a_khac_b') { html += note('Bệnh khắc Người: Nguy kịch, bệnh tình diễn biến xấu nhanh.'); score -= 3; }
        else if (rel.rel === 'b_khac_a') { html += note('Người khắc Bệnh: Phục hồi nhanh.'); score += 2; }
    }

    if (pNhue && isVoid(chart, pNhue)) { html += note('Thiên Nhuế Không Vong: Bệnh giả, hoặc mới ủ bệnh dễ chữa.'); score += 1; }
    
    html += analyzePalaceDeep(pTam, 'Thuốc Trị (Thiên Tâm)', chart);
    if (pTam && pNhue) {
        const rel2 = getRelationPalace(pTam, pNhue, chart);
        if (rel2.rel === 'a_khac_b') { html += note('Thuốc khắc Bệnh: Gặp đúng thầy đúng thuốc, trị dứt điểm.'); score += 2; }
        else { html += note('Thuốc không khắc Bệnh: Phương pháp điều trị hiện tại chưa hiệu quả.'); score -= 1; }
    }
    return { html, score };
  };

  // 22. Kiện tụng
  TOPIC_ANALYZERS[22] = function(chart) {
    let score = 0, html = section('Tiến Trình Kiện Tụng');
    const pKhai = findPalaceByGate(chart,'Khai'); // Tòa
    const pCanh = findPalaceByGate(chart,'Cảnh'); // Đơn từ
    const pZF = getZhifuPalace(chart); // Nguyên cáo

    html += analyzePalaceDeep(pKhai, 'Quan Tòa (Khai Môn)', chart);
    if (pKhai && isVoid(chart, pKhai)) { html += note('Khai Môn Không Vong: Thiếu chứng cứ, tòa chưa thể phân xử.'); score -= 2; }
    if (pKhai && hasRuMu(pKhai)) { html += note('Khai Môn Nhập Mộ: Án bị treo, dời ngày xét xử.'); score -= 1; }

    html += analyzePalaceDeep(pCanh, 'Đơn Kiện (Cảnh Môn)', chart);
    if (pKhai && pCanh) {
        const rel = getRelationPalace(pKhai, pCanh, chart);
        if (rel.rel === 'a_khac_b') { html += note('Tòa khắc Đơn: Bác đơn, không thụ lý.'); score -= 2; }
    }
    
    html += analyzePalaceDeep(pZF, 'Nguyên Cáo (Trực Phù)', chart);
    return { html, score };
  };

  // 23. Tố tụng hình sự
  TOPIC_ANALYZERS[23] = function(chart) {
    let score = 0, html = section('Hồ Sơ Tội Phạm');
    const pTan = findPalaceByHeavenlyStem(chart,'Tân'); // Tội phạm
    
    html += analyzePalaceDeep(pTan, 'Tội Phạm (Tân)', chart);
    if (!pTan) { return { html: html + note('Chưa rõ tung tích tội phạm.'), score }; }

    if (hasPattern(pTan, 'Kích Hình')) { html += note('Tân Kích Hình: Tội danh rất nặng, khó thoát.'); score -= 3; }
    if (isVoid(chart, pTan)) { html += note('Tân Không Vong: Bằng chứng chưa rõ, dễ được tại ngoại.'); score += 2; }
    if (hasRuMu(pTan)) { html += note('Tân Nhập Mộ: Đang bị giam giữ gắt gao.'); score -= 1; }
    
    const d = getEffectiveDeityName(pTan, chart);
    if (d.includes('Đằng Xà')) html += note('Đằng Xà: Tính chất lừa đảo, xảo quyệt.');
    if (d.includes('Huyền Vũ')) html += note('Huyền Vũ: Tham ô, trộm cắp, giấu giếm.');
    
    return { html, score };
  };

  // 24. Đi lạc
  TOPIC_ANALYZERS[24] = function(chart) {
    let score = 0, html = section('Tìm Người Đi Lạc');
    const dayHS = getStemOf(chart,'day'), pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const hourHS = getStemOf(chart,'hour'), pHour = findPalaceByHeavenlyStem(chart, hourHS);
    
    html += analyzePalaceDeep(pHour, 'Người Lạc (Can Giờ)', chart);
    
    if (pDay && pHour && pDay.cung === pHour.cung) { html += note('Đồng cung: Sẽ sớm tìm được hoặc tự quay về.'); score += 3; }
    if (hasGlobalPattern(chart, 'Phản Ngâm')) { html += note('Cục Phản Ngâm: Chắc chắn sẽ quay lại.'); score += 2; }
    if (hasGlobalPattern(chart, 'Phục Ngâm')) { html += note('Cục Phục Ngâm: Bị mắc kẹt hoặc không muốn về.'); score -= 2; }
    
    const d = getEffectiveDeityName(pHour, chart);
    if (d.includes('Huyền Vũ')) { html += note('Có Huyền Vũ: Bị người khác lừa gạt đi mất.'); score -= 1; }
    if (d.includes('Đằng Xà')) { html += note('Có Đằng Xà: Có dấu hiệu bị bắt giữ.'); score -= 2; }
    return { html, score };
  };

  // 25. Mất đồ
  TOPIC_ANALYZERS[25] = function(chart) {
    let score = 0, html = section('Dấu Vết Đồ Vật');
    const dayHS = getStemOf(chart,'day'), hourHS = getStemOf(chart,'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS), pHour = findPalaceByHeavenlyStem(chart, hourHS);

    html += analyzePalaceDeep(pHour, 'Vật Mất (Can Giờ)', chart);
    
    if (pDay && pHour && pDay.cung === pHour.cung) { html += note('Ngày Giờ Đồng Cung: Đồ đạc vẫn loanh quanh đâu đó, sẽ tìm lại được.'); score += 3; }
    if (pHour && isVoid(chart, pHour)) { html += note('Vật Không Vong: Mất thật rồi, khả năng tìm lại bằng 0.'); score -= 3; }
    if (hasGlobalPattern(chart, 'Phản Ngâm')) { html += note('Cục Phản Ngâm: Đồ đi rồi lại về.'); score += 2; }
    
    const d = getEffectiveDeityName(pHour, chart);
    if (d.includes('Huyền Vũ')) { html += note('Có Huyền Vũ: Có kẻ trộm cắp dòm ngó.'); score -= 2; }
    return { html, score };
  };

  // 26. Thời tiết
  TOPIC_ANALYZERS[26] = function(chart) {
    let score = 0, html = section('Dự Báo Khí Tượng');
    const WSTEM = { 'Giáp':'Gió','Ất':'Gió','Bính':'Nóng','Đinh':'Nóng','Mậu':'Mây','Kỷ':'Mây', 'Canh':'Lạnh','Tân':'Lạnh','Nhâm':'Mưa','Quý':'Mưa' };
    const WSTAR = { 'Thiên Anh':'Nắng','Thiên Phụ':'Gió','Thiên Trụ':'Mưa','Thiên Bồng':'Mưa','Thiên Xung':'Sấm' };
    const wc = {};
    
    for (const p of getAllPalaces(chart)) {
      const hs = p.thienCanBan || '', s = p.thienBan || '';
      if (WSTEM[hs]) wc[WSTEM[hs]] = (wc[WSTEM[hs]] || 0) + 1;
      for (const [n, w] of Object.entries(WSTAR)) { if (s.includes(n)) wc[w] = (wc[w] || 0) + 1; }
    }
    
    const sorted = Object.entries(wc).sort((a,b) => b[1] - a[1]);
    if (!sorted.length) return { html: html + note('Bàn kỳ môn chưa rõ tín hiệu.'), score };
    
    html += `<div style="margin-top:10px;">`;
    for (const [w,cnt] of sorted) {
      html += line(`Yếu tố [${w}]`, `${cnt} lần xuất hiện`, cnt >= 3 ? 'bad' : 'info');
    }
    html += `</div>`;
    html += note(`Dự báo chính: ${sorted[0][0].toUpperCase()}`);
    return { html, score: 0 };
  };

  // ============================ KÍCH HOẠT ============================
  function runAnalysis(chartArg) {
    const select = document.getElementById('topicSelect');
    const topicId = select ? select.value : '';
    const resultDiv = document.getElementById('analysisResult');
    
    if (!topicId) {
      if (resultDiv) resultDiv.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">Vui lòng chọn chủ đề bên trái để hệ thống tiến hành luận giải chuyên sâu.</div>';
      return;
    }
    const chart = chartArg || getCurrentChart();
    if (!chart) {
      if (resultDiv) resultDiv.innerHTML = '<div style="color:red;padding:20px;">Chưa có dữ liệu Lập bàn. Hãy bấm "Lập Bàn" phía trên.</div>';
      return;
    }
    
    try {
      const fn = TOPIC_ANALYZERS[Number(topicId)];
      if (!fn) { resultDiv.innerHTML = '<div style="color:red;">Lỗi phân tích chủ đề này.</div>'; return; }
      
      const analysisObj = fn(chart);
      let finalHtml = analysisObj.html + summarizeResult(analysisObj.score);
      
      if (resultDiv) resultDiv.innerHTML = finalHtml;
    } catch (e) {
      console.error(e);
      if (resultDiv) resultDiv.innerHTML = '<div style="color:red; font-weight:bold;padding:20px;">Lỗi xử lý logic luận quẻ. Hãy kiểm tra Console Log.</div>';
    }
  }

  function bindUIEvents() {
    const select = document.getElementById('topicSelect');
    if (select) {
      select.addEventListener('change', function() {
        const topicId = this.value;
        const guideDiv = document.getElementById('topicGuide');
        if (guideDiv) guideDiv.innerHTML = renderTopicGuide(topicId);
        runAnalysis();
      });
    }
    const reAnalyzeBtn = document.getElementById('btnReAnalyze');
    if (reAnalyzeBtn) reAnalyzeBtn.addEventListener('click', () => runAnalysis());
    const clearNoteBtn = document.getElementById('btnClearNote');
    const noteArea = document.getElementById('analysisNote');
    if (clearNoteBtn && noteArea) clearNoteBtn.addEventListener('click', () => noteArea.value = '');
  }

  function bindChartEvents() {
    if (window.ChartEvents) window.ChartEvents.on('chartCalculated', (chart) => runAnalysis(chart));
  }

  function initLogicLuanQue() {
    bindUIEvents();
    bindChartEvents();
    if (window.__LAST_CHART) {
      runAnalysis(window.__LAST_CHART);
      const select = document.getElementById('topicSelect');
      if (select && select.value) {
        const guideDiv = document.getElementById('topicGuide');
        if (guideDiv) guideDiv.innerHTML = renderTopicGuide(select.value);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLogicLuanQue);
  else initLogicLuanQue();

})();
