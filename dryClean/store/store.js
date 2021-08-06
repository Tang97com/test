import { getuserInfo,GetAgreeAment } from '../../api/api';
Page({
  data: {
    iconItem: [
      {id: 1, name: '新订单', cls: 'ahh iconxindingdantongzhi'},
      {id: 2, name: '清洗中', cls: 'ahh iconqingxi'},
      {id: 3, name: '已完成', cls: 'ahh iconyiwancheng'},
      {id: 4, name: '全部订单', cls: 'ahh iconquanbudingdan'}
    ],
    Icon: [
      {id:5, name: '我的收益', cls: 'ahh iconwodeshouyi'},
      {id:6, name: '商家协议', cls: 'ahh iconprotocol-audit'},
      {id:7, name: '投诉建议', cls: 'ahh icontousujianyi'},
    ],
    flag: false,
    hasUserInfo: false,
    userInfo: {}
  },

  onLoad: function (options) {
    this.getArgeent()
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.avatar && userInfo.nickname && userInfo.gender) {
      // 已经授权登陆了
      this.setData({
        userInfo,
        hasUserInfo: true,
      })
    }
  },
  changeRouter(e) {
    let id = +e.currentTarget.id
    let state = e.currentTarget.dataset.name
    console.info(id,state)
    if (id < 5) {
      wx.navigateTo({
        url: `../storePage/storeOrder/storeOrder?state=${state}&type=${id}`,
      })
    }
    
    id === 5 && wx.navigateTo({
      url: '/common/myIncome/myIncome?idf=store',
    })
    id === 6 && this.changeFlag()
    id === 7 && wx.navigateTo({
      url: '/common/advice/advice',
    })
  },
  getArgeent() {
    GetAgreeAment({type: 3}).then(res => {
      // console.log(res)
      this.setData({
        nodes: res.data
      })
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
  changeFlag() {
    this.setData({
      flag: !this.data.flag
    })
  }
})