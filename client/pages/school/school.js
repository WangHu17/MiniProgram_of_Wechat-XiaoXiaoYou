var mydata = require("../mydata/mydata2.js");
Page({
  data:{
    loading:false,
    schoolList:[],
    joined:[
      {
        name:"王虎",
        imgurl:"/images/boram.jpg"
      }
    ]
  },
  activity: function (event) {
    var activityId = event.currentTarget.dataset.activityId
    wx.navigateTo({
      url: '/pages/activity2/activity?activityId=' + activityId
    })
  },
  morebooked:function(e){
    wx.navigateTo({
      url: '/pages/booked/booked?joined=' + JSON.stringify(this.data.joined)
    })
  },

  YKxx:function(e){
    wx.navigateTo({
      url: '/pages/reservation/reservation',
    })
  },
  DYxx:function(e){
    wx.navigateTo({
      url: '/pages/leader/leader',
    })
  },
  onLoad: function (params) {
    var that = this;
    var params_id = params.actId;//得到传过来的actId
    console.log(params_id);
    that.showLoading();
    that.setData({
      params_id:params_id,
     // schoolList:mydata.schoolList
    })
    that._initFav(params_id);
    wx.request({
      url: 'https://7bcznufy.qcloud.la',
      data: '',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          //控制台可看到我传过来params_id，，，然后通过这个ID请求这个ID所对应的数据
          //请求数据，这里我是写到了我的mydata里面
          schoolList: res.data.schoolList,
          joind:res.data.joind
        })
      },
      fail: function(res) {
        require("../template/common.js").noNetWork();
      },
      complete: function(res) {
        that.hideLoading();
      },
    })
  },
  _initFav(params_id) {
    let allKey = wx.getStorageSync('__fav__')
    if (allKey) {
      this.setData({
        favFlag: allKey[params_id]
      })
    } else {
      allKey = {}
      allKey[params_id] = false
      wx.setStorageSync('__fav__', allKey)
    }
  },
  // 收藏开关
  toggleFav() {
    let allKey = wx.getStorageSync('__fav__')
    let thisKey = allKey[this.data.params_id]
    thisKey = !thisKey
    allKey[this.data.params_id] = thisKey
    wx.setStorageSync('__fav__', allKey)
    this.setData({
      favFlag: thisKey
    })
    wx.showToast({
      title: thisKey ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 2000
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/school/school?id=' + this.data.params_id,
      success: function (res) {
        // 转发成功
        // 如果这里有 shareTickets，则说明是分享到群的
        console.log(res.shareTickets)
      },
      fail: function (res) {
        console.log("失败");
        // 转发失败
      }
    }
  },
  showLoading: function () {
    this.setData({
      loading: true
    })
  },
  hideLoading: function () {
    this.setData({
      loading: false
    })
  }
})
