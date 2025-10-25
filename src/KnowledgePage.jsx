// Knowledge Page - VISTA Eye Care Education
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

const knowledgeData = {
  "lessons": [
    {
      "lessonId": "EYE001",
      "category": "Cấu tạo mắt",
      "title": "Bài 1: Mắt hoạt động như thế nào?",
      "summary": "Tìm hiểu tổng quan về cách mắt thu nhận hình ảnh và gửi tín hiệu lên não, giống như một chiếc máy ảnh.",
      "content": "Mắt của bạn hoạt động tương tự một chiếc máy ảnh tinh vi.\n1. Ánh sáng đi qua Giác mạc (lớp trong suốt phía trước).\n2. Mống mắt (phần có màu) điều chỉnh Con ngươi (lỗ đen) để kiểm soát lượng ánh sáng đi vào.\n3. Ánh sáng đi qua Thủy tinh thể, nơi hội tụ hình ảnh.\n4. Hình ảnh được hội tụ sắc nét lên Võng mạc (lớp cảm nhận ở đáy mắt).\n5. Võng mạc chuyển tín hiệu ánh sáng thành tín hiệu thần kinh, gửi lên não qua Dây thần kinh thị giác.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE002",
      "category": "Cấu tạo mắt",
      "title": "Bài 2: Giác mạc - Tấm khiên trong suốt",
      "summary": "Giác mạc là gì và tại sao nó quan trọng đến vậy trong việc hội tụ ánh sáng?",
      "content": "Giác mạc là lớp màng trong suốt, hình vòm, nằm ở phía trước nhất của mắt. Nó giống như 'mặt kính đồng hồ'.\nChức năng chính của giác mạc là bảo vệ mắt khỏi bụi bẩn và vi khuẩn.\nQuan trọng hơn, nó chiếm tới 2/3 tổng công suất hội tụ ánh sáng của mắt. Bất kỳ sự thay đổi nào về độ cong hoặc độ trong suốt của giác mạc đều ảnh hưởng lớn đến thị lực (như trong bệnh Loạn thị hoặc sẹo giác mạc).",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE003",
      "category": "Cấu tạo mắt",
      "title": "Bài 3: Thủy tinh thể - Ống kính lấy nét",
      "summary": "Hiểu về ống kính tự nhiên bên trong mắt bạn và cách nó thay đổi để giúp bạn nhìn gần và xa.",
      "content": "Thủy tinh thể là một cấu trúc trong suốt, nằm ngay sau mống mắt (phần có màu). \nNếu giác mạc là ống kính cố định, thì thủy tinh thể là ống kính 'zoom' linh hoạt. Nó có thể thay đổi độ phồng (dày lên hoặc mỏng đi) để tinh chỉnh độ hội tụ, giúp bạn nhìn rõ các vật thể ở những khoảng cách khác nhau (nhìn gần khi đọc sách, nhìn xa khi lái xe). \nKhi lớn tuổi, thủy tinh thể bị lão hóa và cứng lại, gây ra Lão thị. Khi nó bị mờ đục, đó là bệnh Đục thủy tinh thể.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE004",
      "category": "Cấu tạo mắt",
      "title": "Bài 4: Võng mạc & Hoàng điểm",
      "summary": "Võng mạc là gì? Hoàng điểm (điểm vàng) có vai trò gì trong việc nhìn chi tiết?",
      "content": "Võng mạc là lớp mô thần kinh nhạy cảm với ánh sáng, nằm ở đáy mắt. Nó hoạt động như 'cuộn phim' trong máy ảnh, thu nhận hình ảnh đã được hội tụ.\nHoàng điểm (hay điểm vàng) là một vùng rất nhỏ nằm ở trung tâm võng mạc. Đây là nơi tập trung nhiều tế bào cảm nhận ánh sáng nhất, chịu trách nhiệm cho thị lực trung tâm sắc nét, khả năng đọc chữ, nhận diện khuôn mặt và nhìn màu sắc. Các bệnh như Thoái hóa hoàng điểm (AMD) ảnh hưởng trực tiếp đến khu vực này.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE005",
      "category": "Tật khúc xạ",
      "title": "Bài 5: Cận thị (Myopia)",
      "summary": "Tại sao bạn bị cận thị? Tìm hiểu lý do tại sao người cận thị nhìn xa mờ nhưng nhìn gần rõ.",
      "content": "Cận thị là một tật khúc xạ rất phổ biến. Nó xảy ra khi trục nhãn cầu quá dài, hoặc công suất hội tụ của giác mạc và thủy tinh thể quá mạnh.\nĐiều này khiến cho hình ảnh của vật ở xa bị hội tụ *phía trước* võng mạc, thay vì ngay trên võng mạc. Kết quả là hình ảnh vật ở xa bị mờ, nhưng vật ở gần vẫn nhìn rõ. \nCận thị được điều trị bằng cách đeo kính phân kỳ (kính cận), kính áp tròng, hoặc phẫu thuật (như LASIK) để điều chỉnh lại điểm hội tụ.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE006",
      "category": "Tật khúc xạ",
      "title": "Bài 6: Viễn thị (Hyperopia)",
      "summary": "Viễn thị là gì? Tại sao người viễn thị thường phải nheo mắt khi nhìn gần?",
      "content": "Viễn thị ngược lại với cận thị. Nó xảy ra khi trục nhãn cầu quá ngắn, hoặc công suất hội tụ của mắt quá yếu.\nĐiều này khiến hình ảnh bị hội tụ *phía sau* võng mạc. Mắt phải liên tục 'điều tiết' (co thủy tinh thể) để kéo hình ảnh về đúng võng mạc. \nKhi nhìn gần, mắt phải điều tiết nhiều hơn, gây mỏi mắt, nhức đầu. Ở người trẻ, viễn thị nhẹ có thể tự điều tiết được, nhưng khi lớn tuổi hoặc viễn thị nặng, cả nhìn gần và nhìn xa đều mờ. Điều trị bằng kính hội tụ (kính viễn).",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE007",
      "category": "Tật khúc xạ",
      "title": "Bài 7: Loạn thị (Astigmatism)",
      "summary": "Tại sao hình ảnh bị méo hoặc có 'bóng mờ'? Đó chính là loạn thị.",
      "content": "Loạn thị xảy ra khi giác mạc (hoặc thủy tinh thể) không có hình cầu đều đặn, mà lại có hình bầu dục (như quả bóng bầu dục thay vì quả bóng tròn).\nVì độ cong không đều, ánh sáng đi vào mắt sẽ bị hội tụ ở nhiều điểm khác nhau (một số ở trước, một số ở sau võng mạc). Điều này gây ra hình ảnh bị mờ, méo mó, hoặc nhìn thấy 'bóng' (nhìn một vạch đèn thành hai, ba vạch). \nLoạn thị thường đi kèm với cận thị hoặc viễn thị, và được điều chỉnh bằng kính có trụ (kính loạn).",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE008",
      "category": "Tật khúc xạ",
      "title": "Bài 8: Lão thị (Presbyopia)",
      "summary": "Tại sao người trên 40 tuổi thường cần kính để đọc sách?",
      "content": "Lão thị là một phần tự nhiên của quá trình lão hóa, thường bắt đầu sau 40 tuổi. Đây không phải là bệnh, mà là sự suy giảm khả năng điều tiết của mắt.\nNguyên nhân là do Thủy tinh thể (ống kính tự nhiên) bị cứng lại và các cơ xung quanh nó yếu đi. Mắt không còn khả năng 'zoom' linh hoạt để nhìn gần.\nBiểu hiện là bạn phải đưa sách báo, điện thoại ra xa mới đọc rõ. Điều trị đơn giản bằng cách đeo kính lão (kính hội tụ chỉ để nhìn gần) hoặc phẫu thuật.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE009",
      "category": "Bệnh lý thường gặp",
      "title": "Bài 9: Bệnh khô mắt",
      "summary": "Khô mắt không chỉ là cảm giác. Tìm hiểu nguyên nhân và tại sao nó cần được điều trị.",
      "content": "Bệnh khô mắt xảy ra khi mắt không sản xuất đủ nước mắt, hoặc nước mắt bay hơi quá nhanh (chất lượng nước mắt kém). \nNước mắt rất quan trọng để bôi trơn bề mặt mắt, rửa trôi bụi bẩn và chống nhiễm trùng.\nTriệu chứng: Cảm giác cộm, rát, ngứa, đỏ mắt, mờ mắt từng lúc (chớp mắt thì rõ hơn), hoặc trớ trêu là... chảy nước mắt sống (do mắt bị kích thích nên phản xạ tiết nước mắt).\nNguyên nhân: Lão hóa, dùng máy tính nhiều (quên chớp mắt), môi trường khô, hoặc các bệnh lý khác.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE010",
      "category": "Bệnh lý thường gặp",
      "title": "Bài 10: Đục thủy tinh thể (Cườm khô)",
      "summary": "Nguyên nhân và triệu chứng của bệnh lý phổ biến nhất gây mù lòa có thể chữa được.",
      "content": "Đục thủy tinh thể (hay cườm khô) là tình trạng thủy tinh thể (ống kính tự nhiên) bị mờ đục theo thời gian, ngăn cản ánh sáng đi vào võng mạc.\nNguyên nhân chính là lão hóa. Các yếu tố khác: tiểu đường, chấn thương mắt, tiếp xúc nhiều với tia UV, hút thuốc lá.\nTriệu chứng:\n- Nhìn mờ dần, như qua màn sương.\n- Lóa mắt khi gặp ánh sáng mạnh (đèn xe ban đêm).\n- Màu sắc nhìn bị nhạt đi hoặc ngả vàng.\n- Phải thay đổi số kính liên tục.\nCách điều trị hiệu quả duy nhất là phẫu thuật.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE011",
      "category": "Bệnh lý thường gặp",
      "title": "Bài 11: Bệnh Glôcôm (Cườm nước)",
      "summary": "Hiểu về 'kẻ trộm thị lực thầm lặng' gây tổn thương dây thần kinh thị giác.",
      "content": "Glôcôm (Cườm nước) là một nhóm bệnh gây tổn thương Dây thần kinh thị giác – dây nối mắt với não. Nếu không điều trị, nó có thể gây mất thị lực vĩnh viễn.\nNguyên nhân thường gặp nhất là do áp lực bên trong mắt (nhãn áp) tăng cao, chèn ép làm chết dần các sợi thần kinh.\nĐiều nguy hiểm là Glôcôm góc mở (thể phổ biến nhất) thường không có triệu chứng gì cho đến khi bệnh đã nặng. Bệnh nhân mất dần tầm nhìn ở vùng rìa (chu biên), chỉ còn nhìn rõ ở trung tâm (gọi là 'nhìn hình ống').\nVì vậy, việc khám mắt định kỳ để đo nhãn áp là cực kỳ quan trọng.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE012",
      "category": "Bệnh lý thường gặp",
      "title": "Bài 12: Võng mạc tiểu đường",
      "summary": "Biến chứng mắt nghiêm trọng nhất của bệnh tiểu đường bạn cần biết.",
      "content": "Đây là biến chứng ở mắt do bệnh tiểu đường (cả tuýp 1 và tuýp 2). Lượng đường trong máu cao kéo dài gây tổn thương các mạch máu nhỏ ở võng mạc.\nCác mạch máu này có thể bị rò rỉ dịch (gây phù hoàng điểm) hoặc bị tắc nghẽn, dẫn đến việc mắt tạo ra các mạch máu mới bất thường (tân mạch).\nCác tân mạch này rất yếu, dễ vỡ, gây xuất huyết bên trong mắt hoặc gây bong võng mạc, dẫn đến mù lòa. \nNgười bệnh tiểu đường phải kiểm soát đường huyết thật tốt và đi khám đáy mắt định kỳ (ít nhất 1 năm/lần) ngay cả khi chưa thấy mờ.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE013",
      "category": "Bệnh lý thường gặp",
      "title": "Bài 13: Thoái hóa hoàng điểm (AMD)",
      "summary": "Bệnh lý ảnh hưởng đến thị lực trung tâm, gây khó khăn khi đọc sách và nhận diện khuôn mặt.",
      "content": "Thoái hóa hoàng điểm do tuổi tác (AMD) là bệnh lý gây tổn thương vùng Hoàng điểm (điểm vàng) ở trung tâm võng mạc.\nNó gây mất thị lực trung tâm, nhưng thị lực chu biên (vùng rìa) thường vẫn còn. Bệnh nhân sẽ thấy khó đọc sách, nhìn khuôn mặt bị mờ, hoặc thấy đường thẳng bị cong vẹo, biến dạng.\nCó 2 thể: \n1. AMD thể khô (phổ biến hơn, tiến triển chậm).\n2. AMD thể ướt (ít gặp nhưng nặng, tiến triển nhanh do rò rỉ mạch máu).\nCần phát hiện sớm để làm chậm tiến triển của bệnh.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE014",
      "category": "Phẫu thuật",
      "title": "Bài 14: Phẫu thuật Phaco (Trị cườm khô)",
      "summary": "Tìm hiểu về Phaco, phương pháp phẫu thuật thay thủy tinh thể phổ biến nhất hiện nay.",
      "content": "Phaco (Phacoemulsification) là kỹ thuật mổ đục thủy tinh thể tiên tiến nhất.\nBác sĩ sẽ tạo một đường mổ rất nhỏ (chỉ 2-3mm) ở rìa giác mạc. \nMột đầu dò siêu âm nhỏ được đưa vào để tán nhuyễn (nhũ tương hóa) thủy tinh thể bị đục thành các mảnh nhỏ, sau đó hút ra ngoài.\nTiếp theo, một thủy tinh thể nhân tạo (IOL) mềm, có thể gập lại, được đưa vào qua chính đường mổ nhỏ đó và mở ra bên trong mắt, thay thế cho thủy tinh thể cũ.\nƯu điểm: Vết mổ nhỏ, không cần khâu, phục hồi nhanh, ít biến chứng.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE015",
      "category": "Phẫu thuật",
      "title": "Bài 15: Phẫu thuật LASIK (Trị tật khúc xạ)",
      "summary": "LASIK hoạt động như thế nào để giúp bạn hết cận, viễn, loạn thị?",
      "content": "LASIK là phẫu thuật dùng laser để điều chỉnh lại độ cong của Giác mạc, qua đó điều trị cận, viễn, loạn thị.\nQuy trình gồm 2 bước chính:\n1. Tạo vạt giác mạc: Bác sĩ dùng dao vi phẫu (Microkeratome) hoặc Laser (Femtosecond Laser) để tạo một vạt mỏng trên bề mặt giác mạc và lật lên.\n2. Bắn laser: Laser Excimer (một loại laser lạnh) sẽ chiếu và 'bào mòn' một phần mô giác mạc bên dưới vạt, theo một lập trình chính xác trên máy tính, để tạo lại độ cong chuẩn.\n3. Đậy vạt: Vạt giác mạc được đậy lại vị trí cũ, nó sẽ tự liền lại mà không cần khâu.\nBệnh nhân có thể nhìn rõ ngay ngày hôm sau.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE016",
      "category": "Phẫu thuật",
      "title": "Bài 16: Các loại thủy tinh thể nhân tạo (IOL)",
      "summary": "Khi mổ cườm khô, bạn có thể lựa chọn các loại 'ống kính' nào?",
      "content": "Khi phẫu thuật Phaco, bạn sẽ được đặt một thủy tinh thể nhân tạo (IOL) để thay thế. Có nhiều loại IOL:\n1. Đơn tiêu (Monofocal): Đây là loại cơ bản nhất. Nó chỉ cho phép nhìn rõ ở MỘT cự ly (thường là nhìn xa). Sau mổ, bạn sẽ nhìn xa rất rõ nhưng vẫn cần đeo kính khi đọc sách (kính lão).\n2. Đa tiêu (Multifocal/Trifocal): Loại cao cấp này có nhiều vòng hội tụ, giúp mắt có thể nhìn rõ ở cả 3 cự ly: Xa (lái xe), Trung gian (máy tính) và Gần (đọc sách). Nó giúp giảm sự phụ thuộc vào kính sau mổ.\n3. Đơn tiêu Toric: Dành cho người vừa bị cườm khô, vừa bị loạn thị. Nó vừa điều chỉnh cườm, vừa khử độ loạn.",
      "difficulty": "Trung bình"
    },
    {
      "lessonId": "EYE017",
      "category": "Chăm sóc & Phẫu thuật",
      "title": "Bài 17: Chuẩn bị TRƯỚC khi mổ mắt",
      "summary": "Những việc quan trọng cần làm và cần tránh trước ngày phẫu thuật.",
      "content": "Việc chuẩn bị tốt sẽ giúp ca phẫu thuật diễn ra thuận lợi.\n1. Nhịn ăn uống: Bạn thường được yêu cầu nhịn ăn và uống (kể cả nước) trong 6-8 giờ trước mổ. Điều này để phòng nguy cơ hít sặc nếu dùng thuốc an thần.\n2. Vệ sinh: Tắm gội sạch sẽ vào tối hôm trước hoặc sáng hôm mổ. Không trang điểm (đặc biệt là vùng mắt), không dùng nước hoa.\n3. Thuốc: Thông báo cho bác sĩ tất cả các loại thuốc bạn đang dùng. Một số thuốc (như thuốc chống đông máu) có thể cần tạm ngưng.\n4. Người nhà: Sắp xếp người nhà đưa đón và chăm sóc trong ngày đầu tiên, vì bạn không thể tự lái xe sau phẫu thuật.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE018",
      "category": "Chăm sóc & Phẫu thuật",
      "title": "Bài 18: Chăm sóc SAU khi mổ mắt",
      "summary": "Những điều nên và không nên làm để mắt phục hồi tốt nhất sau phẫu thuật.",
      "content": "Tuần đầu tiên sau mổ là quan trọng nhất.\nNÊN:\n- Nhỏ thuốc kháng sinh, kháng viêm đúng theo toa của bác sĩ.\n- Đeo kính bảo vệ hoặc tấm che mắt (kể cả khi ngủ) để tránh vô tình dụi mắt.\n- Nghỉ ngơi, tránh làm việc nặng, tránh cúi gập người.\n- Giữ vệ sinh mắt sạch sẽ.\nKHÔNG NÊN:\n- Để nước bẩn, xà phòng dính vào mắt (khi gội đầu nên ngửa cổ ra sau).\n- Dụi mắt, nheo mắt mạnh.\n- Đi bơi, xông hơi, hoặc đến nơi khói bụi trong ít nhất 1 tháng.\n- Trang điểm vùng mắt.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE019",
      "category": "Chăm sóc & Phẫu thuật",
      "title": "Bài 19: Hướng dẫn nhỏ thuốc mắt đúng cách",
      "summary": "Làm thế nào để nhỏ thuốc mắt hiệu quả và tránh nhiễm trùng?",
      "content": "Nhỏ thuốc đúng cách giúp thuốc hấp thu tốt và an toàn.\n1. Rửa tay thật sạch bằng xà phòng trước khi nhỏ.\n2. Lắc lọ thuốc nếu được yêu cầu.\n3. Ngửa đầu ra sau, mắt nhìn lên trần nhà.\n4. Dùng một ngón tay kéo nhẹ mi dưới xuống để tạo thành một 'túi'.\n5. Bóp nhẹ lọ thuốc để nhỏ 1 giọt vào 'túi' đó. Tránh để đầu lọ thuốc chạm vào mắt hoặc lông mi.\n6. Nhắm mắt lại nhẹ nhàng (không nheo mạnh), giữ yên 1-2 phút. Dùng ngón tay ấn nhẹ vào góc trong của mắt (gần mũi) để giữ thuốc lại và tránh chảy xuống họng.\n7. Nếu phải nhỏ 2 loại thuốc, hãy chờ ít nhất 5 phút giữa hai loại.",
      "difficulty": "Dễ"
    },
    {
      "lessonId": "EYE020",
      "category": "Chăm sóc & Phẫu thuật",
      "title": "Bài 20: Dinh dưỡng tốt cho mắt",
      "summary": "Ăn gì để bảo vệ sức khỏe mắt và hỗ trợ phục hồi sau mổ?",
      "content": "Một chế độ ăn uống cân bằng rất tốt cho mắt.\n- Vitamin A: Quan trọng cho võng mạc. Có nhiều trong cà rốt, khoai lang, bí đỏ, gan động vật.\n- Lutein & Zeaxanthin: Là chất chống oxy hóa mạnh, tập trung nhiều ở hoàng điểm, giúp lọc ánh sáng xanh. Có nhiều trong rau lá xanh đậm (cải bó xôi, cải xoăn, súp lơ xanh) và lòng đỏ trứng.\n- Vitamin C & E: Chống oxy hóa, bảo vệ tế bào mắt. Có nhiều trong cam, quýt, ổi, ớt chuông (Vitamin C) và các loại hạt, dầu thực vật (Vitamin E).\n- Omega-3: Giúp giảm khô mắt và hỗ trợ võng mạc. Có nhiều trong cá béo (cá hồi, cá trích, cá ngừ).",
      "difficulty": "Dễ"
    }
  ]
}

const difficultyColors = {
  'Dễ': 'bg-green-500/20 border-green-500/30 text-green-400',
  'Trung bình': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  'Khó': 'bg-red-500/20 border-red-500/30 text-red-400'
}

const categoryIcons = {
  'Cấu tạo mắt': '👁️',
  'Tật khúc xạ': '👓',
  'Bệnh lý thường gặp': '🏥',
  'Phẫu thuật': '⚕️',
  'Chăm sóc & Phẫu thuật': '💊'
}

const KnowledgePage = () => {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')

  const categories = ['Tất cả', ...new Set(knowledgeData.lessons.map(l => l.category))]

  const filteredLessons = selectedCategory === 'Tất cả' 
    ? knowledgeData.lessons 
    : knowledgeData.lessons.filter(l => l.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={LOGO_URL}
              alt="VISTA Logo"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-400/30 group-hover:ring-sky-400/60 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">VISTA</span>
              <span className="text-xs text-slate-400">Kiến thức nhãn khoa</span>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="px-6 py-2 rounded-xl border-2 border-sky-400 text-sky-400 font-semibold hover:bg-sky-400/10 transition-all"
          >
            Về trang chủ
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>📚</span>
              20 Bài học chuyên sâu
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent letter-spacing-wide">
                Kiến Thức Nhãn Khoa
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed letter-spacing-wide">
              Khám phá 20 bài học toàn diện về mắt - từ cấu tạo, bệnh lý đến phẫu thuật và chăm sóc
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50'
                    : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:border-sky-500/30 hover:text-sky-400'
                }`}
              >
                {cat !== 'Tất cả' && categoryIcons[cat]} {cat}
              </button>
            ))}
          </motion.div>

          {/* Lessons Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {filteredLessons.map((lesson, i) => (
              <motion.div
                key={lesson.lessonId}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10 hover:border-sky-500/30 cursor-pointer transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.3)' }}
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{categoryIcons[lesson.category]}</div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${difficultyColors[lesson.difficulty]}`}>
                    {lesson.difficulty}
                  </div>
                </div>

                <div className="mb-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium inline-block">
                  {lesson.category}
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                  {lesson.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {lesson.summary}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sky-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  Xem chi tiết
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10 p-8"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLesson(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-5xl mb-4">{categoryIcons[selectedLesson.category]}</div>

              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium">
                  {selectedLesson.category}
                </div>
                <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${difficultyColors[selectedLesson.difficulty]}`}>
                  {selectedLesson.difficulty}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                {selectedLesson.title}
              </h2>

              <p className="text-lg text-sky-300 mb-6 italic">
                {selectedLesson.summary}
              </p>

              <div className="prose prose-invert max-w-none">
                {selectedLesson.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-slate-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="text-sm text-slate-400">
                  Mã bài học: <span className="text-sky-400 font-mono">{selectedLesson.lessonId}</span>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default KnowledgePage
