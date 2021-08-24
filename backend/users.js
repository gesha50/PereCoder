const redis = require("redis");
const client = redis.createClient();

class Users {
  constructor() {
    this.users = []
    this.usersInRoom = []
  }
  add(user) {
    this.users.push(user)
  }
  get(id) {
    return this.users.find(user => user.id === id)
  }
  remove (id) {
      const user = this.get(id)
    if (user) {
      this.users.filter(user => user.id !== id)
    }
    return user
  }
  getAllUsers(key, room, io) {
    client.keys(key, function (e, usersKeyInRoom){
      if (e) console.log(e)
      let multi = client.multi()
      usersKeyInRoom.forEach(userKeyInRoom =>{
        multi.hgetall(userKeyInRoom.split(':')[3])
      })
      multi.exec(function(err, replies) {
        io.to(room).emit('updateUsers', replies)
      })
    })
  }
}

module.exports = function () {
  return new Users()
}
