//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');
App({
  globalData: {
    userInfo: null,
    defaultCity: "",
    province: "",
    school: "",
    defaultCityId: "",
    sendStatus: false,
    code: "",
    userId: "",
    keys: "",
    access: "",
    act1: "",
    act2: "",
    openId:"",
    tempactivity_id:0,
    guideInfoDetail:""
  },
  appData: {
    appId: config.service.appId,
    baseUrl: `${config.service.host}/weapp/`,
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    this.globalData.userInfo = wx.getStorageSync('userInfo') || null;
    this.globalData.defaultCity = wx.getStorageSync('userLocation') || "全国";
    this.globalData.defaultCityId = wx.getStorageSync('usercityId') || null;
    qcloud.setLoginUrl(config.service.loginUrl);
    var storages = wx.getStorageInfo({
      success: function(res) {
        console.log(res);
      },
    })
    var openId = wx.getStorageSync('openId');
    this.globalData.openId = openId;
  },
})

