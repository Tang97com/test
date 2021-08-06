var app =  getApp();
Page({
  data: {
    topText: ['价格', '距离'],
    jdList: []
  },
  onLoad: function (options) {
    var that = this
    let appList = app.globalData.searchHotel
    that.setData({
      jdList:appList
    })
    console.log(appList)
    wx.setNavigationBarTitle({
      title: '酒店列表',
    })
  },

  jumpDetail(e) {
    console.log(e)
    let id = e.currentTarget.id
    wx.navigateTo({
      url: `../detail/detail?id=${id}`,
    })
  },
  onHide: function () {
    this.data.jdList = []
  }
})