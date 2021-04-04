const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
        title: '我的工单',
        img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
        url: '/repair'
    },
      {
        title: '维修列表',
        img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
        url: '/repair'
      },
      {
        title: '耗材管理',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
        url: '/repair'
      },
      {
        title: '通知查看',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
        url: '/notice'
      }
    ]
  },
  methods: {
    toChild(e) {
      wx.navigateTo({
        url: '/pages/repair' + e.currentTarget.dataset.url
      })
    },
  }
});