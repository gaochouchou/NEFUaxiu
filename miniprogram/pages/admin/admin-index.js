import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command

function setOption(chart,week,createlist,acceptlist,finishlist) {
  var option = {
    title: {
      text: '系统工单处理情况',
      left: 'center'
    },
    color: ["#f37b1d", "#0081ff", "#1cbbb4"],
    legend: {
      data: ['新建', '接单', '完成'],
      top: 25,
      left: 'center',
      // backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: week,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '新建',
      type: 'line',
      smooth: true,
      data: createlist
    }, {
      name: '接单',
      type: 'line',
      smooth: true,
      data: acceptlist
    }, {
      name: '完成',
      type: 'line',
      smooth: true,
      data: finishlist
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    ec: {
      lazyLoad: true
      // onInit: initChart
    },
    elements: [{
        title: '人资管理',
        name: 'human',
        color: 'orange',
        icon: 'myfill'
      },
      {
        title: '工单管理',
        name: 'orders',
        color: 'blue',
        icon: 'newsfill'
      },
      {
        title: '耗材管理',
        name: 'Material',
        color: 'purple',
        icon: 'tagfill'
      },
      {
        title: '通知管理',
        name: 'notice',
        color: 'cyan',
        icon: 'copy'
      },
    ],
  },

  // 调用数据库，准备图表中的数据
  getOneOption:function(){

    // 该方法将返回两个值，PastlistZh用于数轴显示，Pastlist用于统计使用
    var past = util.formatPastWeekDate(new Date());
    // console.log('PastlistZh:',past.PastlistZh)
    // console.log('Pastlist:',past.Pastlist)

    // 统计(正则表达式+or并列使用)
    db.collection('repair').where(_.or([{
      time: db.RegExp({
        regexp: '.*' + past.Pastlist[0],
        options: 'i',
      })
    },
    {
      time: db.RegExp({
        regexp: '.*' + past.Pastlist[1],
        options: 'i',
      })
    },
    {
      time: db.RegExp({
        regexp: '.*' + past.Pastlist[2],
        options: 'i',
      })
    },
    {
      time: db.RegExp({
        regexp: '.*' + past.Pastlist[3],
        options: 'i',
      })
    },
    {
      time: db.RegExp({
        regexp: '.*' + past.Pastlist[4],
        options: 'i',
      })
    },
    {
      acceptTime1: db.RegExp({
        regexp: '.*' + past.Pastlist[0],
        options: 'i',
      })
    },
    {
      acceptTime1: db.RegExp({
        regexp: '.*' + past.Pastlist[1],
        options: 'i',
      })
    },
    {
      acceptTime1: db.RegExp({
        regexp: '.*' + past.Pastlist[2],
        options: 'i',
      })
    },
    {
      acceptTime1: db.RegExp({
        regexp: '.*' + past.Pastlist[3],
        options: 'i',
      })
    },
    {
      acceptTime1: db.RegExp({
        regexp: '.*' + past.Pastlist[4],
        options: 'i',
      })
    },
    {
      finishTime: db.RegExp({
        regexp: '.*' + past.Pastlist[0],
        options: 'i',
      })
    },
    {
      finishTime: db.RegExp({
        regexp: '.*' + past.Pastlist[1],
        options: 'i',
      })
    },
    {
      finishTime: db.RegExp({
        regexp: '.*' + past.Pastlist[2],
        options: 'i',
      })
    },
    {
      finishTime: db.RegExp({
        regexp: '.*' + past.Pastlist[3],
        options: 'i',
      })
    },
    {
      finishTime: db.RegExp({
        regexp: '.*' + past.Pastlist[4],
        options: 'i',
      })
    },
  ])).get({
    success: res => {
      console.log('模糊搜索（统一提取数据）:',res.data)
      var orderlist = res.data
      // 初始化数据
      var createlist = [0,0,0,0,0]
      var acceptlist = [0,0,0,0,0]
      var finishlist = [0,0,0,0,0]

      // 对查到的数据进行记数统计
      for(let i=0;i<orderlist.length;i++){
        for(let j=0;j<past.Pastlist.length;j++){
          if(orderlist[i].time.search(past.Pastlist[j])!=-1){
            createlist[j]++
          }
          if(orderlist[i].acceptTime1.search(past.Pastlist[j])!=-1){
            acceptlist[j]++
          }
          if(orderlist[i].finishTime.search(past.Pastlist[j])!=-1){
            finishlist[j]++
          }
        }    
      }

      console.log('createlist:',createlist)
      console.log('acceptlist:',acceptlist)
      console.log('finishlist:',finishlist)
      this.init_one(past.PastlistZh,createlist,acceptlist,finishlist);
    },
    fail: err => {
      console.log(err)
    }
  })

  
    // this.init_one(past.PastlistZh,createlist,acceptlist,finishlist);
  },

  // 初始化图表,绘制图像
  init_one: function (PastlistZh,createlist,acceptlist,finishlist) {           //初始化第一个图表
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
    
      setOption(chart,PastlistZh,createlist,acceptlist,finishlist)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // 获取元素-初始化数据
    this.oneComponent = this.selectComponent('#mychart-dom-line');
    this.getOneOption();
  },


  onReady() {
  }
});
