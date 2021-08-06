import { getSchool } from '../../api/api';
const app = getApp()
Page({
  data: {
    navBarHeight: app.globalData.navBarHeight,
    small: [{
        id: 1,
        url: '/static/img/dryclean.png',
        title: '干洗'
      },
      {
        id: 2,
        url: '/static/img/print.png',
        title: '打印'
      },
      {
        id: 3,
        url: '/static/img/jd.png',
        title: '酒店'
      },
      // {
      //   id: 4,
      //   url: '/static/img/esjy.png',
      //   title: '二手交易'
      // },
      // {
      //   id: 5,
      //   url: '/static/img/ly.png',
      //   title: '旅游交友'
      // },
      // {
      //   id: 6,
      //   url: '/static/img/zf.png',
      //   title: '房屋租赁'
      // },
      // {
      //   id: 7,
      //   url: '/static/img/nc.png',
      //   title: '奶茶'
      // },
      {
        id: 8,
        url: '/static/img/ms.png',
        title: '美食'
      },
      // {
      //   id: 9,
      //   url: '/static/img/kd.png',
      //   title: '快递'
      // },
    ],
    show: false,
    actions: [],
    current_schoolName: '定位中...',
    current_schoolId: 0,
  },
  onLoad: function (options) {
    var that = this
    that.getLocation();
    wx.showLoading({
      title: '定位中...',
      mask: true,
    });
  },
  onShow: function () {
    var that = this;
    setTimeout(() => {
      
    }, 2500);
  },
  getLocation() {
    var that = this;
    wx.getLocation({
      type:'wgs84',
      withSubscriptions: true,
      altitude: true,
      success: (res) => {
        getSchool({ lat: res.latitude, lng: res.longitude }).then( function (res) {
          console.log(res)
          if (res.code === 200) {
            let current_school = { id: res.data[0].id, name: res.data[0].name }
            let HCcurrent_school = wx.getStorageSync('current_school')
            if (!HCcurrent_school) {
              wx.setStorageSync('school', res.data)
              wx.setStorageSync('current_school', current_school)
            }
            that.setData({
              current_schoolId: res.data[0].id,
              current_schoolName: res.data[0].name,
              actions: res.data
            })
            console.log(that.data.actions);
            wx.hideLoading();
          } else return false
        }).catch(err => {
          console.error(err)
        })
        let LatAndLon = []
        LatAndLon.push(res.latitude,res.longitude)
        getApp().globalData.LatAndLon = LatAndLon
      },
      fail: (res) => {
        console.error("用户拒绝授权地址信息", res)
        wx.showToast({
          title: '获取手机定位失败',
          icon: 'none',
          mask: false,
          duration: 2000,
        });
      }
    })
  },
  handClick(e) {
    console.log(e.currentTarget.id)
    let id = +e.currentTarget.id
    console.log(id)
    switch (id) {
      case 1:
        wx.navigateTo({
          url: '/dryClean/index/index',
        })
        break;
      case 2:
        // this.showMsg()
        wx.navigateTo({
          url: '/Print/index/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/hotel/index/index',
        })
        break;
      case 4:
        this.showMsg()
        break;
      case 5:
        this.showMsg()
        break;
      case 6:
        this.showMsg()
        break;
      case 7:
        this.showMsg()
        break;
      case 8:
        wx.navigateTo({
          url: '/Food/pages/index/index'
        })
        break;
      case 9:
          this.showMsg()
          break;  
      default:
        console.error("错误")
        break;
    }
  },
  showMsg() {
    wx.showToast({
      title: '正在开发中...',
      icon: "none",
      duration: 2000
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  onBottomPop() {
    this.setData({ show: true });
  },
  onSelect(event) {
    // console.log(event.detail);
    this.setData({current_schoolName: event.detail.name})
    wx.setStorageSync('school', event.detail)
    wx.setStorageSync('current_school', event.detail)
  },
  onHide: function () {
    let schoolId = wx.getStorageSync('current_school')
    getApp().globalData.current_schoolName = this.data.current_schoolName
    getApp().globalData.current_schoolId = schoolId.id
  }
})