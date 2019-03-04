const city = require('../../map/city.js');
const cityObjs = require('../../map/city.js');
const config = require('../../map/config.js');
const appInstance = getApp();
const CityId = require('../../map/CityId.js');
const school = require('../../map/school.js');

// var schools = school.schools;
// function sift() {
//   var shcool_cityid = new Map();
//   for (var i in schools) {
//     for (var j in schools[i])
//     shcool_cityid[schools[i][j].name] = schools[i][j].city
//   }
//   console.log(JSON.stringify(shcool_cityid));
// }




Page({
  data: {
    loading:false,
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    inputName: '',
    completeList: [],
    cityId:""
  },
  onLoad: function () {
    // sift()
    // 生命周期函数--监听页面加载
    var that = this;
    
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    searchLetter.map(
      (item,index) => {
        // console.log(item);
        // console.log(index);
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(tempArr);
    that.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList
    });
    that.getLocation();
  },

  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },
  reGetLocation: function() {
    appInstance.globalData.defaultCity = this.data.city;
    var cityId = this.data.cityId;
    console.log("reGetLocation携带的参数为:" + appInstance.globalData.defaultCity + cityId);
    //返回首页
    wx.reLaunch({
      url: '/pages/index/index?cityId=' + cityId
    })
  },
  //选择城市
  bindCity: function (e) {
    var cityId = e.currentTarget.dataset.cityId;
    this.setData({
      condition:true,
      city: e.currentTarget.dataset.city,
      cityId: cityId,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })
    appInstance.globalData.defaultCity = this.data.city;
    appInstance.globalData.defaultCity = this.data.cityId;
  },
  getLocation: function() {
    var that = this;
    that.showLoading();
    console.log("正在定位城市");
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true ) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("授权失败返回数据");
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      that.showLoading();
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      that.ConfirmLocation();
                    } else {
                      that.showLoading();
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        } 
        else 
          that.ConfirmLocation();
      }
    })
  },
  ConfirmLocation:function(res) {
    var that = this;
    that.showLoading();
    that.setData({
      county: ''
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        console.log(latitude + longitude);
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
          success: res => {
            console.log(res);
            var cityId = CityId.getCityId[res.data.result.ad_info.city];
            appInstance.globalData.defaultCityId = cityId;
            wx.setStorageSync('userLocation', res.data.result.ad_info.city);
            wx.setStorageSync('usercityId', cityId);
            console.log("定位的城市和对应的id为:" + res.data.result.ad_info.city + " " + cityId);
            that.setData({
              cityId: cityId,
              city: res.data.result.ad_info.city,
              currentCityCode: res.data.result.ad_info.adcode,
            })
            that.hideLoading();
          },
          fail: function (e) {
            console.log("失败");
            require("../template/common.js").noNetWork();
            that.hideLoading();
          }
        })
      }
    })
  },
  bindBlur: function(e) {
    this.setData({
      inputName: ''
    })
  },
  bindKeyInput: function(e) {
    // console.log("input: " + e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.auto();
  },
  auto: function () {
    let inputSd = this.data.inputName.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    // console.log(cityList.length)
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
        return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          testObj.id = item.id
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          testObj.id = item.id
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          testObj.id = item.id
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
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
