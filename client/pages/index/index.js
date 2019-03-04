//  pages/index/index.js 
var mydata = require('../mydata/mydata.js');
var util = require('../../utils/util.js');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var key = require('../../map/config.js');
var qqmapsdk;
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
var cnt = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    location: "",
    params_id: "",
    interval: 5000,
    duration: 1000,
    save: false,
    currentSwiper: 0,
    animation: "",
    recommend: [],
    recommend_tempfile: [],
    hotRecommend: "",
    hotRecommend_tempfile: [],
    rank: [1, 2, 3],
    imgUrls: [
      'https://wximg-1256751425.cos.ap-guangzhou.myqcloud.com/guider.PNG',
      'https://wximg-1256751425.cos.ap-guangzhou.myqcloud.com/visitor.PNG',
      'https://wximg-1256751425.cos.ap-guangzhou.myqcloud.com/%E9%A6%96%E9%A1%B5.PNG',
    ],
    imgUrl: ''
  },
  onLoad: function (options) {
    var that = this;
    var cityId = options.cityId;//得到用户所选城市的cityId
    console.log("cityId:" + cityId);
    that.showLoading();
    that.setData({
      location: app.globalData.defaultCity
    })
    if (cityId != undefined) {
      that.getProvincedata(cityId);
      qcloud.request({
        login: true,
        data: {
          id: cityId
        },
        url: `${app.appData.baseUrl}get_city_activity`,
        success: function (res) {
          console.log("用户切换城市数据");
          console.log(res);
          if (res.data.data.length >= 4) {
            that.setData({
              'recommend[0]': res.data.data[0],
              'recommend[1]': res.data.data[1],
              'recommend[2]': res.data.data[2],
              'recommend[3]': res.data.data[3],
              recommend_tempfile: res.data.data
            })
          }
          else {
            that.setData({
              recommend: res.data.data,
              recommend_tempfile: res.data.data
            })
          }
        },
        fail: function (res) {
          console.log(res)
          require("../template/common.js").noNetWork();
        },
        complete: function (res) {
          that.hideLoading();
        },
      })
    }
    else {
      let city = app.globalData.defaultCity;
      if (city == "全国") {
        that.hideLoading();
        qcloud.request({
          login: true,
          data: {
            id: 1
          },
          url: `${app.appData.baseUrl}get_city_activity`,
          success: function (res) {
            console.log("全国数据");
            console.log(res);
            if (res.data.data.length >= 4) {
              that.setData({
                'recommend[0]': res.data.data[0],
                'recommend[1]': res.data.data[1],
                'recommend[2]': res.data.data[2],
                'recommend[3]': res.data.data[3],
                recommend_tempfile: res.data.data
              })
            }
            else {
              that.setData({
                recommend: res.data.data,
                recommend_tempfile: res.data.data
              })
            }
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              title: '未登录',
              duration:1000
            })
            // wx.showModal({
            //   title: '您没有授权登录',
            //   content: '无法浏览首页活动',
            //   success: function (res) {
            //     if (res.confirm) {
            //       wx.redirectTo({
            //         url: '/pages/nologin/nologin',
            //       })
            //     }
            //     else if (res.cancel) {
            //       wx.switchTab({
            //         url: '/pages/mine/mine',
            //       })
            //     }
            //   }
            // })
          },
          complete: function (res) {
            that.hideLoading();
          },
        })
      }
      else {//默认情况
        that.getProvincedata(app.globalData.defaultCityId);
        qcloud.request({
          login: true,
          data: {
            id: app.globalData.defaultCityId
          },
          url: `${app.appData.baseUrl}get_city_activity`,
          success: function (res) {
            console.log("用户本地数据");
            console.log(res);
            if (res.data.data.length >= 4) {
              that.setData({
                'recommend[0]': res.data.data[0],
                'recommend[1]': res.data.data[1],
                'recommend[2]': res.data.data[2],
                'recommend[3]': res.data.data[3],
                recommend_tempfile: res.data.data
              })
            }
            else {
              that.setData({
                recommend: res.data.data,
                recommend_tempfile: res.data.data
              })
            }
          },
          fail: function (res) {
            console.log(res)
            require("../template/common.js").noNetWork();
          },
          complete: function (res) {
            that.hideLoading();
          },
        })
      }
    }

  },
  getProvincedata: function (cityId) {
    var that = this;
    qcloud.request({
      login: true,
      data: {
        id: cityId
      },
      url: `${app.appData.baseUrl}get_province_activity`,
      success: function (res) {
        console.log("省数据");
        console.log(res);
        if (res.data.data.length >= 3) {
          that.setData({
            'hotRecommend[0]': res.data.data[0],
            'hotRecommend[1]': res.data.data[1],
            'hotRecommend[2]': res.data.data[2],
            hotRecommend_tempfile: res.data.data
          })
        }
        else {
          that.setData({
            hotRecommend: res.data.data,
            hotRecommend_tempfile: res.data.data
          })
        }

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
  onShow: function (e) {

  },
  instruction: function (e) {
    wx.navigateTo({
      url: '/pages/instruction/instruction'
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  recommend: function (e) {
    var actId = e.currentTarget.dataset.actId;
    wx.navigateTo({
      url: '/pages/act_detail/act_detail?activity_id=' + actId
    })
  },
  hotrecommend: function (e) {
    var hotactId = e.currentTarget.dataset.hotactId;
    wx.navigateTo({
      url: '/pages/act_detail/act_detail?activity_id=' + hotactId
    })
  },
  lookall1: function (e) {
    var hotRecommend = this.data.hotRecommend_tempfile;
    wx.navigateTo({
      url: '/pages/more1/more1?hotRecommend=' + JSON.stringify(hotRecommend)
    })
  },
  lookall2: function (e) {
    var recommend = this.data.recommend_tempfile;
    wx.navigateTo({
      url: '/pages/more2/more2?recommend=' + JSON.stringify(recommend)
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
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
  searchact: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
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
})
