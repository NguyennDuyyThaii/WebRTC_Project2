$(document).ready(function() {
    $("#link-read-more").bind("click", function() {
        let skipNumber = $("ul.list-notifications").find("li").length
            // cach 2 ne
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
            if (!notifications.length) {
                alertify.notify("Bạn không còn thông báo nào cả", "error", 7)
                return false
            }
            notifications.forEach(function(item) {
                $("ul.list-notifications").append(`<li>${item}</li>`)
            })
        })
    })
})