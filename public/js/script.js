window.addEventListener('load', function (e) {
    const socket = io()

    const msgField = document.querySelector('.chat__messages');
    const chatForm = document.querySelector('#chat-form');
    const msgInp = document.querySelector('.chat__message');

    const { username, room } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    })

    const userOptions = {
        room: room,
        name: username
    }

    socket.emit('join', userOptions)

    socket.on('bot', (msg) => {
        msgSend(msg)
    })

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const val = msgInp.value
        msgInp.value = ''

        socket.emit('message', val)
    })

    socket.on('message', (msg) => {
        msgSend(msg)
    })

    socket.on('left', (msg) => {
        msgSend(msg)
    })

    function msgSend(data) {
        const p = document.createElement('p')
        p.innerHTML = `
        <strong>${data.user.name}</strong> ${data.msg}
        `
        msgField.append(p)
    }



});