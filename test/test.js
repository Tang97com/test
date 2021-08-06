Page({
  data: {
    fileList: [],
  },
  onLoad() {

  },
  afterRead(event) {
    const { file } = event.detail;
    console.log(file)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://sa.scyxk.top/api/attachment/upload_file', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success: res => {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
      fail: err => {
        console.error(err)
      }
    });
  },
});