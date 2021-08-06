import { GetAgreeAment } from '../../../api/api';
Page({

  data: {
    iconItem: [
      {id: 1, name: '新订单', cls: 'ahh iconxindingdantongzhi'},
      {id: 2, name: '打印中', cls: 'ahh icondayinfuyin'},
      {id: 3, name: '已完成', cls: 'ahh iconyiwancheng'},
      {id: 4, name: '全部订单', cls: 'ahh iconlayer'}
    ],
    Icon: [
      {id:5, name: '我的收益', cls: 'ahh iconwodeshouyi'},
      {id:6, name: '商家协议', cls: 'ahh iconprotocol-audit'},
      {id:7, name: '投诉建议', cls: 'ahh icontousujianyi'},
    ],
    hasUserInfo: false, 
    userInfo: {},
    flag: false
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
    wx.setNavigationBarTitle({
      title: '商家',
    })
    GetAgreeAment({type: 3}).then(res => {
      this.setData({
        nodes: res.data
      })
    }).catch(err => {
      console.error(err)
    })
  },
  changeRouter(e) {
    console.warn(e)
    let state = e.currentTarget.dataset.name
    let id = +e.currentTarget.id
    if ( id < 5 ) {
      wx.navigateTo({
        url: `/dryClean/storePage/storeOrder/storeOrder?ordertype=dy&state=${state}&type=${id}`,
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
  changeFlag() {
    this.setData({
      flag: !this.data.flag
    })
  }
})