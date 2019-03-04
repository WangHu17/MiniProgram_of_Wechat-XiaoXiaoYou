const qcloud = require('../../vendor/wafer2-client-sdk/index');

// 引入配置
const config = require('../../config');
const app = getApp();
const school_city = require("../../map/school_ciy.js");
const provincecodes = require("../../map/provincecode.js");
var acitivity_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    startDate: "选择日期",
    startTime: "选择时间",
    endDate: "选择日期",
    endTime: "选择时间",
  },

  bindDateChange: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      startDate: e.detail.value,
    })
  },
  bindTimeChange: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      startTime: e.detail.value,
    })
  },
  bindDateChange2: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      endDate: e.detail.value,
    })
  },
  bindTimeChange2: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      endTime: e.detail.value,
    })
  },
  submit: function (e) {
    wx.showToast({
      title: '提交成功',
      icon: "success",
      duration: 2000,
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var user_phoneNumber = e.detail.value.user_phoneNumber;
    var activity_start_date = e.detail.value.activity_start_date;
    var activity_start_time = e.detail.value.activity_start_time;
    var activity_end_date = e.detail.value.activity_end_date;
    var activity_end_time = e.detail.value.activity_end_time;

    if (activity_start_date.length == 0) {
      var content = "活动开始日期不能为空";
      printf1(content);
      return false;
    }

    if (activity_start_time.length == 0) {
      var content = "活动开始时间不能为空";
      printf1(content);
      return false;
    }

    if (activity_end_date.length == 0) {
      var content = "活动结束日期不能为空";
      printf1(content);
      return false;
    }

    if (activity_end_time.length == 0) {
      var content = "活动结束时间不能为空";
      printf1(content);
      return false;
    }

    if (activity_start_date > activity_end_date) {
      content = "活动开始日期不能大于活动结束日期";
      printf1(content);
      return false;
    }

    if (activity_start_date == activity_end_date && activity_start_time >= activity_end_time)     {
      content = activity_start_time == activity_end_time ? "活动开始时间不能等于结束时间" : "或是开始时间不能小于结束时间";
      printf1(content);
      return false;
    }

    if (user_phoneNumber.length < 10) {
      var content = user_phoneNumber.length == 0 ? "联系电话不能为空" : "联系电话格式错误";
      printf1(content);
      return false;
    }
    console.log("用户发起活动所携带的数据为:", e.detail.value);
    that.showLoading();
    console.log(app.globalData.act1);
    console.log(app.globalData.act2);
    console.log("user_school:" + app.globalData.school);
    var city = require("../../map/school_ciy.js").school_city[app.globalData.school];
    var city_id = require("../../map/CityId.js").getCityId[city];
    var provincecode = require("../../map/provincecode.js").provincecode[city];
    console.log( "city_id:" + city_id);
    console.log("city:" + city);
    console.log("provincecode:" + provincecode);
    var openid = wx.getStorageSync('openId');
    var userInfo = wx.getStorageSync("userInfo");
    // userInfo = JSON.stringify(userInfo);
    console.log("openid:" + openid);
    uploadactivity_id();
    qcloud.request({
      login:true,
      url: `${app.appData.baseUrl}upload_activity`,
      data: {
        activity_end_date: activity_end_date,
        activity_end_time: activity_end_time,
        activity_start_date: activity_start_date,
        activity_start_time: activity_start_time,
        user_phoneNumber: user_phoneNumber,
        activity_area: app.globalData.act1.activity_area,
        activity_title: app.globalData.act2.activity_title,
        activity_introduce: app.globalData.act2.activity_introduce,
        user_school: app.globalData.school,
        id:city_id,
        openId: openid,
        imgUrl: that.data.imgUrl,
        activity_id: app.globalData.tempactivity_id,
        provincecode: provincecode,
        activity_money: app.globalData.act2.activity_money,
        activity_leader_money: app.globalData.act2.activity_leader_money,
        userInfo: userInfo
      },
      success: function (res) {
        //上传数据
        console.log("数据上传成功", res)
        that.submit();
        that.tomine();
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
  
  tomine:function() {
    wx.reLaunch({
      url: '/pages/mine/mine'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imgUrl = options.imgUrl;
    this.setData({
      imgUrl: imgUrl
    })
    getactivity_id();
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

  /**
   * 生命周期函数--监听页面显示
   */

})

function printf1(data) {
  wx.showModal({
    title: '提交失败',
    content: data
  })
}
function getactivity_id() {
  var that = this;
  qcloud.request({
    login: true,
    url: `${app.appData.baseUrl}get_activity_id`,
    success: function (res) {
      //上传数据
      console.log("activity_id get成功")
      console.log(res);
      app.globalData.tempactivity_id = res.data.data[0].activity_id;
      console.log("get_activity_id" + app.globalData.tempactivity_id);
    },
    fail: function (res) {
      console.log(res);
      require("../template/common.js").noNetWork();
    },
    complete: function (res) {
    },
  })
}
function uploadactivity_id() {
  var that = this;
  console.log(app.globalData.tempactivity_id);
  var tempactivity_id = app.globalData.tempactivity_id + 1;
  console.log(tempactivity_id);
  qcloud.request({
    login: true,
    url: `${app.appData.baseUrl}upload_activity_id`,
    data: {
      activity_id: tempactivity_id
    },
    success: function () {
      //上传数据
      console.log("activity上传成功")
    },
    fail: function () {
      require("../template/common.js").noNetWork();
    },
    complete: function () {
    },
  })
}