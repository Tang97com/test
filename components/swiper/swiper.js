// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList: {
      type: Array,
      value: [
        {url: 'https://z3.ax1x.com/2021/04/22/cq4AXD.jpg'},
        {url: 'https://z3.ax1x.com/2021/04/22/cq4Vne.jpg'},
        {url: 'https://z3.ax1x.com/2021/04/22/cq4Z0H.jpg'}
      ]
    }
  },

  data: {
    swiperCurrent: 0, //当前所在页面的 index
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //滑动动画时长1s
    circular: true, //是否采用衔接滑动,
    //点击图片之后跳转的路径
    // links: [
    //   '../user/user',
    //   '../user/user',
    //   '../user/user'
    // ],
  },
  methods: {
    //轮播图的切换事件
    swiperChange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
    //点击指示点切换
    chuangEvent: function (e) {
      this.setData({
        swiperCurrent: e.currentTarget.id
      })
    },
    //点击图片触发事件
    swipclick: function (e) {
      console.log(this.data.swiperCurrent);
      wx.switchTab({
        url: this.data.links[this.data.swiperCurrent]
      })
    }
  }
})