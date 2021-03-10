function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat")
        let callerName = $("#navbar-username").text()

        let dataToEmit = {
                listenerId: targetId,
                callerName: callerName
            }
            // step 01 of roadmap: Check User02 online?
        socket.emit("caller-check-listener-online-or-not", dataToEmit)
    })
}

$(document).ready(function() {
    // step 02 of roadmap: User 02 offline, cancel call

    socket.on("server-send-listener-is-offline", function() {
        alertify.notify("Người dùng này hiện không trực tuyến", "error", 7)
    })

    let getPeerId = "";
    const peer = new Peer({ host: 'peerjs-server.herokuapp.com', secure: true, port: 443 });

    peer.on("open", function(peerId) {

        getPeerId = peerId
    });

    // step 03 of roadmap: Request peerId of listener User 02
    socket.on("server-request-peer-id-of-listener", function(response) {
            let listenerName = $("#navbar-username").text()
            let dataToEmit = {
                    callerId: response.callerId,
                    listenerId: response.listenerId,
                    callerName: response.callerName,
                    listenerName: listenerName,
                    listenerPeerId: getPeerId
                }
                // step 04 of roadmap: Listener User 02 send PeerId to server
            socket.emit("listener-emit-peer-id-to-server", dataToEmit)
        })
        // step 05 of roadmap: Server send peerId of User02 to User01
    socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
        let dataToEmit = {
                callerId: response.callerId,
                listenerId: response.listenerId,
                callerName: response.callerName,
                listenerName: response.listenerName,
                listenerPeerId: response.listenerPeerId,
            }
            // step 06 of roadmap: User01 request call to server
        socket.emit("caller-request-call-to-server", dataToEmit)

        let timeInterVal
        Swal.fire({
            title: `Đang gọi cho &nbsp; <span style="color:#2ECC71">${response.listenerId}</span> &nbsp;
                <i class="fa fa-volume-control-phone"></i>`,
            html: `
            Thời gian: <strong style="color:#dd3f3a;"></strong> giây. <br/><br/>
            <button id="btn-cancel-call" class="btn btn-danger">Huỷ cuộc gọi</button>
            `,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-cancel-call").on("click", function() {
                    Swal.close()
                    clearInterval(timeInterVal)
                        //step 07 of roadmap: User01 cancel request call to server
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit)
                })

                Swal.showLoading()
                timeInterVal = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                }, 1000)
            },
            onOpen: () => {
                // step 12
                socket.on("server-send-reject-call-to-caller", function(response) {
                        Swal.close()
                        clearInterval(timeInterVal)

                        Swal.fire({
                            type: "info",
                            title: `<span style="color:#2ECC71">${response.listenerName}</span> &nbsp; không thể nghe máy`,
                            backdrop: "rgba(85,85,85,0.4)",
                            width: "52rem",
                            allowOutsideClick: false,
                            confirmButtonColor: "#2ECC71",
                            confirmButtonText: "Xác nhận"
                        })
                    })
                    // step 13
                socket.on("server-send-accept-call-to-caller", function(response) {
                    Swal.close()
                    clearInterval(timeInterVal)
                    console.log("Caller okkkk...")
                })
            },
            onClose: () => {
                clearInterval(timeInterVal)
            }
        }).then((result) => {
            return false;
        })
    })

    // step 08 of roadmap: Server send request call to User02
    socket.on("server-send-request-call-to-listener", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId,
        }
        let timeInterVal
        Swal.fire({
            title: `<span style="color:#2ECC71">${response.callerName}</span> &nbsp; muốn trò chuyện video cho bạn
                <i class="fa fa-volume-control-phone"></i>`,
            html: `
            Thời gian: <strong style="color:#dd3f3a;"></strong> giây. <br/><br/>
            <button id="btn-reject-call" class="btn btn-danger">Từ chối cuộc gọi</button>
            <button id="btn-accept-call" class="btn btn-success">Đồng ý cuộc gọi</button>
            `,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-reject-call").on("click", function() {
                    Swal.close()
                    clearInterval(timeInterVal)
                        // step 10 of roadmap: User02 send reject request call to server
                    socket.emit("listener-reject-request-call-to-server", dataToEmit)
                })
                $("#btn-accept-call").on("click", function() {
                    Swal.close()
                    clearInterval(timeInterVal)
                        // step 11 of roadmap: User02 send accept call to server
                    socket.emit("listener-accept-request-call-to-server", dataToEmit)
                })

                Swal.showLoading()
                timeInterVal = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                }, 1000)
            },
            onOpen: () => {
                // step 09 of roadmap: Server send cancel request call to User02
                socket.on("server-send-cancel-request-call-to-listener", function(response) {
                        Swal.close()
                        clearInterval(timeInterVal)
                    })
                    // step 14
                socket.on("server-send-accept-call-to-listener", function(response) {
                    Swal.close()
                    clearInterval(timeInterVal)
                    console.log("Listener okkkk...")
                })
            },
            onClose: () => {
                clearInterval(timeInterVal)
            }
        }).then((result) => {
            return false;
        })
    })

})