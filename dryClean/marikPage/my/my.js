import { getuserInfo,GetAgreeAment } from '../../../api/api';
Page({
  data: {
    iconItem: [
      { id: 1,name: '待取件',cls: 'ahh iconxindingdantongzhi' },
      { id: 2,name: '待送件',cls: 'ahh iconchuansongwenjianjia'},
      { id: 3,name: '已完成', cls: 'ahh iconyiwancheng' },
      { id: 4,name: '全部订单',cls: 'ahh iconquanbudingdan'}
    ],
    Icon : [
      { id: 5,name: '我的收益',cls: 'ahh iconwodeshouyi'},
      { id: 6, name: '订单通知', cls: 'ahh iconquanbudingdan'},
      {id: 7,name: '配送协议',cls: 'ahh iconprotocol-audit'},
      { id: 8,name: '联系客服',cls: 'ahh iconlianxikefu'}
      ],
      flag: true,
      hasUserInfo: false,
      userInfo: {},
      popflag: false
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (options.ordertype === 'dy') {
      // 打印的小程序
      //待配送  服务中 已完成 全部订单
      let iconItem = this.data.iconItem
      iconItem[0].name = '待配送'
      iconItem[1].name = '服务中'
      iconItem[2].name = '已完成'
      iconItem[3].name = '全部订单'
      this.setData({
        ordertype: options.ordertype,
        iconItem
      })
    }
    this.setData({
      ordertype: options.ordertype,
    })
    if (userInfo.avatar && userInfo.nickname && userInfo.gender) {
      // 已经授权登陆了
      this.setData({
        userInfo,
        hasUserInfo: true,
      })
    }
    this.getArgeent()
  },
  changeRouter(e) {
    console.log(e.currentTarget.id)
    let id = +e.currentTarget.id
    if (id < 5) {
      let state = this.data.iconItem[id-1].name
      console.log(state)
      wx.navigateTo({
        url: `../order/order?type=${id}&state=${state}&ordertype=${this.data.ordertype}`,
      })
      return
    }
    switch (id) {
      case 5:
        wx.navigateTo({
          url: '/common/myIncome/myIncome?idf=marik',
        })
        break;
      case 6:
        this.setData({
          flag: !this.data.flag
        })
        let title =  this.data.flag ? '已开启' : '已关闭'
        wx.showToast({
          title: title,
          Icon: 'none'
        })
        break;
      case 7:
          this.changeFlag()
          break;
      case 8:
          wx.makePhoneCall({
            phoneNumber: '191123123',
            success: (res) => {
              console.warn(res.errMsg)
            },
            fail: (err) => {
              console.warn(err.errMsg)
            }
          })
          break;     
      default:
        console.error("错误ID")
        break;
    }
  },
  senderHall() {
    wx.redirectTo({
      url: '../../marik/marik',
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let nickname = res.userInfo.nickName
        let avatar = res.userInfo.avatarUrl
        let gender = res.userInfo.gender
        getuserInfo({
          nickname,
          avatar,
          gender
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            wx.setStorageSync('userInfo', res.data)
            this.setData({
              userInfo: res.data,
              hasUserInfo: true
            })
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  getArgeent() {
    GetAgreeAment({type: 2}).then(res => {
      // console.log(res)
      this.setData({
        nodes: res.data
      })
    })
  },
  changeFlag() {
    this.setData({
      popflag: !this.data.popflag
    })
  }
})