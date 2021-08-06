Page({

  data: {
    imgList: [],
    fileLink: 'www.baidu.com'
  },
  onLoad: function (options) {
    
  },
  addimg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      // success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        // console.warn(res)
        // const tempFilePaths = res.tempFilePaths
        // let obj = { path: { ...tempFilePaths }, num: 1, price: 1, name: '图片.jpg'}
        // console.log(obj)
        // let item = this.data.imgList.concat(obj)
        // this.setData({
        //   imgList: item
        // })
        // // let item = this.data.imgList.concat(tempFilePaths)
        // console.log(item)
      success: res => {
        var successUp = 0; //成功
        var failUp = 0; //失败
        var length = res.tempFilePaths.length; //总数
        var count = 0; //第几张
        this.uploadOneByOne(res.tempFilePaths,successUp,failUp,count,length);
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  printPage() {
    if (!this.data.imgList.length) {
      wx.showToast({
        title: '你还没有上传图片呢',
        icon: 'none'
      })
      return 0
    }
    console.log(this.data.imgList)
    let file = JSON.stringify(this.data.imgList)
    wx.navigateTo({
      url: `../../pay/pay?file=${file}&filelink=${this.data.fileLink}&label=图片批量打印`,
    })
  },
  add(e) {
    console.warn(e.currentTarget.id)
    let item = this.data.imgList
    let index =+e.currentTarget.id 
    if (item[index].num < 99 ) {
      item[index].num++
      this.setData({
        imgList: item
      })
    }
    // console.log(item[index].num)
  },
  jian(e) {
    console.warn(e.currentTarget.id)
    let item = this.data.imgList
    let index =+e.currentTarget.id 
    if (item[index].num === 1) {
      wx.showModal({
        title: '删除图片',
        content: '你确定需要移除图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.data.imgList.splice(index, 1)
            this.setData({
              imgList: this.data.imgList
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      item[index].num--
      this.setData({
        imgList: item
      })
    }
  },
  uploadImg:function(){
    var that = this;
    wx.chooseImage({
        count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                var successUp = 0; //成功
                var failUp = 0; //失败
                var length = res.tempFilePaths.length; //总数
                var count = 0; //第几张
               that.uploadOneByOne(res.tempFilePaths,successUp,failUp,count,length);
            },        
    });
 },
 /**
   * 采用递归的方式上传多张
   */
  uploadOneByOne(imgPaths,successUp, failUp, count, length){
    var that = this;
    wx.showLoading({
       title: '正在上传第'+count+'张',
     })
    wx.uploadFile({
      url: 'https://sa.scyxk.top/api/attachment/upload_file', //仅为示例，非真实的接口地址
      filePath: imgPaths[count],
      name: count,//示例，使用顺序给文件命名
      success:function(e){
        successUp++;//成功+1
      },
      fail:function(e){
        failUp++;//失败+1
      },
      complete:function(e){
        count++;//下一张
        if(count == length){
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: '上传成功' + successUp,
            icon: 'success',
            duration: 2000
          })
        }else{
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          console.log('正在上传第' + count + '张');
        }
      }
    })
  }
})