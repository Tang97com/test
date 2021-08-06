// 判断金额的正则表达式
const Reg = num => {
  console.log(num)
  return new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)
}

// 姓名的正则表达式
const isCorrectName = name => {
  let reg = /^[\u4e00-\u9fa5]{2,6}$/
  return reg.test(name)
}

// 身份证号码判断
const isIDCard = nums => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return (reg.test(nums))
}

// 手机正则表达式
const isMobile = mobile => {
  let flag = /^1[3-9]\d{9}$/.test(mobile)
  return flag
}

// 支付订单号
function setTimeDateFmt(s) { // 个位数补齐十位数
  return s < 10 ? '0' + s : s;
}

const randomOrder = () => {
  const now = new Date()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let hour = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  month = setTimeDateFmt(month)
  day = setTimeDateFmt(day)
  hour = setTimeDateFmt(hour)
  minutes = setTimeDateFmt(minutes)
  seconds = setTimeDateFmt(seconds)                                                                                              
  let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
  console.log(orderCode)
  return orderCode;
}

// 配送费



module.exports = {
  Reg,
  isMobile,
  randomOrder,
  isIDCard,
  isCorrectName
}