function callFindUser(element) {
    if (element.which === 13 || element.type === 'click') {
        let keyword = $('#input-find-user-contact').val()
        let regrexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
        if (!keyword.length) {
            alertify.notify("Chưa nhập nội dung tìm kiếm", "errors", 7)
            return false
        }
        if (!regrexKeyword.test(keyword)) {
            alertify.notify("Lỗi từ khoá tìm kiếm, mời nhập lại", "errors", 7)
            return false
        }
        $.get(`/contact/find-user/${keyword}`, function (data) {
            $('#find-user ul').html(data)
            // after call list request to add contact
            addContact()
            removeRequestContact()
        }) 
    }
}
$(document).ready(function () {
    $('#input-find-user-contact').bind("keypress", callFindUser)
    $('#btn-find-user-contact').bind("click", callFindUser)
}) 