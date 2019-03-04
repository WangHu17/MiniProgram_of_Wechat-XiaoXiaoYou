var utils = require("../../utils/util.js");
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({
  data:{
    introduce1: false,
    loading:false,
    seelectSchool:""
  },
  bindinput:function(e) {
    this.setData({
      seelectSchool: e.detail.value
    })
  },
  actIntroduce1: function (e) {
    var that = this;
    console.log(that.data.seelectSchool);
    that.showLoading();
    qcloud.request({
      login: true,
      data: {
        user_school: that.data.seelectSchool
      },
      url: `${app.appData.baseUrl}get_search_info`,
      success: function (res) {
        console.log(res);
        that.setData({
          introduce1:true,
          hotRecommend:res.data.data
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
  showLoading: function () {
    this.setData({
      loading: true
    })
  },
  hideLoading: function () {
    this.setData({
      loading: false
    })
  },
  recommend: function (e) {
    var hotactId = e.currentTarget.dataset.hotactId;
    wx.navigateTo({
      url: '/pages/act_detail/act_detail?activity_id=' + hotactId
    })
  },
})