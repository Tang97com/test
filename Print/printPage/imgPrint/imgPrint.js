Page({
  data: {
    num: 1,
    dataimg: '',//图片地址
    fileLink: '', //下载地址
    file: [], // 文件
    distance: 0,//手指移动的距离
    scale: 1,//图片的比例
    baseWidth: null,//图片真实宽度
    baseHeight: null,//图片真实高度
    scaleWidth: '',//图片设显示宽度
    scaleHeight: '',//图片设显示高度

  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      dataimg: options.filepath
    })
  },
  add() {
    this.setData({
      num: this.data.num + 1
    })
  },
  remove() {
    if (this.data.num === 1) {
      wx.showToast({
        title: '最少打印一份',
        icon: 'none'
      })
      return 0
    }

    this.setData({
      num: this.data.num - 1
    })
  },
  imgload: function(e) {
    this.setData({
      'baseWidth': e.detail.width, //获取图片真实宽度
      'baseHeight': e.detail.height, //获取图片真实高度
      'scaleWidth': '100%', //给图片设置宽度
      'scaleHeight': '100%' //给图片设置高度
    })
  },
  touchstartCallback: function(e) {
    // 单手指缩放开始，不做任何处理
    if (e.touches.length == 1) return;
    // 当两根手指放上去的时候，将距离(distance)初始化。
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //计算开始触发两个手指坐标的距离
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'distance': distance,
    })
  },
  touchmoveCallback: function(e) {
    // 单手指缩放不做任何操作
    if (e.touches.length == 1) return;
    //双手指运动 x移动后的坐标和y移动后的坐标
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //双手指运动新的 ditance
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //计算移动的过程中实际移动了多少的距离
    let distanceDiff = distance - this.data.distance;
    let newScale = this.data.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
    if (newScale >= 1) {
      newScale = 1
      let scaleWidth = newScale * this.data.baseWidth + 'px'
      let scaleHeight = newScale * this.data.baseHeight + 'px'
      this.setData({
        'distance': distance,
        'scale': newScale,
        'scaleWidth': scaleWidth,
        'scaleHeight': scaleHeight,
        'diff': distanceDiff
      })
    }
    //为了防止缩放得太小，所以scale需要限制
    if (newScale <= 0.3) {
      newScale = 0.3
      this.setData({
        'distance': distance,
        'scale': newScale,
        'scaleWidth': '100%',
        'scaleHeight': '100%',
        'diff': distanceDiff
      })
    }
  },
  uploadImg() {
    wx.chooseImage({
     count: 5,
     sizeType: ['original', 'compressed'],
     sourceType: ['album', 'camera'],
     success: (res) => {
       // tempFilePath可以作为img标签的src属性显示图片
       console.log(res)
       const path =  res.tempFilePaths
      //  this.data.file.push({path: res.tempFilePaths , num: 1, price: 1, name: '图片.jpg'})
      let item = []
      item.push({path: path[0] , num: 1, price: 1, name: '图片.jpg'})
      console.log(item)
       this.setData({
         dataimg: res.tempFilePaths,
         file: item
       })
       wx.uploadFile({
         url: 'https://sa.scyxk.top/api/attachment/upload_file',
         filePath: path[0],
         name: 'file',
         header: {"Content-Type": "multipart/form-data"},
         success: (res) => {
           console.log(res)
           var data = JSON.parse(res.data);
           console.log(data);
           let fileLink = data.data
           data.cpde === 200 && wx.hideToast(); wx.showToast({
             title: data.msg,
           })
           this.setData({
            fileLink
           })
         },
         fail: (res) => {
           wx.hideToast();
           wx.showModal({
             title: '错误提示',
             content: '上传图片失败',
             showCancel: false,
             success: function (res) { }
           })
         }
       });
     },
     fail: (err) => {
       console.error(err)
     }
    })
  },
  printImage() {
    // console.log(this.data.dataimg)
    // console.log(this.data.file)
    // console.log(this.data.num)
    let list = this.data.file
    list[0].num = this.data.num
    let jsonList = JSON.stringify(list)
    wx.navigateTo({
      url: `../../pay/pay?file=${jsonList}&filelink=${this.data.fileLink}`,
    })
  }
})