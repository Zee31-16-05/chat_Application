const io = require('socket.io')('8000', {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

let users = [];
const addUser = (userId, socketId, userInfo) => {
    console.log(userId, socketId, userInfo);

    const checkUser = userInfo ? users.some(u => u.userId === userId) : true

    if (!checkUser) {
        users.push({
            userId,
            socketId,
            userInfo
        })
    } else {
        const user = users.find(u => u.userId === userId)
    }
}

const userRemove = (socketId) => {
    users = users.filter(s => s.socketId !== socketId)
}

const findFriend = (id) => {
    return users.find(u => u.userId == id)
}

const userLogout = (userId) => {
    console.log("---------=================>",userId);
    users = users.filter(u=>u.userId !== userId)
    console.log("---------=================>",users);
}

io.on('connection', (socket) => {
    // console.log("socket is connecting...");
    socket.on('addUser', (userId, userInfo) => {
        addUser(userId, socket.id, userInfo)
        io.emit('getUser', users)
        const us = users.filter(u=>u.userId !== userId);
        const con = 'new_user_add';
        for(var i = 0; i <us.length; i++ ){
             socket.to(us[i].socketId).emit('new_user_add',con);
        }
        console.log(`user is connected...`);
    })

    socket.on('sendMessage', async (data) => {
        const user = await findFriend(data.reseverId)
        if (user) {
            // socket.to(user.socketId).emit('getMessage', {
            //     senderId: data.senderId,
            //     senderName: data.senderName,
            //     reseverId: data.reseverId,
            //     createdAt: data.time,
            //     message: data.message

            // })
            socket.to(user.socketId).emit('getMessage', data)
        }


    });

    socket.on('messageSeen', msg => {
        const user = findFriend(msg.senderId);
        if (user !== undefined) {
            socket.to(user.socketId).emit('msgSeenResponse', msg)
        }
    })

    socket.on('deliveredMessage', msg => {
        const user = findFriend(msg.senderId);
        if (user !== undefined) {
            socket.to(user.socketId).emit('msgDeliveredResponse', msg)
        }
    })

    socket.on('seen', data => {
        const user = findFriend(data.senderId);
        if (user !== undefined) {
            socket.to(user.socketId).emit('seenSuccess', data)
        }
    })




    socket.on('typingMessage', (data) => {
        const user = findFriend(data.reseverId);
        if (user) {
            socket.to(user.socketId).emit('typingMessageGet', {
                senderId: data.senderId,
                reseverId: data.reseverId,
                msg: data.msg

            })
        }
    })

    socket.on('logout',userId => {
        
        userLogout(userId);
   })

    socket.on('disconnect', () => {
        const user = users.find(u => u.socketId === socket.id)
        userRemove(socket.id)

        console.log(`user is Disconnect...`);
        io.emit('getUser', users)
    })
})