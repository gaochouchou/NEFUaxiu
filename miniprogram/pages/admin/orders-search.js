// miniprogram/pages/admin/orders-search.js
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    func:'',
    buliding:'',
    classroom:'',
    repairlist:[],
  },

   // 点击显示图片
   imgPreview(e){
    var src = e.currentTarget.dataset.imgsrc;//获取data-src
    var imgList = [e.currentTarget.dataset.imgsrc];//获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 催单
  pressOrder(e){
    var orderid  = e.currentTarget.dataset.orderid
    console.log(orderid)
    db.collection('repair').doc(orderid).update({
      data:{
        urgeOrder:1
      }
    }).then(res => {
      console.log('催单已完成',res),
      wx.showToast({
        title: '已催单',
        icon: 'success',
        duration: 2000
      });
      this.onPullDownRefresh();
    })
  },

  // 完成工单
  finishOrder(e){
    var Orderid = e.currentTarget.dataset.orderid
    var time = util.formatTime(new Date());
    console.log(Orderid)
    db.collection('repair').doc(Orderid).update({
      data:{
        isRepair:1,
        description: '维修已完成，感谢您的反馈',
        finishTime:time
      }
    }).then(res => {
      console.log('工单已完成',res),
      wx.showToast({
        title: '维修已完成',
        icon: 'success',
        duration: 2000
      });
      this.onPullDownRefresh()
    })
  },

  // 退单（二次接单）
  backOrder(e){
    var Orderid = e.currentTarget.dataset.orderid
    var time = util.formatTime(new Date());
    console.log(Orderid)
    db.collection('repair').doc(Orderid).update({
      data:{
        isDouble:1,
        isAccept:0,
        description: '工单已被退回，等待其他工程师处理',
      }
    }).then(res => {
      console.log('工单已退回',res),
      wx.showToast({
        title: '工单已退回',
        icon: 'success',
        duration: 2000
      });
      this.onPullDownRefresh();
    })
  },

  // 删除工单
  deleteOrder(e){
    var Orderid = e.currentTarget.dataset.orderid
    var time = util.formatTime(new Date());
    console.log(Orderid)
    db.collection('repair').doc(Orderid).remove({}).then(res => {
      console.log('工单已删除',res),
      wx.showToast({
        title: '工单已删除',
        icon: 'success',
        duration: 2000
      });
      this.onPullDownRefresh();
    })
  },


  // 前端显示数据文本优化
  display(){
    var olist = this.data.repairlist
    // console.log('List:',this.data.list)
    for(let i=0;i<olist.length;++i){
      // console.log(olist[i])
      if(olist[i].func == 'feedback'){
        olist[i].func = '损坏保修'
      }
      else{
        olist[i].func = '建设建议'
      }

      if(olist[i].isDouble == 1){
        olist[i].isDouble = '此工单为二次转派'
      }
      else{
        olist[i].isDouble = '否'
      }

      if(olist[i].urgeOrder == 1){
        olist[i].urgeOrder = '师生已催单，请尽快处理'
      }
      else{
        olist[i].urgeOrder = '否'
      }

      if(olist[i].abOrder == '1'){
        olist[i].abOrder = '异常工单'
      }
      else{
        olist[i].abOrder = '工单正常'
      }
    }
    this.setData({
      list:olist
    })
  },

  // 下拉刷新加载
  againOnload(){
    // 按照查询时间进行数据库提取数据，本地进行过滤
    db.collection('repair').where(_.and([
      {time:db.RegExp({
        regexp:'.*' + this.data.date,
        options:'i'
      })}
    ])).get().then(res => {
      var againlist = res.data//临时存放数据库提取的数组
      var againrepairlist = []//过滤后的数组
      // 本地过滤
      if(this.data.classroom == ''){
        for(let i=0;i<againlist.length;i++){
          if(againlist[i].func === this.data.func  &&
            againlist[i].building === this.data.buliding
             ){
              againrepairlist.push(againlist[i])
             }
        }
        this.setData({
          repairlist:againrepairlist
        })
        this.display()
      }
      else{
        for(let i=0;i<againlist.length;i++){
          if(againlist[i].func === this.data.func  &&
            againlist[i].building === this.data.buliding &&
            againlist[i].classroom.match(this.data.classroom)>0 
             ){
              againrepairlist.push(againlist[i])
             }
        }
        this.setData({
          repairlist:againrepairlist
        })
        this.display()
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      date:options.date,
      func:options.func,
      buliding:options.building,
      classroom:options.classroom
    })
    // 按照查询时间进行数据库提取数据，本地进行过滤
    db.collection('repair').where(_.and([
      {time:db.RegExp({
        regexp:'.*' + options.date,
        options:'i'
      })}
    ])).get().then(res => {
      // console.log(res.data)
      var list = res.data//临时存放数据库提取的数组
      var repairlist = []//过滤后的数组
      // 本地过滤
      if(options.classroom == ''){
        for(let i=0;i<list.length;i++){
        console.log(list[i])
        if(list[i].func === options.func  &&
          list[i].building=== options.building
           ){
             repairlist.push(list[i])
           }
        }
        // console.log('循环结束11111：',repairlist)
        this.setData({
          repairlist:repairlist
        })
        this.display()
      }
      else{
        for(let i=0;i<list.length;i++){
          console.log(list[i])
          if(list[i].func === options.func  &&
            list[i].building=== options.building &&
            list[i].classroom.match(options.classroom)>0 
             ){
               repairlist.push(list[i])
             }
          }
          console.log('循环结束：',repairlist)
          this.setData({
            repairlist:repairlist
          })
          this.display()
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.showdata() ;
    this.againOnload();
    wx.stopPullDownRefresh();
    console.log('停止数据加载');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})