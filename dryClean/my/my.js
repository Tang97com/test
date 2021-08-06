import {
  getuserInfo,
  GetAgreeAment,
  getConfig
} from '../../api/api';
Page({
  data: {
    iconItem: [{
        id: 1,
        cls: 'ahh iconjiedan',
        name: '待接单'
      },
      {
        id: 2,
        cls: 'ahh iconfuwu1',
        name: '正在服务'
      },
      {
        id: 3,
        cls: 'ahh iconpingjia',
        name: '已完成'
      },
      {
        id: 4,
        cls: 'ahh iconyiwancheng2',
        name: '全部订单'
      }
    ],
    Icon: [{
        id: 5,
        cls: 'ahh iconchakanjindu',
        name: '洗衣进度'
      },
      {
        id: 6,
        cls: 'ahh iconwodedizhi',
        name: '我的地址'
      },
      {
        id: 7,
        cls: 'ahh iconxieyiguanli',
        name: '用户协议'
      },
      {
        id: 8,
        cls: 'ahh icontousujianyi',
        name: '投诉建议'
      }
    ],
    hasUserInfo: false,
    userInfo: {}
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.avatar && userInfo.nickname && userInfo.gender) {
      // 已经授权登陆了
      this.setData({
        userInfo,
        hasUserInfo: true,
      })
    }
    this.getArgeent()
    wx.setNavigationBarTitle({
      title: '我的',
    })
  },
  getArgeent() {
    Promise.all([getConfig(), GetAgreeAment({type: 1})]).then(res => {
      console.log(res)
      this.setData({
        nodes: res[1].data,
        phone: res[0].data.telephone,
        service_time: res[0].data.service_time
      })
    })
  },
  changeRouter(e) {
    console.log(e.currentTarget.id)
    let type = +e.currentTarget.id
    let state = e.currentTarget.dataset.name
    if (type < 5) {
      // console.log()
      wx.navigateTo({
        url: `../userPage/userorder/userorder?type=${type}&state=${state}&ordertype=gx`,
      })
      return true
    }
    switch (type) {
      case 5:
        wx.navigateTo({
          url: '../userPage/progress/progress',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/common/address/address?user=user',
        })
        break;
      case 7:
        this.changeFlag()
        break;
      case 8:
        wx.navigateTo({
          url: '/common/advice/advice?idf=user',
        })
        break
      default:
        console.error("No Match ID")
        break;
    }
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
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
  },
  phone() {
    let tel = this.data.phone
    wx.makePhoneCall({
      phoneNumber: tel,
      success: (res) => {
         console.warn(res)
      },
      fail: res => {
        console.error(res)
      }
    })
  }
})