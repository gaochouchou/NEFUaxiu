// miniprogram/pages/homePage/detailed/test1.js
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const cont = db.collection('repair')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioValue: 'feedback',//单选框
    index: 0,//picker数组下角标
    classroom: '',//classroom值
    picker: ['丹青楼', '锦绣楼', '成栋楼', '主楼', '交通学院实验中心', '图书馆A区', '图书馆B区', '研究生楼', '动资楼', '理学楼', '文法楼', '文博楼', '工程楼', '逸夫楼']
, //教学楼选择器备选
    imgList: [],//图片
    modalName: null,
    textareaAValue: '',//长文本输入
    time: null,//时间
    modalHidden: true,//是否隐藏对话框
    modalHidden_form: true,//是否隐藏对话框（表单）

    date: '',//待查询日期，picker中日期类型为yyyy-MM-dd，后续使用时需要替换
  },

  // 工程师选择器
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  // 查询日期选择器
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 单选按钮
  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      radioValue: e.detail.value
    })
  },
  // 选择器函数
  PickerChange(e) {
    // console.log('Picker发生change事件，携带value值为：', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  //单文本框输入
  classRoomChange(e) {
    // console.log('class发生change事件，携带value值为：', e.detail.value);
    this.setData({
      classroom: e.detail.value
    })
  },

  // model确定取消按钮（上传图片model框）
  //确定按钮点击事件
  modalBindaconfirm: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
    this.ChooseImage();
  },
  //取消按钮点击事件
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },

  // 查询工单
  startsearch(){
    var date = this.data.date.replace(/-/g,'/')
    var func = this.data.radioValue
    var bulidingindex = this.data.index
    var classroom  = this.data.classroom
    var url = '/pages/admin/orders-search?date='+date
    +'&func='+func+'&building='+this.data.picker[bulidingindex]+'&classroom='+classroom
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },

  
  // 数据库插入
  submit: function () {
    if(this.data.classroom=='' || this.data.textareaAValue==''){
      // // toast提示
      wx.showToast({
        title: '报修信息不完整',
        image: '../../images/error.png'
      });
      // 模态框提示(暂不可用，未知)
      // _this.setData({
      //   modalHidden_form: !this.data.odalHidden_form,
      // })
    }
    else{
      const tempFilePaths = this.data.imgList
      wx.showToast({
        title: '上传中',
        icon: 'loading'
      });
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime() + '.png',
        filePath: tempFilePaths[0], // 文件路径
        success: res => {
          // get resource ID
          console.log("图片上传成功" + res.fileID)
          db.collection('repair').add({
            data: {
              func:this.data.radioValue,//单选框值：报修/建议
              building: this.data.picker[this.data.index],//选择教学楼
              classroom: this.data.classroom,//选择教室号
              textareaAValue: this.data.textareaAValue,//详细问题
              fileID: res.fileID,//图片的fileId
              time: this.data.time,//同步提交反馈时间
              description: '提交成功，等待处理。',//当前处理进度
              workerID1:null,//第一次接单修理员工openID
              workerID2:null,//第二次接单修理员工openID
              isAccept:0,//是否接单标记符，0为未接单，1为接单
              isRepair:0,//是为已完成修理标记符，0为未完成修理，1未完成修理
              isDouble:0,//是否被退单标记符，0为被退单，1为二次接单
              acceptTime1:null,//接单时间
              acceptTime2:null,//接单时间
              finishTime:null,//完成订单时间
              urgeOrder:0,//催派订单标识符
              abOrder:0//异常订单标识符
              
              
            }
          }).then(res => {
            console.log(res);
            wx.showToast({
              title: '新增记录成功',
              icon: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err);
            wx.showToast({
              title: '上传失败',
              image: '../../images/error.png'
            });

          })
          wx.switchTab({
            url: '../process/process',
            fail: function () {
              console.info("跳转失败")
            }
          });
        },

        fail: err => {
          // handle error
          // this.setData({
          //   modalHidden: !this.data.modalHidden
          // })
          wx.showToast({
            title: '请上传图片',
            image: '../../images/error.png'
          });
        }
      })
    }

  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // db.collection('worker').get().then(res => {
    //   console.log(res.data)
    //   var workerlist =['全部']
    //   for(let i=0,i<res.data.length,i++){
        
    //   }
    //   this.setData({
    //     picker:res.data
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time,
      date:time.substr(0,10).replace(/\//g,'-')//前端日期显示格式为yyyy-mm-dd，为保证格式统一，暂做替换
    });
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