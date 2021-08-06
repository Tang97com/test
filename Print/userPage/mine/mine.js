import {
  GetAgreeAment,
} from '../../../api/api';
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
      name: '服务中'
    },
    {
      id: 3,
      cls: 'ahh iconyiwancheng2',
      name: '已完成'
    },
    {
      id: 4,
      cls: 'ahh iconlayer',
      name: '全部订单'
    }
    ],
    Icon: [
      {
        id: 5,
        cls: 'ahh iconwodedizhi',
        name: '我的地址'
      },
      {
        id: 6,
        cls: 'ahh iconxieyiguanli',
        name: '用户协议'
      },
      {
        id: 7,
        cls: 'ahh iconlianxikefu1',
        name: '联系客服'
      }
    ],
    hasUserInfo: false,
    userInfo: {},
    flag: false,
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.avatar && userInfo.gender) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    } 
    wx.setNavigationBarTitle({
      title: '我的',
    })
    this.getArgeent()
  },
  getArgeent() {
    GetAgreeAment({type: 1}).then(res => {
      console.log(res)
      this.setData({
        nodes: res.data,
      })
    })
  },
  changeRouter(e) {
    console.warn(e)
    let state = e.currentTarget.dataset.name
    let id = +e.currentTarget.id
    if ( id < 5 ) {
      wx.navigateTo({
        url: `/dryClean/userPage/userorder/userorder?ordertype=dy&type=${id}&state=${state}`,
      })
    }
    id === 5 && wx.navigateTo({
      url: '/common/address/address',
    })
    id === 6 && this.changeFlag()

    id === 7 && wx.makePhoneCall({
      phoneNumber: 'phoneNumber',
      success: (res) => {
        console.log(res)
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
})