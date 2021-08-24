

// example 1 work !!
// client.sadd("key", "member1");
// client.sadd("key", "member2");
//
// const getAsync = promisify(client.smembers).bind(client);
//
// getAsync("key")
//   .then(res=>{
//     console.log(res)
//     console.log('work!')
//   })
//   .catch(e=>{
//     console.log(e)
//   });
// end example 1

// example 2 work!!
//  client.hmset('room:1111:user:1', 'name', 'hope', 'room', '1111', 'team', 'white')
//  client.hmset('room:1111:user:2', 'name', 'grisha', 'room', '1111', 'team', 'black')
// var myKeys = [];
// function getKeys(callback) {
//   client.keys("room:1111:user:*", function (err, keys) {
//     keys.forEach(function (key, i) {
//       myKeys.push(key);
//     });
//     callback();
//   });
// }
// var myUsers = [];
// getKeys(function() {
//   myKeys.forEach(function(key){
//     client.hgetall(key, function (err, currencyData) {
//       if (err) console.log(err);
//       console.log(currencyData);
//       myUsers.push(currencyData)
//       if (key === myKeys[myKeys.length-1]) {
//         return finish(myUsers)
//       }
//     })
//   })
// });
// function nextCode (data) {
//   console.log('finish')
//   console.log(data)
// }

//end example 2
// same as example 2 work!!
// client.hmset('room:1111:user:1', 'name', 'hope', 'room', '1111', 'team', 'white')
// client.hmset('room:1111:user:2', 'name', 'grisha', 'room', '1111', 'team', 'black')
// client.keys("room:1111:user:*", function (err, keys) {
//   let multi = client.multi()
//   for (let uuid in keys) {
//     multi.hgetall(keys[uuid])
//   }
//   multi.exec(function(err, replies) {
//     nextCode(replies)
//   });
// })
// function nextCode (data) {
//   console.log('finish')
//   console.log(data)
// }
//
// socket.on('createMessage', data => {
//   setTimeout(() => {
//     socket.emit('newMessage', {
//       text: data.text+' Server'+ socket.id
//     })
//   }, 500)
// })
