function getThreeNumbers () {
  let arr = []
  let i = 0
  while (i<3) {
    let number = Math.floor(0 + Math.random() * (4 + 1 - 0))
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
}
