Page({
  data:{
    loading:false,
    activityList : [
      {
        activity_picture: "/images/2.jpg",
        activity_name: "荷花池",
        activity_ins: "A",
        activity_time: "1",
        activity_place: "1",
        id:0
      },
      {
        activity_picture: "/images/5.jpg",
        activity_name: "快活林",
        activity_ins: "B",
        activity_time: "2",
        activity_place: "2",
        id: 1
      },
      {
        activity_picture: "/images/3.gif",
        activity_name: "体育馆",
        activity_ins: "C",
        activity_time: "3",
        activity_place: "3",
        id: 2
      },
      {
        activity_picture: "/images/4.jpg",
        activity_name: "博物馆",
        activity_ins: "D",
        activity_time: "4",
        activity_place: "4",
        id: 3
      },
      {
        activity_picture: "/images/11.jpg",
        activity_name: "芳香美学与化妆基础",
        activity_ins: "E",
        activity_time: "5",
        activity_place: "5",
        id: 4
      },
      {
        activity_picture: "/images/12.jpg",
        activity_name: "犯罪心理学",
        activity_ins: "F",
        activity_time: "6",
        activity_place: "6",
        id: 5
      },
      {
        activity_picture: "/images/14.jpg",
        activity_name: "瘦身新概念",
        activity_ins: "G",
        activity_time: "7",
        activity_place: "7",
        id: 6
      },
      {
        activity_picture: "/images/13.jpg",
        activity_name: "体育保健学",
        activity_ins: "H",
        activity_time: "8",
        activity_place: "8",
        id: 7
      }
    ]
  },
  onLoad:function(options){
    var that = this;
    var activityId = options.activityId;
    console.log(activityId);
    that.showLoading();
    wx.request({
      url: 'https://7bcznufy.qcloud.la',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //这里请求得到数据
        that.setData({
          activityId: activityId
        })
        console.log("活动详情请求成功");
        that.hideLoading();
      },
      fail: function(res) {
        that.showLoading();
        require('../template/common.js').noNetWork();
      },
      complete: function(res) {
        
      },
    })
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