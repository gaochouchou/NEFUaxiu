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
    building: 0,//building值
    classroom: '',//classroom值
    picker: ['丹青楼', '锦绣楼', '成栋楼', '主楼', '交通学院实验中心', '图书馆A区', '图书馆B区', '研究生楼', '动资楼', '理学楼', '文法楼', '文博楼', '工程楼', '逸夫楼']
, //教学楼选择器备选
    imgList: [],//图片
    modalName: null,
    textareaAValue: '',//长文本输入
    time: null,//时间
    modalHidden: true,//是否隐藏对话框
    modalHidden_form: true,//是否隐藏对话框（表单）

    checkinvitecode:'',//正确的注册码暂存

    invitecode:'',//注册码输入
    nickname:'',//姓名输入
    username:'',//用户名输入
    password:'',//密码输入
    passwordagain:''//确认密码输入
  },

  // 邀请码输入
  invitecodeChange(e) {
    this.setData({
      invitecode: e.detail.value
    })
  },

  // 姓名输入

  nicknameChange(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  //用户名输入
  usernameChange(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 密码输入
  passwordChange(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 确认密码
  passwordagainChange(e) {
    this.setData({
      passwordagain: e.detail.value
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

  // model确定取消按钮(表单正确性模态框)
  //确定按钮点击事件
  modalBindaconfirm_form: function () {
    this.setData({
      modalHidden_form: !this.data.odalHidden_form,
    })
  },
  //取消按钮点击事件
  modalBindcancel_form: function () {
    this.setData({
      modalHidden_form: !this.data.odalHidden_form,
    })
  },

  
  // 数据库插入
  submit: function () {
    var _this = this
    console.log(this.data.password)

    if(this.data.invitecode !='' && this.data.nickname !='' &&
    this.data.username!='' && this.data.password !='' ){
      if(this.data.password === this.data.passwordagain){
        if(this.data.checkinvitecode === this.data.invitecode){
          var time = util.formatTime(new Date());
          db.collection('worker').add({
            data:{
              averageaccepttime:0,
              averagefinishtime:0,
              createtime:time.substr(0,10),
              finishorder:0,
              invitecode:this.data.invitecode,
              nickname:this.data.nickname,
              password:this.data.password,
              username:this.data.username
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            });
            wx.redirectTo({
              url: '../repair/passwords',
            })
          })
  
        }
        else{
          wx.showToast({
            title: '注册码错误',
            image: '../../images/error.png'
          });
        }
      }
      else{
        wx.showToast({
          title: '密码输入不一致',
          image: '../../images/error.png'
        });
      }
    }
    else{
      wx.showToast({
        title: '注册信息不完整',
        image: '../../images/error.png'
      });
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    db.collection('invitecode').where({
    }).limit(1).get({
    }).then(res => {
      // console.log(res.data[0])
      this.setData({
        checkinvitecode:res.data[0].invitecode
      })
    })

    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
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