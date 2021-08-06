import { getMoney } from '../../api/api';
Page({
  data: {
    flag: false,
    currentTab: 0,
    num: 0,
    allData: [],
    idf: '',
    typesOf: '',  
  },
  onShow() {
    let money = wx.getStorageSync('userInfo').balance
    if (money) {
      this.setData({ num: money })
    }
  },
  onLoad: function (options) {
    console.log(options)
    if (options.idf == 'store') {
      wx.setNavigationBarTitle({
        title: '我的收益'
      })
    }else {
      wx.setNavigationBarTitle({
        title: '小金库'
      })
    }
    if (options.idf) {
      this.getMoneyData({type: 1, idf: options.idf})
      this.setData({
        idf: options.idf,
        typesOf: options.typesOf
      })
    } else {
      this.getMoneyData()
    }
  },
  //点击切换
  clickTab (e) {
    console.log(e);
    let type = +e.target.dataset.current+1
    console.log(type)
    let idf = this.data.idf 
    console.log(this.data.currentTab)
    if (this.data.currentTab === e.target.dataset.current) {
      return true;
    } else {
      console.log(type);
      this.getMoneyData({type, idf})
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  TakeMoney() {
    console.log("我啊提现")
    wx.navigateTo({
      url: `../takeMoney/takeMoney?money=${this.data.num}&idf=${this.data.idf}`,
    })
  },
  getMoneyData({type, idf}) {
    wx.showLoading({
      title: '正在加载...',
    })
    type = type || 1,
    idf = idf || 1
    getMoney({type, idf}).then(res => {
      console.log(res)
      wx.hideLoading()
      res.code === 200 && this.setData({
        allData: res.data.data
      })
    })
  }
})