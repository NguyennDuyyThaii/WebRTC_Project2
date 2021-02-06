# Messenger_WebRTC
- Clone 1 repo: git clone -b `add_destroy_request_contact` --single-branch git@github.com:NguyennDuyyThaii/Messenger_WebRTC.git
- note 1: Logic tìm bạn bè trong bảng contacts
 + Tìm kiếm người dùng trong bảng contacts trước để loại bỏ họ đi => vì đã là bạn bè rồi
 + Tìm kiếm trong bảng Users những người còn lại
 + Trả về danh sách những người này
- note 2: Chức năng thêm contact
 + thì Jquery lấy id của đối tượng x qua `x.data("uid")` của `data-uid`
 + thì bên nodeJs lấy bằng cách req.body.uid
 + phương thức post thì `return res.status(200).send({success: !!newContact})// return success:true` để bên query có thể biết thằng `succeess` để tiếp tục câu lệnh tiếp
 + |||||||||| GET_POST_DELETE ||||||||||
 + Hiên thị dữ liệu thì dùng `get->html(data)` vào để hiện dữ liệu ra
 + Xoá, put dữ liệu thì gọi đến `$.ajax` ở phía server dùng phương thức delete, put
 + Post dữ liệu thì `post` bình thường, nếu cần đến id thì `uid` là xong 
 - note 3: 
 + nModified
 + dùng map mà còn sử dụng async/await trong nó thì để chạy được thằng map đó thì dùng await Promise.all nhé