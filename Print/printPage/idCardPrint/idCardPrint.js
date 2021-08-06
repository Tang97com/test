
Page({
  data: {
    zm: '',
    fm: '',
    file: [],
    flag: false
  },
  onLoad: function (options) {

  },
  printPage() {
    // console.warn("打印完成支付逻辑")
    console.log(this.data.file)
    let list = JSON.stringify(this.data.file)
    wx.navigateTo({
      url: `../../pay/pay?file=${list}&filelink=${this.data.fileLink}&label=证件照`,
    })
  },
  uploadZm() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let obj = {path: tempFilePaths[0], price: 1, num: 1, name: '证件照正面.jpg'}
        let file = this.data.file.concat(obj)
        that.setData({
          file,
          zm: res.tempFilePaths
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  uploadFm() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) =>{
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let obj = {path: tempFilePaths[0], price: 1, num: 1, name: '证件照反面.jpg'}
        let file = this.data.file.concat(obj)
        
        that.setData({
          file,
          fm: res.tempFilePaths
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})