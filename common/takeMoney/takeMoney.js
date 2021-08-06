import {
  Reg
} from '../../utils/Regular';
import {
  Withdrawal
} from '../../api/api';
Page({
  data: {
    num: 0,
    takeNum: 0,
    Mask: false,
    idf: '',
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      num: options.money,
      idf: options.idf
    })
    wx.setNavigationBarTitle({
      title: '佣金提现'
    })
  },
  getMoneyNumber(e) {
    console.warn(e.detail.value)
    this.setData({
      takeNum: e.detail.value
    })
  },
  getMoney() {
    if (this.data.idf === 'store') {
      // console.log("点击了提现")
      let userInfo = wx.getStorageSync('userInfo')
      let num = this.data.takeNum
      if (!num || num > this.data.num) {
        wx.showToast({
          title: '金额不能为空,且提现金额不能大于余额',
          // icon: 'error'
          icon: 'none'
        })
        return false
      }
      let numReg = Reg(1)
      if (numReg.test(num)) {
        this.setData({
          Mask: true
        })
        wx.showLoading({
          title: '正在提现...',
        })
        // console.warn("可以提现")
        userInfo.balance = this.data.num - num
        console.error(userInfo.balance)
        wx.setStorageSync('userInfo', userInfo)
        Withdrawal({
          money: num
        }).then(res => {
          console.warn(res)
          res.code === 200 && wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000)
        }).catch(err => {
          console.error(err)
        })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '金额输入错误',
          icon: 'error'
        })
      }
    } else {
      let userInfo = wx.getStorageSync('userInfo')
      let num = this.data.takeNum
      if (!num || num < 50) {
        wx.showToast({
          title: '提现金额不能小于50',
          // icon: 'error'
          icon: 'none'
        })
        return false
      }
      let numReg = Reg(1)
      if (numReg.test(num)) {
        this.setData({
          Mask: true
        })
        wx.showLoading({
          title: '正在提现...',
        })
        // console.warn("可以提现")
        userInfo.balance = this.data.num - num
        console.error(userInfo.balance)
        wx.setStorageSync('userInfo', userInfo)
        Withdrawal({
          money: num
        }).then(res => {
          console.warn(res)
          res.code === 200 && wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000)
        }).catch(err => {
          console.error(err)
        })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '金额输入错误',
          icon: 'error'
        })
      }
    }
  }
})