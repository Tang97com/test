import { printStore } from '../../api/api';
Page({
  data: {
    list: [{
        id: 1,
        title: '打印店选择',
        cls: 'ahh iconshangjiaruzhu'
      },
      {
        id: 2,
        title: '文件打印',
        cls: 'ahh iconwenjian'
      },
      {
        id: 3,
        title: '照片打印',
        cls: 'ahh iconzhaopian'
      },
      {
        id: 4,
        title: '证件照打印',
        cls: 'ahh  iconzhengjian'
      },
      {
        id: 5,
        title: '图片批量打印',
        cls: 'ahh icondayinfuyin'
      },
      // {
      //   id: 6,
      //   title: '批量打印',
      //   cls: 'ahh iconwendang'
      // }
    ],
    marikidf: false,
    storeidf: false,
    show: false,
    actions: [
      {
        name: '打印店铺A',
      },
      {
        name: '打印店铺B',
      },
      {
        name: '打印店铺C',
      },
    ],
    imgList: [
      {id: 1, url: 'https://sa.scyxk.top/banner/dy.jpg'},
      {id: 2, url: 'https://sa.scyxk.top/banner/dy2.jpg'},
      {id: 3, url: 'https://sa.scyxk.top/banner/dy3.jpg'},
    ]
  },
  onLoad: function (options) {
    let school_id = wx.getStorageSync('current_school').id
    this.idfCheck()
    printStore({shop_type: 'dy', school_id}).then(res => {
      if (res.code === 200) {
        wx.setStorageSync('current_store', res.data[0])
        this.setData({
          actions: res.data
        })
      }
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  },
  JumpPage(e) {
    console.warn(e)
    let id = +e.currentTarget.id
    id === 1 && wx.navigateTo({
      url: '../userPage/mine/mine',
    })
    if (id === 2) {
      if (this.data.storeidf) {
        wx.navigateTo({
          url: '../storePage/mine/mine',
        })
      } else {
        wx.navigateTo({
          url: '/dryClean/storePage/storeRegister/storeRegister?&xcx=dy',
        })
      }
    }
    if (id === 3) {
      if (this.data.marikidf) {
        wx.navigateTo({
          url: '/dryClean/marik/marik?ordertype=dy',
        })
      } else {
        wx.navigateTo({
          url: '/common/marikRegeist/marikRegeist',
        })
      }
    }
  },
  changeServer(e) {
    console.log(e.currentTarget.id)
    let id = +e.currentTarget.id
    switch (id) {
      case 1:
        this.setData({
          show: true
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../printPage/plCopy/plCopy?state=文件打印',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../printPage/imgPrint/imgPrint',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../printPage/idCardPrint/idCardPrint',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '../printPage/imgPlprint/imgPlprint',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '../printPage/plCopy/plCopy',
        })
        break;
      default:
        break;
    }
  },
  onClose() {
    this.setData({ show: false });
  },
  onSelect(event) {
    console.log(event.detail);
    let list = this.data.list
    list[0].title = event.detail.name
    this.setData({
      list
    })
  },
  idfCheck() {
    let userInfo = wx.getStorageSync('userInfo')
    let storeidf = userInfo.idf === 'store' ? true : false
    let marikidf = userInfo.idf === 'marik' ? true : false

    this.setData({
      marikidf,
      storeidf
    })
  }
})