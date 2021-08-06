
function scanCart() {
  try {
    let list = wx.getStorageSync('cart')
    if (list.length !== 0 ) {
      
    } else {
      wx.removeStorageSync('cart')
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  scanCart
}