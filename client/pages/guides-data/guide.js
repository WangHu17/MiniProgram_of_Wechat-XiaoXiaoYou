var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
let app = getApp()
Page({
  data: {
    loading: false,
    hasFabu: false,
    userInfo:{}
  },
  onLoad: function (options) {
    var that = this;
    var activity_id = options.activity_id;
    console.log(activity_id);
    that.showLoading();
    qcloud.request({
      login: true,
      data: {
        activity_id: activity_id
      },
      url: `${app.appData.baseUrl}get_guider_info_activity`,
      success: function (res) {
        console.log("导游信息");
        console.log(res);
        var avatarUrl = JSON.parse(res.data.data[0].userInfo);
        that.setData({
          userInfo:res.data.data[0],
          avatarUrl: avatarUrl.avatarUrl
        })
      },
      fail: function (res) {
        console.log(res)
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        that.hideLoading();
      },
    })
  },
  onShow: function () {
    
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