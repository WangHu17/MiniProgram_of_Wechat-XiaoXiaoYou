var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
let app = getApp()
Page({
  data: {
    loading: false,
    content1: "查看已报名",
    content2: "查看导游",
    isguide: false,
  },
  morebooked: function (e) {
    wx.navigateTo({
      url: '/pages/booked/booked?joined=' + JSON.stringify(this.data.joined)
    })
  },
  YKxx: function (e) {
    var that = this;
    var activity_id = this.data.params_id;
    if (that.data.isguide) {
      wx.navigateTo({
        url: '/pages/booked/booked?activity_id=' + activity_id
      })
    }
    else {
      var hasReservation = wx.getStorageSync('hasReservation');
      if (hasReservation) {
        wx.showModal({
          title: '您要修改我的资料吗',
          content: '立即前往修改我的资料',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/useryuyueinfo/userinfo?activity_id=' + activity_id,
              })
            }
            else if (res.cancel) {
              wx.showModal({
                title: '确定是否报名',
                content: '报名成功后可在我的预约里面显示活动',
                confirmText: "直接报名",
                cancelText: "考虑一下",
                success: function (res) {
                  if (res.confirm) {
                    that.getYuyueInfo(activity_id);
                  }
                }
              })
            }
          }
        })
      }
      else {
        wx.navigateTo({
          url: '/pages/reservation/reservation?activity_id=' + activity_id
        })
      }
    }
  },
  getYuyueInfo: function (activity_id) {
    var that = this;
    var userOpenId = wx.getStorageSync('openId');
    var tempyoukeinfo = "";
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId,
        activity_id: activity_id
      },
      url: `${app.appData.baseUrl}get_user_info`,
      success: function (res) {
        console.log("得到临时游客信息");
        console.log(res);
        tempyoukeinfo = res.data.data;
        that.update_user_info(tempyoukeinfo, activity_id);
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
  update_user_info: function (tempyoukeinfo, activity_id) {
    var that = this;
    that.showLoading();
    console.log(tempyoukeinfo);
    qcloud.request({
      login: true,
      data: {
        activity_id: activity_id,
        openId: tempyoukeinfo.openId,
        name: tempyoukeinfo.name,
        phonenumber: tempyoukeinfo.phonenumber,
        QQ: tempyoukeinfo.qq,
        gender: tempyoukeinfo.gender,
        school: tempyoukeinfo.school,
        studentId: tempyoukeinfo.studentId,
        memo: tempyoukeinfo.memo
      },
      url: `${app.appData.baseUrl}update_user_info`,
      success: function (res) {
        console.log("游客临时信息成功上传");
        wx.showToast({
          title: '预约成功'
        })
        wx.navigateTo({
          url: '/pages/yuyue/yuyue'
        })
      },
      fail: function (res) {
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        that.hideLoading();
      },
    })
  },
  onLoad: function (params) {
    var that = this;
    that.showLoading();
    var params_id = params.activity_id;//得到传过来的activity_id
    console.log(params_id);
    that.setData({
      params_id: params_id,
    })
    that._initFav(params_id);
    let userOpenId = wx.getStorageSync("openId");
    qcloud.request({
      login: true,
      data: {
        activity_id: params_id
      },
      url: `${app.appData.baseUrl}get_activity_info`,
      success: function (res) {
        console.log("活动详情");
        console.log(res);
        that.setData({
          activityList: res.data.data[0],
          isguide: res.data.data[0].openId == userOpenId ? true : false
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
  // 收藏开关
  toggleFav() {
    let allKey = wx.getStorageSync('__fav__');
    let thisKey = allKey[this.data.params_id].bool;
    thisKey = !thisKey;
    allKey[this.data.params_id].bool = thisKey;
    wx.setStorageSync('__fav__', allKey);
    this.setData({
      favFlag: thisKey
    })
    wx.showToast({
      title: thisKey ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 2000
    })
  },
  _initFav(params_id) {
    let allKey = wx.getStorageSync('__fav__');
    if (allKey) {
      console.log(allKey);
      if (allKey[params_id] != undefined) {
        this.setData({
          favFlag: allKey[params_id].bool
        })
      } else if (allKey[params_id] == undefined){
        var info = { bool: false, activity_id: params_id };
        allKey[params_id] = info;
        wx.setStorageSync('__fav__', allKey);
      }
    }
    else {
      console.log("第一次收藏");
      let allKey = {};
      var info = { bool: true, activity_id: params_id};
      allKey[params_id] = info;
      wx.setStorageSync('__fav__', allKey);
      this.setData({
        favFlag: allKey[params_id].bool
      })
      console.log(allKey)
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '活动详情',
      path: '/pages/act_detail/act_detail?',
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
  },
  index: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  lookguide: function () {
    var that = this;
    var activity_id = that.data.params_id;
    if (that.data.isguide) {
      //查看已报名
      wx.navigateTo({
        url: '/pages/booked/booked?activity_id=' + activity_id
      })
    }
    else {
      //查看导游信息
      wx.navigateTo({
        url: '/pages/guides-data/guide?activity_id=' + activity_id
      })
    }
  }
})
