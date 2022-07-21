const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'))
})

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

const users = []

function getCurrentUser(id) {
    return users.find(user => user.id === id)
}
function leftUser(id) {
    const idx = users.findIndex(user => user.id === id)
    return users.splice(idx, 1)[0]
}

io.on('connection', (socket) => {
    console.log('New WS connected...');

    // function Options(user, room, name) {
    //     return {

    //         date: new Date()
    //     }
    // }

    // function roomUser(room){

    // }

    // console.log(socket.id);
    socket.on('join', (options) => {
        const user = {
            name: options.name,
            room: options.room,
            id: socket.id
        }
        users.push(user)

        socket.join(user.room)

        socket.emit('bot', {
            user: { name: 'bot' }, msg: 'Welcome to the chat'
        }) // Salomlashish

        socket.broadcast.to(user.room).emit('bot', {
            user: { name: 'bot' }, msg: 'Joined the chat'
        }
        ) // faqat user o'ziga ko'rinmaydi
    })

    socket.on('message', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', { user, msg })
    })

    socket.on('disconnect', () => {
        const user = leftUser(socket.id)
        socket.broadcast.to(user.room).emit('left', { user, msg: 'Left the chat ' })
    })

})

const PORT = 3000 || process.env.PORT

server.listen(3000, () => console.log(`Server working on port ${PORT}`))