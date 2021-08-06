import { userOrderBack,userConfirmOrder  } from '../../../api/api';
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
    if (+options.type === 2) {
        this.setData({
          cancel: '取消'
        })
    }

    if ( +options.type === 3 ) {
      this.setData({
        clean: '确认完成'
      })
    }
    let item = JSON.parse(options.obj)
    console.log(item)
    this.setData({
      list: item,
      state: options.type
    })
  },
  // 用户确认订单完成
  usercleanOver() {
    this.setData({
      mask: true
    })
    wx.showLoading({
      title: '正在确认...',
    })
    let id = 1  // 用户id
    let orderid = this.data.list.id  //订单id
    let idf = 'user' // 当前用户身份
    if (id && orderid && idf ) {
      userConfirmOrder({id, orderid, idf }).then(res => {
        console.log(res)
        res.code === 200 && this.back("已成功确认收到衣物，2秒后自动返回")
      }).catch(err => {
        console.error(err)
      })
    } else {
      console.error("参数错误")
    }
    wx.hideLoading()
  },
  // 取消订单
  OrderBack(e) {
    this.setData({
      mask: true
    })
    wx.showLoading({
      title: '正在取消订单',
    })
    let userInfo = wx.getStorageSync('userInfo')
    let order_number = this.data.list.order_number
    let orderid = +this.data.list.id
    let id = userInfo.id // 用户ID
    if (orderid &&  id &&  order_number) {
      userOrderBack({orderid, id, order_number}).then(res => {
          console.log(res)
          res.code === 500 && this.back("配送员已接单，无法取消")
          res.code === 200 && this.back("取消成功,2秒后自动返回")
      }).catch(err => {
        console.error(err)
      })
    } else {
      console.error("参数错误")
    }   
    wx.hideLoading()
  },
  back(title) {
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