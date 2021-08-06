import { getMarikOrder } from '../../../api/api';
Page({
  data: {
    list: [],
    page: 2, 
    last_page: 0 ,
    flag: false,
    type: 0 ,
    state: '',
  },
  onShow() {
    this.setData({
      last_page: 0
    })
    let type = this.data.type
    this.getData({type, id: 1, page: 1})
  },
  onLoad: function (options) {
    console.log(options)
    let type = +options.type
    let state = options.state
    wx.setNavigationBarTitle({
      title: state,
    })
    this.setData({
      ordertype: options.ordertype,
      state,
      type
    })
  },
  getData({page, type, id}) {
    console.warn("请求参数", page, type, id)
    wx.showLoading({
      title: '正在加载...',
    })
    getMarikOrder({page, type, id, ordertype: this.data.ordertype}).then(res => {
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
        console.log("43行", this.data.page)
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
      console.error("配送员订单接口错误", err)
    })
  },
  goToDeTetail(e) {
    console.log(e)
    let item = JSON.stringify(e.detail.order)
    let type = this.data.type
    wx.navigateTo({
      url: `../orderDetail/orderDetail?obj=${item}&type=${type}`,
    })
  },
  onReachBottom: function () {
    console.warn("上拉刷新")
    if (this.data.page -2 !== this.data.last_page ) {
      this.getData({page: this.data.page++, type: this.data.type, id: 1})
    } else {
      return false
    }
  },
})