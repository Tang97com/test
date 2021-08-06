import { offerAdvice } from '../../api/api';
Page({
  data: {
    name:'',//名字
    tel:'',//电话
    text:'',//内容
    marikStart: 0,
    xcxStart: 0,
  },

  onLoad: function (options) {
     console.log(options)
     this.setData({
       idf: options.idf
     })
  },
  getStart(e) {
    console.warn(e.detail)
    this.setData({
      marikStart: +e.detail
    })
  },
  getStartTwo(e) {
    console.error(e.detail)
    this.setData({
      xcxStart: +e.detail
    })
  },
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '正在提交评论..',
    })
    let obj = e.detail.value
    console.warn(this.data.marikStart || 5 )
    let type = this.data.idf === 'user' ? 1 : 2
    let idf = this.data.idf === 'user' ? 'user' : 'store'
    console.log(this.data.idf)
    if ( obj.name && obj.contact && obj.content ) {
      offerAdvice({
        type,
        idf,
        name: obj.name,
        tel: obj.contact,
        content: obj.content,
        marik_server: this.data.marikStart || 5 ,
        soft_server: this.data.xcxStart || 5,
      }).then(res => {
        wx.hideLoading()
        console.warn(res)
        res.code === 200 && wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          },1500)
        })
      }).catch(err => {
        wx.hideLoading()
        console.error(err)
      })
    } else wx.showToast({
      title: '请填写完信息',
      icon: 'error'
    })
    wx.hideLoading()
  },
})