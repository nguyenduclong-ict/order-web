# Đồ án tổng hợp 

## API 
> Base url : http://food.negoo.tech hoặc http://35.198.211.251:2306 
> add token to headers.Authorization theo định dạng Bearer + token

### 1. Router chung
#### Router Register
```
post: /api/register/ 
body = {
    username, 
    password,
    email,  
    type : ['provider', 'admin', 'customer']
}
```
#### Router Login
```
post: /api/login/
body  = { 
	email,
	password,
	type: ['provider', 'admin', 'customer']
}
```
#### Router /api/token : Lấy thông tin của user đang đăng nhập
##### Lấy thông tin của người dùng :  
```
get: /api/token/info 
```
##### Kiểm tra trạng thái token:
```
get: /api/token/status 
```
##### Edit thông tin người dùng ví dụ name, address, phone
```
post: /api/token/edit/ 
```
##### Đổi password body { oldPassword : ‘’, newPassword : ‘’}
```
post: /api/token/change-password 
```
##### Lấy token cho Guest (Khách khi chưa đăng nhập cần token này để tạo giỏ hàng theo phiên làm việc)
```
get: /api/guest-token
```
#### Router category 
##### Lấy danh sách category:
```
get: /api/category/list/:from-:page:-parent
```
> parent có thể để ‘all’
#### Router customer/product 
##### Lấy danh sách sản phẩm cho trang chủ
### 2. Router Cutomer
#### Customer Product
##### Lấy danh sách sản phẩm cho khách hàng
> category & provider có thể để ‘all’ để lấy ra tất cả
```
get: /api/customer/product/list/:from-:page:-category-:provider
```
### 3. Router Admin
#### Router admin/user
##### Lấy danh sách tài khoản, type=all để lấy tất cả các loại tài khoản
```
get: /api/admin/user/list/:type-:from-:page 
```
##### Lấy thông tin user theo username
```
get: /api/admin/user/detail/:username
```
##### Khoá tài khoản
```
post: /api/admin/user/block/:id
```
##### UnBlock tài khoản 
```
post: /api/admin/user/unblock/:id
```
#### Router Admin for Category
##### Lấy danh sách Category
```
get: /api/admin/category/list
```
##### Lấy chi tiết 
```
get: /api/admin/category/detail/:id
```
##### Thêm 
```
post: /apt/admin/category/add
```
##### Sửa Category
post: /api/admin/category/edit/:id
#### Router Admin Discount
##### Lấy danh sách
```
get: /api/admin/discount/list/:from-:page-:productid-:categoryid
```
##### Lấy chi tiết
```
get: /api/admin/discount/detail/:id
```
##### Thêm discount
```
get: /api/admin/discount/add
body = {
    startdate,
    endDate,
    status, // 0 hoặc 1
    value,
    type : ['single', 'group'], // Áp dụng cho 1 sản phẩm hay  1 nhóm sản phẩm
    product_id,
    category_id

}
```
##### Sửa
```
get: /api/admin/discount/edit/:id
```
#### Router quản lý phương thức thanh toán
##### Lấy danh sách
```
get: /list/:from-:page
```
##### Lấy chi tiết
```
get: /detail/:id
```
##### Chỉnh sửa
```
post: /edit/:id
```
##### Thêm
```
post: /add
body = {
    name, // String
    description // String
}
```