# Đặc tả màn hình Student List

## 1. Mục tiêu
- Màn hình hiển thị danh sách student sau khi người dùng đăng nhập thành công.
- Hỗ trợ tìm kiếm, phân trang, sắp xếp, điều hướng tới màn hình thêm mới/cập nhật, xóa record và logout.

## 2. Thông tin chung
- Tên màn hình: Student List
- Mã màn hình đề xuất: SCR-STUDENT-LIST
- Điều kiện vào màn hình: user đã đăng nhập.
- Điều kiện rời màn hình:
  - Logout: quay về màn hình Login.
  - Edit/Add Student: chuyển sang màn hình Register/Update student.

## 3. Danh sách control theo layout
- (1) Logo: image
- (2) User name: label text (hiển thị tên user sau login)
- (3) Logout: link
- (4) Student Code: input text
- (5) Student Name: input text
- (6) Birthday: input date
- (7) Search: button
- (8) Cột No: header click sort
- (9) Cột Code: header click sort
- (10) Cột Name: header click sort
- (11) Cột Birthday: header click sort
- (12) Cột Address: hiển thị text
- (13) Cột Score: header click sort
- (14) Link Edit: link trên từng row
- (15) Link Delete: link trên từng row
- (16) first: button phân trang
- (17) prev: button phân trang
- (18) page number: button phân trang
- (19) next: button phân trang
- (20) last: button phân trang
- (21) Add Student: button

## 4. Hiển thị ban đầu
### 4.1 Dữ liệu và trạng thái
- Hiển thị logo (1).
- Hiển thị tên user đã đăng nhập ở (2).
- Link logout (3) ở trạng thái khả dụng.
- Khu vực list hiển thị thông tin student.
- Mặc định hiển thị 10 record trên 1 trang.
- Nếu không có dữ liệu:
  - Vẫn hiển thị header bảng.
  - Hiển thị thông báo "Không có dữ liệu".
  - Các nút phân trang ở trạng thái disable.

### 4.2 Giá trị mặc định filter
- Student Code (4): rỗng.
- Student Name (5): rỗng.
- Birthday (6): rỗng.

## 5. Quy tắc tìm kiếm (Search - nút 7)
### 5.1 Validation phía client
- Student Code (4):
  - Không vượt quá maxlength cấu hình (đề xuất 10 ký tự).
- Student Name (5):
  - Không vượt quá maxlength cấu hình (đề xuất 255 ký tự).
- Birthday (6):
  - Đúng định dạng ngày hợp lệ theo chuẩn input date.
  - Không chấp nhận ngày không tồn tại (ví dụ 2026-02-30).
- Khi có lỗi validation:
  - Không gọi API tìm kiếm.
  - Hiển thị thông báo lỗi ngay tại field hoặc phía trên form.

### 5.2 Validation phía server
- Server kiểm tra lại toàn bộ ràng buộc maxlength và ngày hợp lệ.
- Nếu dữ liệu không hợp lệ:
  - Trả về mã lỗi nghiệp vụ (4xx).
  - Trả danh sách lỗi theo field.
- UI hiển thị lỗi từ server tương ứng field.

### 5.3 Action khi tìm kiếm thành công
- Click Search (7) gọi API theo điều kiện filter hiện tại.
- Reset về trang 1.
- Hiển thị danh sách student theo kết quả trả về.
- Vẫn giữ lại giá trị filter đã nhập.

## 6. Phân trang
### 6.1 Quy tắc chung
- Kích thước trang cố định: 10 record/trang.
- Hiển thị danh sách nút số trang theo tổng số trang.
- Trang hiện tại được highlight.

### 6.2 Hành vi từng nút
- first (16):
  - Di chuyển về trang đầu tiên.
  - Disable khi đang ở trang đầu.
- prev (17):
  - Di chuyển về trang liền trước.
  - Disable khi đang ở trang đầu.
- page number (18):
  - Di chuyển tới đúng trang được click.
- next (19):
  - Di chuyển tới trang liền sau.
  - Disable khi đang ở trang cuối.
- last (20):
  - Di chuyển về trang cuối.
  - Disable khi đang ở trang cuối.

### 6.3 Dữ liệu khi đổi trang
- Giữ nguyên điều kiện filter và trạng thái sort hiện tại.
- Gọi API lấy dữ liệu theo page mới.

## 7. Sắp xếp dữ liệu
- Áp dụng cho các cột: (8) No, (9) Code, (10) Name, (11) Birthday, (13) Score.
- Click lần 1 vào header: sort tăng dần.
- Click lần 2 vào cùng header: sort giảm dần.
- Click lần 3: quay lại tăng dần (toggle giữa asc/desc).
- Chỉ cho phép 1 cột sort tại một thời điểm (single sort).
- Khi sort:
  - Giữ nguyên filter hiện tại.
  - Reset hoặc giữ trang theo quy ước dự án (đề xuất reset về trang 1 để dễ kiểm soát kết quả).
  - Gọi API với tham số sortField, sortOrder.

## 8. Chức năng trên từng row
### 8.1 Edit (14)
- Click link Edit chuyển sang màn hình Student Register/Update.
- Truyền theo studentId (hoặc mã định danh tương đương) để load dữ liệu chi tiết.

### 8.2 Delete (15)
- Click link Delete hiển thị popup xác nhận xóa record.
- Popup gồm:
  - Tiêu đề xác nhận.
  - Nội dung xác nhận xóa.
  - Nút Confirm và Cancel.
- Confirm:
  - Gọi API xóa.
  - Thành công: reload list theo filter/page/sort hiện tại.
  - Nếu xóa record cuối cùng của trang hiện tại và trang đó rỗng: lùi về trang trước hợp lệ.
- Cancel:
  - Đóng popup, không thay đổi dữ liệu.

## 9. Chức năng Add Student (21)
- Click Add Student chuyển sang màn hình Student Register/Update ở chế độ thêm mới.

## 10. Logout (3)
- Click link logout thực hiện:
  - Xóa thông tin đăng nhập phiên hiện tại (token/session).
  - Điều hướng về màn hình Login.
  - Không cho phép quay lại màn hình list bằng back nếu chưa đăng nhập lại.

## 11. Định nghĩa API đề xuất
### 11.1 API lấy danh sách student
- Method: GET
- Endpoint: /api/students
- Query params:
  - studentCode
  - studentName
  - birthday
  - page
  - size (mặc định 10)
  - sortField
  - sortOrder (asc|desc)
- Response:
  - items: danh sách student
  - page: trang hiện tại
  - size: kích thước trang
  - totalItems: tổng số bản ghi
  - totalPages: tổng số trang

### 11.2 API xóa student
- Method: DELETE
- Endpoint: /api/students/{studentId}
- Response:
  - Thành công: 200/204
  - Thất bại nghiệp vụ: 4xx + message

## 12. Thông điệp lỗi/feedback đề xuất
- Validation:
  - Student Code vượt quá độ dài cho phép.
  - Student Name vượt quá độ dài cho phép.
  - Birthday không hợp lệ.
- Search không có dữ liệu: Không tìm thấy student phù hợp.
- Delete thành công: Xóa student thành công.
- Delete thất bại: Không thể xóa student. Vui lòng thử lại.
- Lỗi hệ thống: Có lỗi xảy ra. Vui lòng thử lại sau.

## 13. Tiêu chí chấp nhận (Acceptance Criteria)
- AC-01: Vào màn hình sau login hiển thị logo, user name, link logout, list student và 10 record/trang.
- AC-02: Search kiểm tra validation cả client và server cho maxlength và ngày hợp lệ.
- AC-03: Search thành công hiển thị đúng dữ liệu theo filter.
- AC-04: first/prev/next/last hoạt động đúng theo trạng thái trang.
- AC-05: Click số trang điều hướng đúng trang được chọn.
- AC-06: Click các cột được chỉ định thực hiện sort tăng/giảm đúng quy tắc toggle.
- AC-07: Click Edit điều hướng sang màn hình Student Register/Update với dữ liệu đúng record.
- AC-08: Click Delete hiển thị popup xác nhận và xử lý Confirm/Cancel đúng.
- AC-09: Click Add Student điều hướng sang màn hình Student Register/Update chế độ thêm mới.
- AC-10: Click Logout xóa phiên đăng nhập và quay về màn hình Login.

## 14. Trường hợp biên cần test
- Không có bản ghi nào trong hệ thống.
- Tổng bản ghi đúng bằng 10, 11, 20, 21 để kiểm tra phân trang.
- Record cuối của trang bị xóa.
- Ký tự đặc biệt/Unicode trong Student Name.
- User thao tác sort rồi mới đổi trang và ngược lại.
- Session hết hạn trong lúc đang thao tác Search/Delete.
