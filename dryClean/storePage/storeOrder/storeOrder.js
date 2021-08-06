import { StoreOrder } from '../../../api/api';
Page({
  data: {
    list: [], 
    page: 2,  // 页数
    last_page: 0, //总页数
    state: '', // 订单状态
    flag: '', // 是否还有数据
    type: 0  //当前订单类型
  },
  onShow() {
    this.setData({
      last_page: 0,
      page: 2
    })
    this.getData({type: this.data.type, page: 1, id: 1})
  },
  onLoad: function (options) {
    let type = +options.type
    let state = options.state || '订单'
    this.setData({
      ordertype:  options.ordertype,
      state,
      type
    })
  },
  getData({type, id, page}) {
    wx.showLoading({
      title: '拼命加载数据中...',
    })
    // StoreOrder
    StoreOrder({type, page, ordertype: this.data.ordertype}).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code === 200 ) {
        console.log("请求的页数", page, "一共", res.data.last_page)
        if (this.data.page - 2 === res.data.last_page ) {
          console.error("请求完了没有数据了")
          this.setData({
            flag: true
          })
          return 0
        }
        // console.log("43行", this.data.page)
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
      console.log("商家订单接口请求错误code不等于200", err)
    })
  },
  goToDeTetail(e) {
    console.log(e)
    let item = JSON.stringify(e.detail.order)
    let type = this.data.type
    wx.navigateTo({
      url: `../storeOrderDetail/storeOrderDetail?obj=${item}&type=${type}`,
    })
  },
  onReachBottom: function () {
    console.log("上拉刷新ING")
    if (this.data.page - 2 !== this.data.last_page ) {
      this.getData({page: this.data.page++, type: this.data.type})
    } else {
      return false
    }
  },
})