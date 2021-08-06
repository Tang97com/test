import { MarikreceOrder, MarikOrderBack, Marikdelivered, Marikconfirmpick } from '../../../api/api';
Page({
  data: {
    list: [],
    state: 0,
    cancel: '',
    recev: '',
    mask: false,
    code: '',
    pop: false //弹窗
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    console.log(options)
    if (+options.type === 0) {
      this.setData({
        recev: '接单'
      })
    }
    if (+options.type === 1) {
      this.setData({
          // cancel: '取消'
          waitOrder: '待取件'
      })
    } 
     if (+options.type === 2) {
      this.setData({
        cancel: '已送达'
      })
    } 
    let userid = wx.getStorageSync('userInfo').id
    let item = JSON.parse(options.obj)
    console.log(item)
    this.setData({
      list: item,
      state: options.type,
      userid
    })
  },
  // 接单
  getOrder(e) {
    this.setData({
      mask: true
    })
    wx.showLoading({
      title: '正在接单',
    })
    console.log(e.currentTarget.id)
    let orderid = +this.data.list.id
    let id = +this.data.userid  // 用户ID
    if (orderid) {
      MarikreceOrder({orderid, id, idf: 'marik'}).then(res => {
        console.log(res)
        wx.hideLoading()
        res.code === 200 && this.back("接单成功,2秒后自动返回")
      }).catch(err => {
        console.error(err)
      })
    } else {
      wx.hideLoading()
    }
  },
  // 确认取单 配送员
  OrderConfir(e) {
    this.setData({
      mask: true
    })
    wx.showLoading({
      title: '确认收到',
    })
    console.log(e.currentTarget.id)
    let orderid = +this.data.list.id
    let id = +this.data.userid  // 用户ID
    if (orderid) {
      Marikconfirmpick({orderid, id, idf: 'marik'}).then(res => {
        console.log(res)
        wx.hideLoading()
        res.code === 200 && this.back("已成功收到,2秒后自动返回")
      }).catch(err => {
        console.error(err)
      })
    } else {
      console.error("orderid为空", orderid)
      wx.hideLoading()
    }
  },
  // 取消订单
  OrderBack(e) {
    wx.showModal({
      title: '取消订单',
      content: '一天3次不耽责取消，订单超过3次强行取消订单将会进行金额处罚',
      success: (res) => {
        if ( res.confirm ) {
          this.setData({
            mask: true
          })
          wx.showLoading({
            title: '正在取消订单',
          })
          console.log(e.currentTarget.dataset.ordernum)
          let order_number = this.data.list.order_number
          let orderid = +this.data.list.id
          let id = +this.data.userid // 用户ID
          wx.hideLoading()
          if (orderid && order_number) {
            MarikOrderBack({id, orderid, order_number}).then(res => {
              console.warn(res)
              res.code === 200 && this.back("取消成功,2秒后自动返回")
            }).catch(err => {
              console.error(err)
            })
          } else {
            wx.hideLoading()
            return 
          }
        } else if ( res.cancel ) {
          console.warn('配送员点击了取消')
          return false
        }
      }
    })
  },
  // 已送达
  Delivered(e) {
    this.ChangePopState()
  },
  qrcode() {
    let safety_code = this.data.list.safety_code
    let code = this.data.code
    let id = this.data.userid  //用户ID
    let orderid = this.data.list.id
    let order_number = this.data.list.order_number
    console.log(code, safety_code)
    wx.showLoading({
      title: '正在确认...',
    })
    if (safety_code === code ) {
      // 安全码相同 完成接单逻辑
      Marikdelivered({order_number, orderid , id}).then(res => {
        console.log(res) 
        res.code === 200 && this.setData({
          pop: false
        })
        this.back("配送成功,2秒后返回")
      })
    } else {
      wx.showToast({
        title: '安全码错误',
        icon: 'none'
      })
    }
    wx.hideLoading()
  },
  getvalue(e) {
    let val = e.detail.value
    console.log(val)
    this.setData({
      code: val
    })
  },
  ChangePopState() {
    this.setData({
      mask: !this.data.mask,
      pop: !this.data.pop
    })
  },
  celcode() {
    this.ChangePopState()
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