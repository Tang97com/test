// Food/pages/administer/administer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: '/static/img/y.png',
  },

  // 上传门店图片
  uploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const file = res.tempFilePaths
        wx.uploadFile({
          url: 'https://sa.scyxk.top/api/attachment/upload',
          filePath: file[0],
          name: 'file',
          header: {"Content-Type": "multipart/form-data"},
          success: (res) => {
            var data = JSON.parse(res.data);
            console.log(data);
            data.msg === '成功' && wx.hideToast(); wx.showToast({
              title: data.msg,
            })
            this.setData({
               imgurl: data.data.url 
            })
          },
          fail: (res) => {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})