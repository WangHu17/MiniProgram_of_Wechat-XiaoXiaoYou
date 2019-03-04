//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
var utils = require('../../utils/util.js');
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var Session = require('../../vendor/wafer2-client-sdk/lib/session.js');
Page({
  data: {
    loading: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recommendList: [],
  },
  setUserInfo: function (e) {
    var that = this;
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo);
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
  },


  bindGetUserInfo: function (e) {
    var that = this;
    app.globalData.userInfo = e.detail.userInfo;    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 检查登录是否过期
          wx.checkSession({
            success: function () {
              // 登录态未过期
            },
            fail: function () {
              qcloud.clearSession();
              // 登录态已过期，需重新登录
              var options = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
              }
              console.log("过期")
              console.log(options);
            },
            complete: function () {
              console.log("检查成功!");
              qcloud.login({
                success(result) {
                  console.log('重新登录成功', result);
                  app.globalData.openId = result.openId;
                  console.log(app.globalData.openId);
                  wx.setStorageSync('openId', app.globalData.openId);
                  wx.showToast({
                    title: '登录成功',
                  })
                  that.setData({
                    hasUserInfo: true
                  })
                },
                fail(error) {
                  console.log('登录失败', error);
                }
              });
              that.hideLoading();
            }
          });
        } else {
          console.log('用户未授权');
        }
      }
    })
  },
  

  getUserInfo: function (e) {
    var that = this;
    that.showLoading();
    if (e.detail.userInfo) {
      //设置用户信息本地存储
      that.setUserInfo(e);
      that.bindGetUserInfo(e);
    }
    else {
      wx.showModal({
        title: '授权失败',
        content: '无法获得你的公开信息（昵称、头像等）',
        success: function (res) {
          that.hideLoading();
          wx.showToast({
            title: '授权失败',
            image: "/images/fail.png"
          })
        }
      })
    }
  },

  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var userOpenId = wx.getStorageSync('openId');
    console.log("userOpenId=" + userOpenId);
    console.log(userInfo);
    if (userInfo) {
      that.setData({
        hasUserInfo: true,
      })
    }
  },
  setting: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/setting/setting'
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
  yuyue: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/yuyue/yuyue',
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
  feedBack: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/feedBack/feedBack'
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
  contact: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/contact/contact'
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
  history: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/history/history',
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
  guide: function (e) {
    if (hasuserInfo()) {
      wx.navigateTo({
        url: '/pages/guide/guide',
      })
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
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
  },
  info: function (e) {
    if (hasuserInfo()) {
      var hasConfirm = wx.getStorageSync('hasConfirm');
      if (hasConfirm){
      wx.navigateTo({
        url: '/pages/userdaoyouinfo/userinfo',
      })
      }
      else {
       wx.navigateTo({
         url: '/pages/leader/leader',
       })
      }
    } else {
      wx.navigateTo({
        url: '/pages/nologin/nologin',
      })
    }
  },
})

function hasuserInfo() {
  return app.globalData.userInfo != null;
}

function showSuccess(res) {
  wx.showToast({
    title: res
  })
}
function showModule(res, e) {
  wx.showModal({
    title: res,
    content: e,
  })
}