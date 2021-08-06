const ImgUpload = file => {
  wx.uploadFile({
    url: 'https://mini.scyxk.top/api/attachment/upload',
    filePath: file[0],
    name: 'file',
    header: {"Content-Type": "multipart/form-data"},
    success: (res) => {
      var data = JSON.parse(res.data);
      console.log(data);
      let imgUrl = data.data.url
      console.log(imgUrl);
      return imgUrl
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
}


module.exports = {
  ImgUpload
}