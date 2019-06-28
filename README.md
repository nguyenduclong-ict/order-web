# Đồ án tổng hợp

## API

> Base url : http://food.negoo.tech hoặc http://35.198.211.251:2306
> add token to headers.Authorization theo định dạng Bearer + token

<!-- Router chung -->

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

#### Router product

##### Lấy danh sách sản phẩm cho trang chủ

```
get : /api/product/list
query parametter :  from, page, category, provider, name, sort

> sort : sort value , category : id category, neu co nhieu gia tri cach nhay bang |
> Ex : /api/product/list?sortf=price|1|quantity|-1 // sort theo price tăng dần và quantiy giảm dần
```

<!-- ##End Router chung -->

<!-- Router Admin -->

### 2. Router Admin

<!-- Admin User -->

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

##### Thay đổi trạng thái của nhiều người dùng

```
post: /api/admin/user/change-block

body : {
    ids : [], // Danh sach userId cua user muon thay doi trang thai
    isBlock : boolean // Trang thai tai khoan
}
```

<!-- #End Admin User -->

<!-- Admin Category -->

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
body : {
    name: String,
    parentId: objectId,
    isShow : Boolean
}
```

##### Sửa Category

```
post: /api/admin/category/edit/:id
```

##### Chinh sua trang thai cua category

```
post : /api/admin/category/set-show

body : {
    ids : [] , // Mang cac id cua category
    isShow : boolean // Trang thai hien thi cua category
}
```

<!-- #End Admin Category -->

<!-- Admin Discount -->

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
    #EndDate,
    status, // 0 hoặc 1
    value,
    type : ['single', 'group'], // Áp dụng cho 1 sản phẩm hay  1 nhóm sản phẩm
    product_id,
    category_id

}
```

##### Sửa

```
post: /api/admin/discount/edit/:id
```

##### Lay danh sach discount theo ten san pham

```
get: /products/:name
```

##### Thay doi trang thai cua ma giam gia

```
post: /change-status
body : {
    ids : [],
    status : boolean
}
```

<!-- #End Admin Discount -->

<!-- Admin Payment -->

#### Router quản lý phương thức thanh toán

##### Lấy danh sách

```
get: /api/payment/list/:from-:page
```

##### Lấy chi tiết

```
get: /api/payment/detail/:id
```

##### Chỉnh sửa

```
post: /api/payment/edit/:id
```

##### Thêm

```
post: /api/payment/add
body = {
    name, // String
    description // String
}
```

##### Thay doi trang thai

```
post: /change-display
body = {
    ids : [], // mang cac id
    isShow : boolean
}
```

#### Router Admin Logs

##### Get list

```
get: /api/admin/log
query agrument : from, page, type, sort (0|1)
```

#### get detail

```
get: /api/admin/log/:id
```

<!-- #End Admin Payment -->
<!-- #End Router Admin -->

<!-- Router Customer -->

### 3. Router Customer

<!-- Customer Cart -->

#### Router Cart

##### Lấy thông tin giỏ hàng

```
get /api/customer/cart
```

##### Thêm sản phẩm vào giỏ hàng

```
post /api/customer/cart/add-product
body : {
  products : [] // Mang cac product id
}
```

##### Xoa san phẩm khỏi giỏ hàng

```
delete /api/customer/cart
body : {
  products : [] // Mang cac product id
}
```

<!-- #End Customer Cart -->

#### Router Customer Order

```
get   "/customer/order/list"
get   "/customer/order/list-payment"
---
post  "/customer/order/add"
body : {
    products : [
        productId, // id của sản phẩm
        quantity // Số lượng
    ],
    paymentId,
    discountIds
}
---
put  "/customer/order/cancel"
body : { orderId, comment }
---
put  "/customer/order/success"
body : { orderId, comment }
---
put  "/customer/order/change-product-count"
body : {
    orderDetailId, // Id của order detail
    quantity
}
```

<!-- #End Router Customer -->
<!-- Router Provider -->

### 4. Router Provider

#### Router Provider Product

```
get "/provider/product/detail/:id"
---
get "/provider/product/list"
query : { from, page, category, name }
---
post "/provider/product/add"
body : {
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  name: String,
  description: String,
  // Gia san pham
  price: {
    type: Number,
    default: 0
  },
  // Có đang sale hay không
  isSale: {
    type: Boolean,
    default: false
  },
  sale: {
    type: Number, // Phần trăm sale
    default: 0
  },
  // sô lượng tối đa cho phép đặt
  maxOrder: {
    type: Number,
    default: 1
  },
  // Số lượng còn lại
  quantity: {
    type: Number,
    default: 0
  },
  ordered: {
    // Số lượng đã bán
    type: Number,
    default: 0
  },
  isShow: {
    type: Boolean, // Hiển thị hoặc không hiển thị với người dùng
    default: true
  }
}
---
post "/provider/product/edit/:id"
body : {
    // Giống add
}
```

#### Router Provider Order

```
get     "/provider/order/list"
query : { from, page, customerId, providerId }
---
get     "/provider/order/detail/:id"
---
post     "/provider/order/edit-comment/:id"
body : {comment }
---
post     "/provider/order/nhan-don/:id"
post     "/provider/order/giao-hang/:id"
```

<!-- #End Router Provider -->
