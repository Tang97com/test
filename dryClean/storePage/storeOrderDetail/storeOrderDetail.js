import { StoreCleanOVer, StoreReceveOrder } from '../../../api/api';
Page({
  data: {
    list: [],
    state: 0,
    cancel: '',
    recev: '',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    console.log(options)
    if (+options.type === 1) {
        this.setData({
          recev: '接单'
        })
    } else if (+options.type === 2) {
      this.setData({
        clean: '清洗完成'
      })
    } else {
      this.setData({
        cancel: '',
        recev: ''
      })
    }
    let item = JSON.parse(options.obj)
    console.log(item)
    this.setData({
      list: item,
      state: options.type
    })
  },
  // 接单
  getOrder() {
    this.setData({
      mask: true
    })
    let id =  1 // 商家iD
    let orderid = +this.data.list.id  //订单ID
    if ( id && orderid) {
      StoreReceveOrder({id, idf: 'store', orderid}).then(res => {
        console.log(res)
        res.code === 200 && this.back("接单成功,2秒后自动返回", '接单')
      }).catch(err => {
        console.error(err)
      })
    }
  },
  // 取消订单
  cleanOver(e) {
    this.setData({
      mask: true
    })
    let id =  1 // 商家iD
    let orderid = +this.data.list.id
    let order_number = +this.data.list.order_number
    if (order_number && orderid && id) {
      StoreCleanOVer({order_number, orderid, id}).then(res => {
        console.log(res)
        res.code == 200 && this.back('清洗已完成,2秒后自动返回')
      }).catch(err => {
        console.error(err)
      })
    }
  },
  back(title, state) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1500)
  }
})