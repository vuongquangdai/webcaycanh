# Website bán cây cảnh

**Webcaycanh** là dự án website bán cây cảnh chuyên biệt, được xây dựng nhằm tận dụng tiềm năng của thương mại điện tử trong lĩnh vực cây cảnh – một ngành có giá trị thẩm mỹ cao và góp phần cải thiện không gian sống. Dự án hướng đến việc tạo ra một nền tảng trực tuyến thân thiện, dễ sử dụng và tích hợp nhiều dịch vụ quan trọng, từ xác thực người dùng, quản lý sản phẩm, giỏ hàng, đến xử lý giao dịch thanh toán trực tuyến một cách an toàn và hiệu quả.

## Mục tiêu và Giải pháp
Trong bối cảnh mua sắm trực tuyến ngày càng phát triển, Webcaycanh nhằm giải quyết những hạn chế hiện có của các nền tảng thương mại điện tử bằng cách:
- **Tạo trải nghiệm người dùng tối ưu:** Giao diện trực quan, mượt mà cho phép khách hàng dễ dàng duyệt và tìm kiếm sản phẩm, xem thông tin chi tiết về từng loại cây cảnh, cũng như quản lý giỏ hàng và đơn hàng.
- **Tích hợp dịch vụ an toàn:** Sử dụng Google OAuth để xác thực người dùng, loại bỏ nhu cầu quản lý mật khẩu nội bộ, đồng thời tích hợp thanh toán qua VNPay giúp xử lý giao dịch nhanh chóng và bảo mật.
- **Quản trị hiệu quả:** Cung cấp giao diện quản trị cho Admin để quản lý sản phẩm (thêm, sửa, xóa) và theo dõi đơn hàng, từ đó đảm bảo cập nhật dữ liệu chính xác và kịp thời.

## Công nghệ và Kiến trúc
Webcaycanh được xây dựng dựa trên kiến trúc hiện đại với sự kết hợp của các công nghệ:
- **Frontend:** Sử dụng React và React Router để tạo ra giao diện người dùng linh hoạt, tương tác mượt mà trên cả máy tính để bàn và thiết bị di động.
- **Backend:** Xây dựng API RESTful bằng NodeJS và Express, đảm bảo hiệu năng cao và khả năng mở rộng khi tích hợp các dịch vụ bên ngoài như Google OAuth và VNPay.
- **Cơ sở dữ liệu:** Sử dụng MySQL với cấu trúc dữ liệu quan hệ chặt chẽ, lưu trữ thông tin sản phẩm, người dùng, giỏ hàng và đơn hàng, đảm bảo tính toàn vẹn và tối ưu hóa truy vấn.
- **Thanh toán:** Tích hợp VNPay với các biện pháp bảo mật như mã hóa HMAC SHA512 để đảm bảo an toàn cho các giao dịch trực tuyến.
- **Các công cụ hỗ trợ:** Axios cho việc giao tiếp giữa frontend và backend, Multer & Sharp cho việc xử lý hình ảnh, và React Toastify cho thông báo tương tác, giúp nâng cao trải nghiệm người dùng.

## Quy trình và Nghiệp vụ
Quy trình hoạt động của hệ thống được thiết kế rõ ràng với các module chính như:
- **Quản lý người dùng:** Hỗ trợ đăng nhập/đăng xuất qua Google OAuth, cập nhật thông tin cá nhân và xem lịch sử đơn hàng.
- **Quản lý sản phẩm:** Cho phép Admin quản lý danh mục sản phẩm với các thao tác thêm, sửa, xóa và hiển thị danh sách sản phẩm một cách trực quan.
- **Xử lý giỏ hàng:** Người dùng có thể thêm sản phẩm vào giỏ, cập nhật số lượng hoặc loại bỏ sản phẩm, đồng thời theo dõi tổng tiền.
- **Thanh toán:** Hệ thống tạo đơn hàng từ giỏ hàng hoặc qua chức năng “mua ngay”, chuyển hướng thanh toán qua VNPay và cập nhật trạng thái đơn hàng sau khi giao dịch thành công.

## Demo video
📺 [Xem video demo tại đây](https://youtu.be/LLpI7fyQ0Uo)
