// LogicLuanQue.js
// BẢNG LUẬN QUẺ - LOGIC 26 CHỦ ĐỀ HD

(function () {
  'use strict';

  if (typeof HaDoBanKyMon === 'undefined' || !HaDoBanKyMon.utils) {
    throw new Error('Engine KyMonBanHaDo.js hoặc HaDoBanKyMon.utils không khả dụng!');
  }

  const _U = HaDoBanKyMon.utils;

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

  // ============================ HELPER MỞ RỘNG ============================
  function getCurrentChart() { return window.__LAST_CHART || null; }

  function getPalace(chart, pos) {
    return (chart.palaces || []).find(p => p.cung === pos) || null;
  }

  function getAllPalaces(chart) {
    return chart.palaces || [];
  }

  function getStemOf(chart, pillar) {
  const fp = chart.fourPillars || {};
  const obj = fp[pillar];
  if (!obj) return '';
  let can = obj.can || '';
  if (can.includes(' ')) {
    can = can.split(' ')[0];
  }
  return can;
}

  function getStemElement(stemVI) {
    return _U.NGU_HANH_CAN[stemVI] || '';
  }

  function sheng(a, b) {
    return _U.tuongSinh(a, b);
  }

  function khac(a, b) {
    return _U.tuongKhac(a, b);
  }

  function normalizeGateName(gateName) {
    return String(gateName || '').replace(/ ?[Mm]ôn$/, '').trim();
  }

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
    return getAllPalaces(chart).find(p => {
      const d = getEffectiveDeityName(p, chart);
      return d.includes(deityName);
    }) || null;
  }

  function getZhifuPalace(chart) {
    return getAllPalaces(chart).find(p => p.isZhiFu === true) || null;
  }

  function getZhishiPalace(chart) {
    return getAllPalaces(chart).find(p => p.isZhiShi === true) || null;
  }

  function isVoid(chart, palace) {
    if (!palace) return false;
    const kv = chart.tuanThu?.khongVong || [];
    const chiCung = palace.chiCung || '';
    return kv.includes(chiCung);
  }

  function getAllVoidPalaces(chart) {
    return getAllPalaces(chart).filter(p => isVoid(chart, p));
  }

  function getHeavenlyStem(palace) {
    return palace?.thienCanBan || '';
  }

  function getEarthlyStem(palace) {
    return palace?.diaBan || '';
  }

  function findPalaceByHeavenlyStem(chart, stemVI) {
    return getAllPalaces(chart).find(p => p.thienCanBan === stemVI) || null;
  }

  function findPalaceByEarthlyStem(chart, stemVI) {
    return getAllPalaces(chart).find(p => p.diaBan === stemVI) || null;
  }

  function hasPattern(palace, nameSubstr) {
    if (!palace || !Array.isArray(palace.patterns)) return false;
    return palace.patterns.some(p => (p.ten || '').includes(nameSubstr));
  }

  function _flattenChartPatterns(chart) {
    const all = [];
    for (const p of getAllPalaces(chart)) {
      if (p.patterns) all.push(...p.patterns);
    }
    return all;
  }

  function hasGlobalPattern(chart, nameSubstr) {
    return _flattenChartPatterns(chart).some(p => (p.ten || '').includes(nameSubstr));
  }

  function hasRuMu(palace) {
    if (!palace) return false;
    if (palace.isMoKho === true) return true;
    return hasPattern(palace, 'Nhập Mộ') || hasPattern(palace, 'nhập mộ');
  }

  function palaceName(pos) {
    const meta = _U.CUNG_META[pos];
    return meta ? meta.ten : '';
  }

  const PALACE_META = (function() {
    const m = {};
    for (let i = 1; i <= 9; i++) {
      const meta = _U.CUNG_META[i];
      m[i] = {
        direction: meta ? meta.huong : '',
        trigram: meta ? meta.ten : ''
      };
    }
    return m;
  })();

  function palaceMeta(pos) {
    return PALACE_META[Number(pos)] || { direction: '', trigram: '' };
  }

  function palaceSummary(p, chart) {
    if (!p) return '—';
    const meta = palaceMeta(p.cung);
    let parts = [];
    if (meta.trigram) parts.push(meta.trigram);
    if (meta.direction) parts.push(`(${meta.direction})`);
    if (p.batMon) parts.push(p.batMon);
    if (p.thienBan) parts.push(p.thienBan);
    if (p.thienBanDongCung) parts.push(p.thienBanDongCung);
    const deity = getEffectiveDeityName(p, chart);
    if (deity) parts.push(deity);
    const hs = getHeavenlyStem(p);
    const es = getEarthlyStem(p);
    if (hs || es) parts.push(`${hs || '—'}/${es || '—'}`);
    return parts.join(' · ') || `Cung ${p.cung}`;
  }

  function getRelation(stemA, stemB) {
    if (!stemA || !stemB) return { rel: 'khong', label: 'Không xác định', isAuspicious: false };
    const aEl = getStemElement(stemA);
    const bEl = getStemElement(stemB);
    if (!aEl || !bEl) return { rel: 'khong', label: 'Không xác định', isAuspicious: false };
    if (sheng(aEl, bEl)) return { rel: 'a_sinh_b', label: `${stemA}(${aEl}) sinh ${stemB}(${bEl})`, isAuspicious: true };
    if (sheng(bEl, aEl)) return { rel: 'b_sinh_a', label: `${stemB}(${bEl}) sinh ${stemA}(${aEl})`, isAuspicious: true };
    if (khac(aEl, bEl)) return { rel: 'a_khac_b', label: `${stemA}(${aEl}) khắc ${stemB}(${bEl})`, isAuspicious: false };
    if (khac(bEl, aEl)) return { rel: 'b_khac_a', label: `${stemB}(${bEl}) khắc ${stemA}(${aEl})`, isAuspicious: false };
    if (aEl === bEl) return { rel: 'dong_hanh', label: `${stemA}(${aEl}) đồng hành với ${stemB}(${bEl})`, isAuspicious: true };
    return { rel: 'khong', label: 'Không quan hệ', isAuspicious: false };
  }

  function relType(rel) {
    if (!rel) return 'neutral';
    if (rel.rel === 'a_sinh_b' || rel.rel === 'b_sinh_a' || rel.rel === 'dong_hanh') return 'good';
    if (rel.rel === 'a_khac_b' || rel.rel === 'b_khac_a') return 'bad';
    return 'neutral';
  }

  // Cải tiến: xác định vượng/suy dựa vào trạng thái Trường Sinh
  function getGrowthStage(palace, stem) {
    if (!palace || !stem) return '';
    const dayHS = getStemOf(window.__LAST_CHART, 'day');
    const hourHS = getStemOf(window.__LAST_CHART, 'hour');
    if (stem === dayHS) return palace.growthCycle?.dayStem || '';
    if (stem === hourHS) return palace.growthCycle?.hourStem || '';
    if (palace.thienCanBan === stem) return palace.growthCycle?.heavenlyStem || '';
    if (palace.diaBan === stem) return palace.growthCycle?.earthlyStem || '';
    return '';
  }

  function isProsperous(palace, stem) {
    const stage = getGrowthStage(palace, stem);
    const strongStages = ['Trường Sinh', 'Lâm Quan', 'Đế Vượng'];
    return strongStages.includes(stage);
  }

  function isCachCucTot(palace) {
    if (!palace || !palace.patterns) return false;
    return palace.patterns.some(p => p.loai === 'cat');
  }

  function isCachCucXau(palace) {
    if (!palace || !palace.patterns) return false;
    return palace.patterns.some(p => p.loai === 'hung');
  }

  function isInner(palace) {
    return palace?.noiNgoai === 'nội';
  }
  function isOuter(palace) {
    return palace?.noiNgoai === 'ngoại';
  }

  function getStarNames(palace) {
    let star = palace?.thienBan || '';
    if (palace?.thienBanDongCung) star += ' / ' + palace.thienBanDongCung;
    return star;
  }

  // ============================ UI HELPERS ============================
  function h(s) { return s; }
  function line(label, value, type) {
    let cls = '';
    if (type === 'good') cls = 'style="color:var(--good);"';
    else if (type === 'bad') cls = 'style="color:var(--bad);"';
    else if (type === 'neutral') cls = 'style="color:var(--muted);"';
    else cls = '';
    return `<div style="margin-bottom:6px;"><strong>${label}:</strong> <span ${cls}>${value}</span></div>`;
  }
  function section(title) {
    return `<div style="margin:12px 0 8px 0;font-weight:700;border-left:3px solid #8a1f1f;padding-left:8px;">${title}</div>`;
  }
  function note(text) {
    return `<div style="margin:8px 0;padding:6px;background:#fef9e7;border-left:3px solid #e6b422;color:#5e3a0c;">${text}</div>`;
  }

  // Hàm tóm tắt kết quả tự động
  function summarizeResult(htmlContent) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const goodLines = div.querySelectorAll('[style*="--good"]').length;
    const badLines = div.querySelectorAll('[style*="--bad"]').length;
    let summary = '';
    if (goodLines > badLines) {
      summary = '✅ Tổng quan: Thuận lợi, khả quan.';
    } else if (badLines > goodLines) {
      summary = '⚠️ Tổng quan: Có trở ngại, cần thận trọng.';
    } else {
      summary = '⚖️ Tổng quan: Bình thường, cân nhắc thêm yếu tố khác.';
    }
    return `<div style="margin-top:12px;padding:8px;background:#f0f0f0;border-radius:4px;font-weight:bold;">${summary}</div>`;
  }

  // ============================ HƯỚNG DẪN CỘT TRÁI ============================
  function renderTopicGuide(topicId) {
    const t = TOPIC_GUIDES[topicId];
    if (!t) return '<div style="color:var(--muted);">Chọn chủ đề để xem hướng dẫn.</div>';

    let html = `<div style="font-weight:700;color:#7f1d1d;margin-bottom:6px;font-size:12px;">${t.title}</div>`;

    if (t.vars && t.vars.length) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">📌 Biến số:</div>`;
      html += `<table style="width:100%;border-collapse:collapse;margin-bottom:6px;">`;
      for (const [k, v] of t.vars) {
        html += `<tr><td style="padding:1px 4px 1px 0;vertical-align:top;width:40%;color:#1d4ed8;font-weight:700;font-size:12px;">${h(k)}</td><td style="padding:1px 0;vertical-align:top;font-size:12px;color:#374151;">${h(v)}</td></tr>`;
      }
      html += `</table>`;
    }

    if (t.signals && t.signals.length) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">⚡ Tín hiệu đặc biệt:</div>`;
      html += `<table style="width:100%;border-collapse:collapse;margin-bottom:6px;">`;
      for (const [k, v] of t.signals) {
        html += `<tr><td style="padding:1px 4px 1px 0;vertical-align:top;width:50%;color:#b45309;font-size:11px;">${h(k)}</td><td style="padding:1px 0;vertical-align:top;font-size:11px;color:#374151;">→ ${h(v)}</td></tr>`;
      }
      html += `</table>`;
    }

    if (t.how) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">📖 Cách xem nhanh:</div>`;
      html += `<div style="font-size:11px;color:#374151;line-height:1.6;border-left:3px solid #8a1f1f;padding-left:7px;background:#fdf8f8;padding-top:3px;padding-bottom:3px;">${h(t.how)}</div>`;
    }

    return html;
  }

  // ============================ ANALYZERS CẢI TIẾN ============================
  const TOPIC_ANALYZERS = {};

  // 1. Cơ thể
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

  // Các hàm phân tích khác (2-26) được giữ nguyên, chỉ thay đổi điểm nhỏ nếu cần thiết
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
      html += line('Can ngày ↔ Thái Tuế', rel.label, relType(rel));
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
      html += line('Can ngày ↔ Trực Phù', rel.label, relType(rel));
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
      html += line('Can ngày ↔ Đỗ Môn', rel.label, relType(rel));
    }
    if (pZF) {
      html += section('👔 Cấp trên – Trực Phù');
      const rel = getRelation(dayHS, getHeavenlyStem(pZF));
      html += line('Trực Phù', palaceSummary(pZF,chart), 'info');
      html += line('Can ngày ↔ Trực Phù', rel.label, relType(rel));
    }
    if (pThaiTue) {
      html += section('🏛️ Sếp siêu lớn – Thái Tuế');
      const rel = getRelation(dayHS, getHeavenlyStem(pThaiTue));
      html += line('Thái Tuế', palaceSummary(pThaiTue,chart), 'info');
      html += line('Can ngày ↔ Thái Tuế', rel.label, relType(rel));
    }
    if (pYear) {
      html += section('📌 Quản lý – Can năm');
      const rel = getRelation(dayHS, getHeavenlyStem(pYear));
      html += line('Can năm', palaceSummary(pYear,chart), 'info');
      html += line('Can ngày ↔ Can năm', rel.label, relType(rel));
    }
    return html;
  };

  TOPIC_ANALYZERS[4] = function(chart) {
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    let html = section('🧭 Tìm người dẫn đường');
    if (pLH) html += line('Lục Hợp', palaceSummary(pLH, chart), isVoid(chart, pLH) ? 'bad' : 'good');
    else html += line('Lục Hợp', 'Không có', 'neutral');
    if (pDo) html += line('Đỗ Môn', palaceSummary(pDo, chart), isVoid(chart, pDo) ? 'bad' : 'neutral');
    const dayHS = getStemOf(chart, 'day');
    const pHour = findPalaceByHeavenlyStem(chart, getStemOf(chart, 'hour'));
    if (pHour && pHour.cung === getPalace(chart, getStemOf(chart, 'day'))?.cung) {
      html += line('✅ Đồng cung', 'Dễ tìm thấy', 'good');
    } else {
      html += note('Can ngày và can giờ khác cung, có thể khó tìm.');
    }
    return html;
  };

  TOPIC_ANALYZERS[5] = function(chart) {
    const pKhai = findPalaceByGate(chart, 'Khai');
    let html = section('🔄 Chuyển việc');
    if (!pKhai) {
      html += note('Không tìm thấy Khai Môn.');
      return html;
    }
    html += line('Khai Môn', palaceSummary(pKhai, chart), isVoid(chart, pKhai) ? 'bad' : 'good');
    if (isVoid(chart, pKhai)) html += line('❌ Không vong', 'Không nên chuyển', 'bad');
    if (hasPattern(pKhai, 'Phục Ngâm')) html += line('⏳ Phục ngâm', 'Trì trệ, khó chuyển', 'bad');
    if (hasPattern(pKhai, 'Phản Ngâm')) html += line('⚡ Phản ngâm', 'Thay đổi đột ngột', 'neutral');
    if (!isVoid(chart, pKhai) && !hasPattern(pKhai, 'Phục Ngâm')) {
      html += line('✅ Có thể chuyển việc', 'Khai Môn tốt', 'good');
    }
    return html;
  };

  TOPIC_ANALYZERS[6] = function(chart) {
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    let html = section('📝 Xin việc');
    if (pCanh) {
      html += line('Cảnh Môn (hồ sơ)', palaceSummary(pCanh, chart), isVoid(chart, pCanh) ? 'bad' : 'good');
      if (isVoid(chart, pCanh)) html += line('❌ Không vong', 'Hồ sơ không được duyệt', 'bad');
    }
    if (pKhai) {
      html += line('Khai Môn (nơi nộp)', palaceSummary(pKhai, chart), isVoid(chart, pKhai) ? 'bad' : 'good');
      const rel = getRelation(getStemOf(chart, 'day'), getHeavenlyStem(pKhai));
      html += line('Can ngày ↔ Khai Môn', rel.label, relType(rel));
    }
    if (pLH) html += line('Lục Hợp (người giới thiệu)', palaceSummary(pLH, chart), isVoid(chart, pLH) ? 'bad' : 'good');
    return html;
  };

  TOPIC_ANALYZERS[7] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    let html = section('🛒 Mua hàng');
    html += line('Can ngày (người mua)', `${dayHS} (${getStemElement(dayHS)})`, 'info');
    html += line('Can giờ (sản phẩm)', `${hourHS} (${getStemElement(hourHS)})`, 'info');
    const rel = getRelation(hourHS, dayHS);
    html += line('Sản phẩm ↔ Người mua', rel.label, relType(rel));
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    if (pHour) {
      const pros = isProsperous(pHour, hourHS);
      const cachTot = isCachCucTot(pHour);
      if (pros && cachTot) html += line('✅ Can giờ vượng + cách cục tốt', 'Sản phẩm tốt, phù hợp thị trường', 'good');
      else if (!pros && cachTot) html += line('⚠️ Can giờ suy + cách cục tốt', 'Sản phẩm chưa tối ưu nhưng thị trường vẫn đón nhận', 'neutral');
      else if (pros && !cachTot) html += line('⚠️ Can giờ vượng nhưng cách cục xấu', 'Sản phẩm tốt nhưng thị trường không ủng hộ', 'neutral');
      else html += line('❌ Can giờ suy + cách cục xấu', 'Sản phẩm không tốt', 'bad');
    }
    const pCanh = findPalaceByGate(chart,'Cảnh');
    if (pCanh) {
      html += section('🏪 Thị trường – Cảnh Môn');
      html += line('Cảnh Môn', palaceSummary(pCanh,chart), isVoid(chart,pCanh) ? 'bad' : 'neutral');
    }
    return html;
  };

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
      html += line('Can ngày ↔ Trực Sử (khách)', rel.label, relType(rel));
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

    // Tính điểm lợi nhuận và kết luận
    let profitScore = 0;
    if (pSinh) {
      const relHourSinh = getRelation(hourHS, getHeavenlyStem(pSinh));
      if (relHourSinh.rel === 'a_sinh_b') profitScore += 2;
      const relSinhHour = getRelation(getHeavenlyStem(pSinh), hourHS);
      if (relSinhHour.rel === 'a_sinh_b') profitScore += 1;
      if (isVoid(chart, pSinh)) profitScore -= 1;
    }
    if (pMau) {
      const relHourMau = getRelation(hourHS, getHeavenlyStem(pMau));
      if (relHourMau.rel === 'a_khac_b') profitScore -= 2;
      if (isVoid(chart, pMau)) profitScore -= 1;
    }
    let profitMsg = '';
    if (profitScore >= 2) profitMsg = '✅ Lợi nhuận tốt, nên triển khai.';
    else if (profitScore >= 0) profitMsg = '📈 Lợi nhuận trung bình, cần cải thiện chiến lược.';
    else profitMsg = '❌ Khó có lợi nhuận, nên xem xét lại.';
    html += section('📊 Dự báo lợi nhuận');
    html += line('Điểm lợi nhuận', profitScore.toString(), profitScore >= 2 ? 'good' : (profitScore < 0 ? 'bad' : 'neutral'));
    html += note(profitMsg);
    return html;
  };

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

  TOPIC_ANALYZERS[10] = function(chart) {
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const dayHS = getStemOf(chart, 'day');
    const monthHS = getStemOf(chart, 'month');
    let html = section('🤝 Hợp tác');
    if (pLH) {
      html += line('Lục Hợp', palaceSummary(pLH, chart), isVoid(chart, pLH) ? 'bad' : 'good');
      const rel = getRelation(dayHS, getHeavenlyStem(pLH));
      html += line('Can ngày ↔ Lục Hợp', rel.label, relType(rel));
    } else {
      html += note('Không có Lục Hợp, khó có hợp tác thuận lợi.');
    }
    const relDayMonth = getRelation(dayHS, monthHS);
    html += line('Can ngày ↔ Can tháng', relDayMonth.label, relType(relDayMonth));
    return html;
  };

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
    const pCuuDia = findPalaceByDeityName(chart,'Cửu Địa');
    if (pCuuDia) html += line('🏗️ Cửu Địa', `Cung ${palaceName(pCuuDia.cung)} – Dự án lớn`, 'info');
    const pCuuThien = findPalaceByDeityName(chart,'Cửu Thiên');
    if (pCuuThien) html += line('🏙️ Cửu Thiên', `Cung ${palaceName(pCuuThien.cung)} – Chung cư`, 'info');
    return html;
  };

  TOPIC_ANALYZERS[12] = function(chart) {
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pThuong = findPalaceByGate(chart, 'Thương');
    let html = section('💸 Vay / cho vay');
    if (pSinh) {
      html += line('Sinh Môn (khoản vay)', palaceSummary(pSinh, chart), isVoid(chart, pSinh) ? 'bad' : 'good');
    }
    if (pThuong) {
      html += line('Thương Môn (người cho vay)', palaceSummary(pThuong, chart), isVoid(chart, pThuong) ? 'bad' : 'neutral');
    }
    const dayHS = getStemOf(chart, 'day');
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    if (pCanh) {
      html += line('Cảnh Môn (giấy tờ)', palaceSummary(pCanh, chart), isVoid(chart, pCanh) ? 'bad' : 'good');
    }
    return html;
  };

  TOPIC_ANALYZERS[13] = function(chart) {
    const pThuong = findPalaceByGate(chart,'Thương');
    const pSinh = findPalaceByGate(chart,'Sinh');
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

  TOPIC_ANALYZERS[14] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    let html = section('⚔️ Thi đấu');
    const rel = getRelation(dayHS, hourHS);
    html += line('Can ngày ↔ Can giờ', rel.label, relType(rel));
    const pHourHeaven = findPalaceByHeavenlyStem(chart, hourHS);
    const pHourEarth = findPalaceByEarthlyStem(chart, hourHS);
    if (pHourEarth) html += line('🏠 Chủ nhà', `${hourHS} tại địa bàn cung ${palaceName(pHourEarth.cung)}`, 'info');
    if (pHourHeaven) html += line('✈️ Đội khách', `${hourHS} tại thiên bàn cung ${palaceName(pHourHeaven.cung)}`, 'info');
    const pZF = getZhifuPalace(chart);
    if (pZF) {
      const relZF = getRelation(dayHS, getHeavenlyStem(pZF));
      html += line('Trọng tài (Trực Phù)', relZF.label, relType(relZF));
    }
    return html;
  };

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
      html += line('Can ngày ↔ Cảnh Môn', rel.label, relType(rel));
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

  TOPIC_ANALYZERS[16] = function(chart) {
    const pHuu = findPalaceByGate(chart, 'Hưu');
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    let html = section('🚗 Chỗ đỗ xe');
    if (pHuu) html += line('Hưu Môn', palaceSummary(pHuu, chart), 'info');
    if (pCanh) html += line('Cảnh Môn', palaceSummary(pCanh, chart), 'info');
    const pCuuDia = findPalaceByDeityName(chart, 'Cửu Địa');
    if (pCuuDia) html += line('Cửu Địa', `Cung ${palaceName(pCuuDia.cung)} – Chỗ kín đáo`, 'neutral');
    const pCuuThien = findPalaceByDeityName(chart, 'Cửu Thiên');
    if (pCuuThien) html += line('Cửu Thiên', `Cung ${palaceName(pCuuThien.cung)} – Chỗ thoáng`, 'neutral');
    const pKhon = getPalace(chart, 2);
    if (pKhon) html += line('Gợi ý', `Cung Khôn (Đông Nam) thường là chỗ tốt`, 'info');
    return html;
  };

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
    html += line('Can ngày ↔ Can giờ', rel.label, relType(rel));
    const pCanh = findPalaceByGate(chart,'Cảnh');
    const pHuu = findPalaceByGate(chart,'Hưu');
    const pCuuThien = findPalaceByDeityName(chart,'Cửu Thiên');
    const pKhai = findPalaceByGate(chart,'Khai');
    const pThuong = findPalaceByGate(chart,'Thương');
    if (pCanh) html += line('🚗 Phương tiện', 'Đường bộ (Cảnh Môn)', 'info');
    else if (pHuu) html += line('🚤 Phương tiện', 'Đường thủy (Hưu Môn)', 'info');
    else if (pCuuThien || pKhai) html += line('✈️ Phương tiện', 'Hàng không (Cửu Thiên/Khai Môn)', 'info');
    else if (pThuong) html += line('🚌 Phương tiện', 'Phương tiện công cộng (Thương Môn)', 'info');
    const pBon = findPalaceByStarName(chart,'Thiên Bồng');
    if (pBon) html += line('⚠️ Thiên Bồng', `Cung ${palaceName(pBon.cung)} – Có trở ngại`, 'bad');
    return html;
  };

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
      html += line('Ất ↔ Canh', rel.label, relType(rel));
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
      const hanhNhue = _U.NGU_HANH_SAO[nhueStar] || '';
      const hanhBaby = _U.NGU_HANH_SAO[starKhon] || '';
      if (hanhNhue && hanhBaby) {
        if (khac(hanhNhue, hanhBaby)) html += line('✅ Thiên Nhuế khắc sao em bé', 'Tốt, an toàn', 'good');
        if (sheng(hanhBaby, hanhNhue)) html += line('⏳ Sao em bé sinh Thiên Nhuế', 'Sinh lâu', 'neutral');
        if (khac(hanhBaby, hanhNhue)) html += line('⚠️ Sao em bé khắc Thiên Nhuế', 'Nguy hiểm', 'bad');
      }
      const cungNhue = pNhue.cung;
      const cungKhon = pKhon.cung;
      const hanhCungNhue = _U.CUNG_META[cungNhue]?.hanh || '';
      const hanhCungKhon = _U.CUNG_META[cungKhon]?.hanh || '';
      if (khac(hanhCungNhue, hanhCungKhon)) html += line('✅ Cung Thiên Nhuế khắc cung Khôn', 'Tốt', 'good');
      const gateKhon = pKhon.batMon || '';
      const hanhGate = _U.NGU_HANH_MON[gateKhon] || '';
      if (khac(hanhCungKhon, hanhGate)) html += line('⚠️ Cung Khôn khắc bát môn', 'Nguy hiểm, có thể phẫu thuật', 'bad');
    }
    return html;
  };

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
    if (pAt) html += line('🌿 Thuốc đông y', `Ất ở cung ${palaceName(pAt.cung)}`, 'info');
    if (pThienTam) html += line('💊 Tây y', `Thiên Tâm ở cung ${palaceName(pThienTam.cung)}`, 'info');
    if (pDinh && pKhai) html += line('🔪 Đã phẫu thuật', `Đinh + Khai Môn`, 'neutral');
    if (pMau) html += line('🪨 U bướu / sẹo', `Mậu ở cung ${palaceName(pMau.cung)}`, 'neutral');
    if (pKy) html += line('🪨 U bướu / sẹo', `Kỷ ở cung ${palaceName(pKy.cung)}`, 'neutral');
    if (pBinh) html += line('🔥 Viêm', `Bính ở cung ${palaceName(pBinh.cung)}`, 'bad');
    if (pNham || pQuy) html += line('🩸 Máu huyết', 'Nhâm/Quý hiện diện', 'bad');
    html += section('🔬 Nguyên do');
    html += line('Can giờ', `${hourHS} → ${(bodyMap[hourHS] || []).join(', ') || '—'}`, 'info');

    // Tính điểm rủi ro
    let risk = 0;
    if (pNhue) {
      if (isVoid(chart, pNhue)) risk -= 1;
      const relNhueDay = getRelation(getHeavenlyStem(pNhue), dayHS);
      if (relNhueDay.rel === 'a_khac_b') risk += 2;
    }
    if (dayP) {
      if (isVoid(chart, dayP)) risk += 1;
      if (dayP.batMon === 'Sinh') risk -= 1;
      if (dayP.batMon === 'Tử') risk += 2;
    }
    let riskMsg = '';
    if (risk <= 0) riskMsg = '✅ Tiên lượng tốt, khả năng phục hồi cao.';
    else if (risk === 1) riskMsg = '⚠️ Có dấu hiệu bất thường, cần theo dõi.';
    else riskMsg = '❌ Nguy cơ cao, nên điều trị tích cực.';
    html += section('🏥 Đánh giá chung');
    html += line('Mức độ rủi ro', risk.toString(), risk > 1 ? 'bad' : (risk === 1 ? 'neutral' : 'good'));
    html += note(riskMsg);
    return html;
  };

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

  TOPIC_ANALYZERS[24] = function(chart) {
    const dayHS = getStemOf(chart,'day');
    const hourHS = getStemOf(chart,'hour');
    const pLH = findPalaceByDeityName(chart,'Lục Hợp');
    const pDo = findPalaceByGate(chart,'Đỗ');
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
    if (pUse) {
      const gateUse = pUse.batMon || '';
      const pros = isProsperous(pUse, dayHS);
      if (pros && ['Khai','Hưu','Sinh','Đỗ'].includes(gateUse))
        html += line('⚠️ Dụng thần vượng với Khai/Hưu/Sinh/Đỗ', 'Khó tìm', 'bad');
    }
    const deity = getEffectiveDeityName(pUse, chart);
    if (deity.includes('Cửu Địa') || deity.includes('Thái Âm')) html += line('🕵️ Cửu Địa/Thái Âm', 'Có người cất giấu', 'bad');
    if (deity.includes('Huyền Vũ')) html += line('🦹 Huyền Vũ', 'Bị lừa', 'bad');
    if (deity.includes('Đằng Xà')) html += line('⛓️ Đằng Xà', 'Bị bắt giữ', 'bad');
    if (deity.includes('Bạch Hổ')) html += line('💢 Bạch Hổ', 'Đề phòng bị đánh', 'bad');
    return html;
  };

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
      html += line('Can giờ ↔ Can ngày', rel.label, relType(rel));
    }
    if (pHour && isVoid(chart,pHour)) html += line('❌ Can giờ không vong', 'Khó tìm lại', 'bad');
    if (pDay && pHour) {
      if (isInner(pDay) && isInner(pHour)) html += line('🏠 Cả hai nội bàn', 'Mất trong nhà', 'info');
      else if (isOuter(pDay) && isOuter(pHour)) html += line('🏙️ Cả hai ngoại bàn', 'Mất ngoài nhà', 'info');
      else if (isInner(pDay) && isOuter(pHour)) html += line('🏠→🏙️ Can ngày nội, can giờ ngoại', 'Mất bên ngoài', 'info');
      else if (isOuter(pDay) && isInner(pHour)) html += line('🏙️→🏠 Can ngày ngoại, can giờ nội', 'Mất bên trong', 'info');
    }
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
      const rainStar = s.includes('Thiên Bồng') || s.includes('Thiên Trụ');
      const rainStem = hs === 'Nhâm' || hs === 'Quý';
      const rainPalace = [1,3,9].includes(p.cung);
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
  function analyzeByTopic(topicId, chart) {
    const fn = TOPIC_ANALYZERS[Number(topicId)];
    if (!fn) return '<div style="color:var(--muted);">Chưa có logic cho chủ đề này.</div>';
    try {
      let result = fn(chart);
      result += summarizeResult(result);
      return result;
    } catch (e) {
      console.error(e);
      return '<div style="color:red;">Lỗi khi luận quẻ.</div>';
    }
  }

  function runAnalysis(chartArg) {
    const select = document.getElementById('topicSelect');
    const topicId = select ? select.value : '';
    if (!topicId) {
      const resultDiv = document.getElementById('analysisResult');
      if (resultDiv) resultDiv.innerHTML = '<div style="color:var(--muted);text-align:center;">Chọn chủ đề để luận quẻ</div>';
      return;
    }
    const chart = chartArg || getCurrentChart();
    if (!chart) {
      const resultDiv = document.getElementById('analysisResult');
      if (resultDiv) resultDiv.innerHTML = '<div style="color:red;">Chưa có dữ liệu bàn. Hãy lập bàn trước.</div>';
      return;
    }
    const result = analyzeByTopic(topicId, chart);
    const resultDiv = document.getElementById('analysisResult');
    if (resultDiv) resultDiv.innerHTML = result;
  }

  // ============================ ĐĂNG KÝ SỰ KIỆN ============================
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
    if (reAnalyzeBtn) {
      reAnalyzeBtn.addEventListener('click', function() {
        runAnalysis();
      });
    }
    const clearNoteBtn = document.getElementById('btnClearNote');
    const noteArea = document.getElementById('analysisNote');
    if (clearNoteBtn && noteArea) {
      clearNoteBtn.addEventListener('click', function() {
        noteArea.value = '';
      });
    }
  }

  function bindChartEvents() {
    if (window.ChartEvents) {
      window.ChartEvents.on('chartCalculated', function(chart) {
        runAnalysis(chart);
      });
    }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogicLuanQue);
  } else {
    initLogicLuanQue();
  }
})();
