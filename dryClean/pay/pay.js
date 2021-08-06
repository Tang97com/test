import { randomOrder } from '../../utils/Regular';
import { PlaceOrder } from '../../api/api';
Page({
  data: {
    Pop: false, //底部弹窗
    showAdressFlag: true, // 显示地址
    orderTime: '', //订单号
    sendTime: ['11:30~14:00', '17:30~22:00'], // 配送时间
    tindex: 0, //配送时间的计算器
    sendWay: ['送到楼上', '送到楼下'], //配送方式
    windex: 0, //  配送方式的计数器
    tFlag: false,
    wFlag: false,
    flag: false, // 是否加急
    ztflag: false,  // 是否自提
    detal: false,  // 洗衣风险
    content: '用户协议', // 协议内容
    aloneShop: {}, // 店铺信息
    adress: [], //收货地址
    shopNumber: 0, //物品数量
    findOneAdress: [],
    bzxx: '', //备注信息
    fee: 0, //配送费
    total: 0 , // 商品价格
    price: 0 , // 总价
    num: 0,
    org: 0,
    jj: 0, 
    shopid: 0, //商家店铺ID
    Mask: false 
  },
  onShow() {
    let list = wx.getStorageSync('SelectAdress').obj
    console.log(list)
    if ( list === undefined) {
      return 0
    } else {
      this.setData({
        showAdressFlag: false,
        findOneAdress: list
      })
    }
  },
  onLoad: function (options) {
    console.log(options)
    let order = randomOrder()
    let nums = +options.num
    let store = wx.getStorageSync('store')
    let psfs = this.data.sendWay[this.data.windex] === '送到楼上' ? 4.8 : 3.8
    let result = store.find(item => {
      return item.id == options.shopid
    })
    console.log(result)
    let fee = ( nums - 1 )* 2 + psfs
    console.error(fee)
    let price = +options.count + fee
    console.error(price.toFixed(1))
    this.setData({
      shopid: options.shopid,
      adress: wx.getStorageSync('address'),
      orderTime: order,
      aloneShop: result,
      shopNumber: options.num,
      total: options.count,
      org: options.count,
      num: options.num,
      fee,
      price: price.toFixed(1)
    })
  },
  // 事件函数
  agreeDeal() {
    wx.showModal({
      title: '用户协议需知',
      content: this.data.content,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeState(e) {
    this.setData({
      flag: !this.data.flag
    })
    this.calculation({type: 3, count: this.data.total, price: this.data.price, fee: this.data.fee})
  },
  // 洗衣风险
  checkBox() {
    this.setData({
      detal: !this.data.detal
    })
  },
  changeStateZt() {
     this.setData({
       ztflag: !this.data.ztflag
     }) 
    // console.log(this.data.ztflag)
    this.calculation({type: 1, count: this.data.total, price: this.data.price, fee: this.data.fee})
  },
  payMoney() {
    if (!this.data.detal) {
      wx.showToast({
        title: '请同意并阅读洗衣风险通知',
        icon: 'none'
      })
      return 0
    }
    if ( this.data.findOneAdress.length == 0) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none'
      })
      return false
    }
    this.setData({
      Mask: true
    })
    wx.showLoading({
      title: '正在下单',
    })
    if (1) {
      // console.log(this.data.sendWay[this.data.windex])
      // console.log(this.data.sendTime[this.data.tindex])
      // console.log(this.data.flag) //1 false 2 是true
      // let obj1 = this.data.aloneShop
      // console.warn(obj1)
      let obj2 = this.data.findOneAdress
      // console.warn(obj2)
      let zt = this.data.ztflag ? 1 : 2
      let flags = this.data.flag ? 2 : 1  // 是否加急
      console.error("备注信息", this.data.bzxx)
      PlaceOrder({
        order_number: this.data.orderTime,
        userid: this.data.findOneAdress.user_id,
        school_id: this.data.findOneAdress.school_id,
        city_id: this.data.findOneAdress.id,
        remarks: this.data.bzxx,
        delivery_mode: this.data.sendWay[this.data.windex],
        delivery_time: this.data.sendTime[this.data.tindex],
        fee: +this.data.fee,
        shop_id: this.data.aloneShop.id,
        is_urgent: +flags,
        total: +this.data.price,
        num: +this.data.num,
        ordertype: "gx"
      }).then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code === 707) {
          wx.hideLoading()
          wx.requestPayment({
            provider: 'wxpay',
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            paySign: res.data.paySign,
            timeStamp: res.data.timeStamp,
            signType: 'MD5',
            success: (res) => {
              console.log(res)
              if (res.errMsg.indexOf("ok") > 0) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1500
                })
                wx.removeStorageSync('cart')
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../my/my',
                  })
                },1500)
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 3000
                })
              }
            },
            fail: (err) => {
              wx.showToast({
                title: '支付失败',
                icon: 'error',
                duration: 2000
              })
              this.setData({
                Mask: false
              })
              
              console.log('fail:' + JSON.stringify(err));
            }
          })
        }else if (res.code === 200) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../my/my',
            })
          })
          console.warn("成功")
          wx.removeStorageSync('cart')
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '下单失败',
            duration:3000,
            icon: 'none'
          })
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  // 添加地址
  gotoAddress(e) {
    let state = "支付页面"
    wx.navigateTo({
      url: `/common/address/address?state=${state}`,
    })
  },
  // 选择时间
  selectTime(e) {
    console.log(e.currentTarget.id)
    this.setData({
      tindex: e.currentTarget.id,
      tFlag: false
    })
  },
  selectWay(e) {
    console.log(e.currentTarget.id)
    // 楼上-0 4.8 ---  楼下-1 3.8
    let total = +this.data.total
    let psfs = this.data.sendWay[e.currentTarget.id] === '送到楼上' ? 4.8 : 3.8
    let jj =  this.data.flag ? total * 0.5 : 0
    let fee = this.data.ztflag ? 0 + psfs : (+this.data.num - 1) * 2 + psfs
    let price = jj + fee + total 
    // this.calculation({type: 2, count: this.data.total, price: this.data.price, fee: this.data.fee})
    this.setData({
      windex: e.currentTarget.id,
      wFlag: false,
      price,
      fee,
      total,
      jj
    })
  },
  showTime() {
    this.setData({
      tFlag: true
    })
  },
  showWay() {
    this.setData({
      wFlag: true
    })
  },
  getText(e) {
    console.log(e.detail.value)
    this.setData({
      bzxx: e.detail.value
    })
  },
  calculation({count, price, fee,type}) {
    // console.log(count, price, fee, type)
    // count 商品价格， price 打折价格， fee 配送费 
    if ( type === 1 ) {
      // 点击了自提 不需要配送费
      let jj = this.data.flag ? +count * 0.5 : 0
      let total = +count
      let psfs = this.data.ztflag ? 0 : this.data.sendWay[this.data.windex] === '送到楼下' ? 3.8 : 4.8
      let fee = this.data.ztflag ? 0 + psfs : (+this.data.num - 1) * 2 + psfs
      let price = total + jj + fee 
      this.setData({
        total,
        fee,
        jj,
        price: price.toFixed(1)
      })
    }
   

    if (type === 3) {
     console.error(count, price, fee, type)
     let jj =  this.data.flag ? +count * 0.5 : 0
     let psfs = this.data.sendWay[this.data.windex] === '送到楼下' ? 3.8 : 4.8
     let fee = this.data.ztflag ? 0 + psfs : (+this.data.num - 1) * 2 + psfs
     let total = +count
     let price = jj + fee + total 
     this.setData({
       jj,
       fee,
       total,
       price: price.toFixed(1)
     })
    }
  }
})