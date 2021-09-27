function getThreeNumbers () {
  let arr = []
  let i = 0
  while (i<3) {
    let number = Math.floor(1 + Math.random() * 4)
    if (i === 0) {
      arr.push(number)
      i++
    } else {
      if (!contains(arr, number)) {
        arr.push(number)
        i++
      }
    }
  }
  return arr
}

function isRoomExist (client, room) {
  let isExist = false
  client.keys('room:????', function (e, keys) {
    let multi = client.multi()
    keys.forEach(key=>{
      let oldRoom = key.split(':')[1]
      if (oldRoom === room) {
        isExist = true
      }
    })
    multi.exec(function(err, replies) {
      return isExist
    })
  })
}

function getRoomNumber () {
  let string = ''
  let i = 0
  while (i<4) {
    let number = Math.floor(1 + Math.random() * 9)
    string += number.toString()
    i++
  }
  return string
}

function isGameFinish(blHid, whIn, whHid, blIn) {
  if ((whHid<2 && whIn===2 && blIn<2 && blHid<2) ||
    (whHid<2 && whIn<2 && blIn<2 && blHid===2) ||
    (whHid===2 && whIn===2 && blIn<2 && blHid===2) ||
    (whHid<2 && whIn===2 && blIn===2 && blHid===2) ||
    (whHid<2 && whIn===2 && blIn<2 && blHid===2)){
    return 'whiteWin'
  }
  if ((whHid<2 && whIn<2 && blIn===2 && blHid<2) ||
    (whHid === 2 && whIn<2 && blIn<2 && blHid<2) ||
    (whHid===2 && whIn===2 && blIn===2 && blHid<2) ||
    (whHid===2 && whIn<2 && blIn===2 && blHid===2) ||
    (whHid===2 && whIn<2 && blIn===2 && blHid<2)){
    return 'blackWin'
  }
  if ((whHid === 2 && whIn===2 && blIn<2 && blHid<2) ||
    (whHid<2 && whIn<2 && blIn===2 && blHid===2) ||
    (whHid === 2 && whIn<2 && blIn<2 && blHid===2) ||
    (whHid<2 && whIn===2 && blIn===2 && blHid<2)) {
    let whRes = whIn - whHid
    let blRes = blIn - blHid
    if (whRes === blRes) {
      return 'superRound'
    }
    if (whRes>blRes) {
      return 'whiteWin'
    }
    if (whRes<blRes) {
      return 'blackWin'
    }
  }
  if ((whHid === 2 && whIn===2 && blIn===2 && blHid===2)) {
    return 'superRound'
  }
  return 0
}

function contains(arr, elem) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getThreeNumbers,
  contains,
  isGameFinish,
  getRoomNumber,
  isRoomExist,
}
