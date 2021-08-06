import { UserOrder } from '../../../api/api';
Page({
  data: {
    list: [], 
    idf: 'user',
    page: 2,  // 页数
    last_page: 0 ,//最后的页数
    state: '', // 订单状态
    flag: '', // 是否还有数据
    type: 0 , //当前订单类型
    ordertype: '', //小程序订单的类型
  },
  onShow() {
    // let id = wx.getStorageSync('userInfo').id
    this.getData({type: this.data.type, page: 1})
  },
  onLoad: function (options) {
    console.log(options)
    if (options.type) {
      let state = options.state || '订单'
      this.setData({
        ordertype: options.ordertype,
        state,
        type: +options.type
      })
      // this.getData({type: +options.type, id: 1})
    }
  },
  getData({type, page}) {
    wx.showLoading({
      title: '拼命加载数据中...',
    })
    UserOrder({type, page, ordertype: this.data.ordertype}).then(res => {
      wx.hideLoading()
      if (res.code === 200 ) {
        console.log("请求的页数", page, "一共", res.data.last_page)
        if (this.data.page - 2 === res.data.last_page ) {
          console.error("请求完了没有数据了")
          this.setData({
            flag: true
          })
          return
        }
        let item = this.data.page < 3 ? res.data.data : this.data.list.concat(res.data.data)
        console.warn(item)
        this.setData({
          list: item,
          last_page: res.data.last_page
        })
      } else {
        console.error("code不等于200", res)
        return false
      }
    }).catch(err => {
      console.error(err)
    })
    
  },
  goToDeTetail(e) {
    console.log(e)
    let item = JSON.stringify(e.detail.order)
    let type = this.data.type
    wx.navigateTo({
      url: `../userorderDetail/userorderDetail?obj=${item}&type=${type}`,
    })
  },
  onReachBottom: function () {
    console.warn("上拉刷新ING")
    if (this.data.page - 2 !== this.data.last_page) {
      this.getData({page: this.data.page++, type: this.data.type})
    } else {
      return false
    }
  },
})