
import { ImgUpload } from '../../utils/imgUpload';
Page({
  data: {
    imgurl: ''
  },

  onLoad: function (options) {

  },
  uploadImg() {
     wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        // url: 'https://mini.scyxk.top/api/attachment/upload',
        const file = res.tempFilePaths
        let imgurl =  ImgUpload(file)
        console.log(imgurl)
        this.setData({
          imgurl: ImgUpload(file)
        })
        // wx.uploadFile({
        //   url: 'https://mini.scyxk.top/api/attachment/upload',
        //   filePath: file[0],
        //   name: 'file',
        //   header: {"Content-Type": "multipart/form-data"},
        //   success: (res) => {
        //     console.log(res)
        //     var data = JSON.parse(res.data);
        //     console.log(data);
        //     data.msg === '成功' && wx.hideToast(); wx.showToast({
        //       title: data.msg,
        //     })
        //     this.setData({
        //        imgurl: data.data.url 
        //     })
        //   },
        //   fail: (res) => {
        //     wx.hideToast();
        //     wx.showModal({
        //       title: '错误提示',
        //       content: '上传图片失败',
        //       showCancel: false,
        //       success: function (res) { }
        //     })
        //   }
        // });
      },
      fail: (err) => {
        console.error(err)
      }
     })
  }
})