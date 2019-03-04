// pages/userinfo/userinfo.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    hasbianji:false,
    userInfo:{},
    activity_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showLoading();
    var activity_id = options.activity_id;
    that.setData({
      activity_id: activity_id
    })
    var userOpenId = wx.getStorageSync('openId');
    var getavatarUrl = wx.getStorageSync('userInfo');
    if (getavatarUrl) {
      that.setData({
        avatarUrl: getavatarUrl.avatarUrl
      })
    }
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId,
        activity_id:activity_id
      },
      url: `${app.appData.baseUrl}get_user_info`,
      success: function (res) {
        console.log("得到游客信息");
        console.log(res);
        that.setData({
          userInfo: res.data.data[0],
          gender: res.data.data[0].gender
        })
      },
      fail: function (res) {
        console.log(res);
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        that.hideLoading();
      },
    })
  },
  submit: function (e) {
    var that = this;
    var userOpenId = wx.getStorageSync('openId');
    var gender = that.data.gender;
    console.log(e.detail.value);
    that.showLoading();
    qcloud.request({
      login: true,
      data: {
        activity_id: that.data.activity_id,
        openId: userOpenId,
        name: e.detail.value.name,
        phonenumber: e.detail.value.phone,
        QQ: e.detail.value.qq,
        gender: gender,
        school: e.detail.value.school,
        studentId: e.detail.value.studentId,
        memo: e.detail.value.memo
      },
      url: `${app.appData.baseUrl}update_user_info`,
      success: function (res) {
        console.log("游客信息成功修改");
        wx.showToast({
          title: '修改成功'
        })
      },
      fail: function (res) {
        console.log(res);
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
  refresh:function() {
    var that = this;
    that.setData({
      hasbianji:true
    })
  },
  usersex: function (e) {
    console.log(e.detail.value);
    this.setData({
      gender: e.detail.value
    })
  }
})