import { getuserInfo, getConfig } from '../../api/api';
Page({
  data: {
    iconItem: [{
        id: 1,
        name: '功能',
        cls: 'ahh icongongneng'
      },
      {
        id: 2,
        name: '产品',
        cls: 'ahh iconchanpin'
      },
      {
        id: 3,
        name: '关于我们',
        cls: 'ahh iconguanyuwomen'
      },
    ],
    icon: [
      {
        id: 4,
        name: '联系客服',
        cls: 'ahh iconfuwupingjia-kefu'
      },{
        id: 5,
        name: '我的地址',
        cls: 'ahh iconwodedizhi'
      },
      {
        id: 6,
        name: '投诉与建议',
        cls: 'ahh iconprotocol-audit'
      }
    ],
    userInfo: {},
    hasUserInfo: false,
    service_time: '',
    telephone: ''
  },
  onLoad: function (options) {
     let userInfo = wx.getStorageSync('userInfo')
     if (userInfo.avatar && userInfo.nickname && userInfo.gender) {
       // 已经授权登陆了
       this.setData({
        userInfo,
        hasUserInfo: true,
       })
     } 
     getConfig().then(res => {
       console.log(res)
       this.setData({
        telephone: res.data.telephone,
        service_time: res.data.service_time
       })
     }).catch(err => {
       console.error(err)
     })
  },
  changeRouter(e) {
    console.log(e.currentTarget.id)
    let id = +e.currentTarget.id 
    if (id < 4) {
      wx.showToast({
        title: '功能板块正在开发中...',
        icon: 'none',
        duration: 2000
      })
      return
    }
    switch (id) {
      case 1:
        wx.navigateTo({
          url: 'url',
        })
        break;
      case 3:
          wx.navigateTo({
            url: 'url',
          })
          break;
      case 4:
        wx.makePhoneCall({
          phoneNumber: "19180956229",
          success: (res) => {
            console.log(res)
          },
          fail: (err) => {
            console.log(err)
          }
        })
        break;    
      case 5:
        wx.navigateTo({
          url: '/common/address/address',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/common/advice/advice',
        })
        break;      
      default:
        console.error("没有符合的ID")
        break;
    }
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo.gender && userInfo.nickname && userInfo.avatar) {
          // 已存在不需要插入
          return true
        } else {
          let nickname = res.userInfo.nickName
          let avatar = res.userInfo.avatarUrl
          let gender = res.userInfo.gender
          getuserInfo({nickname, avatar, gender}).then(res => {
            console.log(res)
            if (res.code === 200) {
              wx.setStorageSync('userInfo', res.data)
              this.setData({
                userInfo: res.data,
                hasUserInfo: true
              })
            }
          })
        }
      }
    })
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephone,
      success: (res) => {
        console.log(res)
      }, 
      fail: (err) => {
        console.error(err)
      }
    })
  }
})