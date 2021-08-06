
import { randomOrder } from '../../utils/Regular';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { PlaceOrder } from "../../api/api";
const app =  getApp();
Page({
  data: {
    room: '1间(每间最多住2人)',
    name: '',
    phone: '',
    time: '16:00',
    flag: false,
    roomtime: false,
    rooMoney: 0,
    orderTime: '', // 订单号
    user_id: '', 
    school_id: '',
    price: '', // 总价
    startdate: '',
    enddate: '',  // 入离时间
    day: 1, // 居住天数
    HotelUserInformation: [],
    RoomId: '', // 酒店id
    error: '',  // 错误提示
    CheckIndate: [], // 预计到店时间
    roomDetail: []
  },
  onLoad: function (options) {
    let arr = []
    for (let i = 14; i <= 18; i++) {
      arr.push(i)
      this.setData({CheckIndate: arr})
    }
    console.log(arr);
    this.setData({
      day: app.globalData.day,
      roomDetail: app.globalData.roomDetail
    })
    console.log(this.data.roomDetail);
    let order = randomOrder()
    this.data.school_id = app.globalData.current_schoolId
    this.setData({
      rooMoney: options.id,
      orderTime: order,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1065df',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.data.roomId = wx.getStorageSync('RoomId')
    let list = wx.getStorageSync('userInfo');
    console.log(list);
    this.setData({
      HotelUserInformation: list
    })
    this.setData({
      startdate: app.globalData.date[0],
      enddate: app.globalData.date[1]
    })
  },
  getCheckIndate(e) {
    let that = this
    let time = e.currentTarget.dataset.date + ':00'
    console.log(e.currentTarget.dataset.date + ':00');
    that.setData({
      time: time,
      roomtime: false
    })
  },
  onShow: function () {
    
  },
  onClose() {
    this.setData({
      flag: !this.data.flag
    })
  },
  changRoom() {
    this.setData({
      roomtime: !this.data.roomtime
    })
  },
  onSubmit() {
    const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    let phone = this.data.phone
    if (this.data.name == '' && phone == '') {
      wx.showToast({
        title: '请输入正确的手机号和名字',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }else if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.setData({phone: ''})
    } else {
      PlaceOrder({
        order_number: this.data.orderTime,
        userid: this.data.HotelUserInformation.id,
        school_id: this.data.school_id,
        shop_id: this.data.roomId,
        total: this.data.rooMoney * this.data.day,
        startdate: this.data.startdate,
        enddate: this.data.enddate,
        day: this.data.day,
        phone: this.data.phone,
        name: this.data.name,
        ordertype: "jd"
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
                    url: '../order/order?type=1&TypesOf=user',
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
  }
})