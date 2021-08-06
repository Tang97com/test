import { watchProgress } from '../../../api/api';
Page({
  data: {
    list: [],
    flag: true
  },
  onLoad: function (options) {
    this.getData()
  },
  getData() {
    // 1未接单  2已接单  3清洗中  4配送中  5已完成 
    watchProgress({userid: 1}).then(res => {
      console.log(res)
      if (res.data.data.length == 0) {
        this.setData({
          flag: false
        })
      }
      if ( res.code === 200) {
        res.data.data.map(e => {
          if (+e.type === 1) { e.type = '未接单'}
          if (+e.type === 2 ){ e.type = '已接单'} 
          if (+e.type === 3 ){ e.type = '清洗完成'} 
          if (+e.type === 4 ){ e.type = '配送中'} 
          if (+e.type === 5 ){ e.type = '已完成'} 
        })
        console.log(res.data.data)
        this.setData({
          list: res.data.data
        })
      } 
    })
  },
  sd() {
    this.setData({
      percent: this.data.percent + 25,
      index: this.data.index + 1
    })
  }
})