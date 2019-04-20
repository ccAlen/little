// pages/record/record.js
import chartWrap from '../../utils/canvas/chartWrap'
import getConfig from './getConfig'
var common = require("../../utils/util.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseDetails: '',
    // classesNum: '',
    isPullDown: false,
    nav: '1',
    per:'60%',
    rotateL: '',
    rotateR:'',
    colorBool: '',
    isShow: false,
    isplay: app.globalData.isplay,
    token:'',
    kaozhengList:{},//考证助手数据
    studyInfo:{},//学习记录
    favoritesList:[],//收藏
    showLogin: false
  },
  // onShow: function () {
    
    // let pageThis = this
    // app.deviceInfo.then(function (deviceInfo) {
    //   console.log('设备信息', deviceInfo)
    //   let labels = ["04.18", "04.19", "04.20", "04.21", "04.22", "04.23", "今天"]
    //   let data = [4, 2, 8, 7, 5, 0, 7]
    //   let width = Math.floor(deviceInfo.windowWidth - (deviceInfo.windowWidth / 750) * 10 * 2)//canvas宽度
    //   let height = Math.floor(width / 1.6)//这个项目canvas的width/height为1.6
    //   let canvasId = 'myCanvas'
    //   let canvasConfig = {
    //     width: width,
    //     height: height,
    //     id: canvasId
    //   }
    //   let config = getConfig(canvasConfig, labels, data)
    //   chartWrap.bind(pageThis)(config)

    // })
  // },
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
  },
  onLoad:function(){
    // 登录
    common.getLogin(this,'record')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const t = this;
    // 登录
    // common.getLogin(t)
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay,
      nav: app.globalData.recordNav
    })
    // 从缓存获取token
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        t.setData({
          token: _token.data
        })
        // [记录]获取证书查询记录
        wx.getStorage({
          key: 'token',
          success: function (_token) {
            common.nRequest(
              getApp().data.services + "/api/cert/getsearchcertrecords",
              { page: 1, per_page: 1000},
              function (res) {
                if (getApp().data.Reg.test(res.statusCode)) {
                  var _kaozhengList = res.data.data;
                  console.log(_kaozhengList)
                  if(_kaozhengList.length > 0){
                    for (var i = 0; i < _kaozhengList.length; i++) {
                      _kaozhengList[i].created_at = _kaozhengList[i].created_at.split(' ')[0]
                    }
                  }
                  t.setData({
                      kaozhengList: _kaozhengList
                  })
                }
              },
              "post",
              { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
              function () {
                console.log('系统错误')
              }
            );
          },
          fail: function () {

          }
        })
        // 获取用户查询记录(考证助手)
        // common.nRequest(
        //   getApp().data.services + "api/cert/getsearchrecords",
        //   {
        //     page: 1, per_page: 1000
        //   },
        //   function (res) {
        //     if (getApp().data.Reg.test(res.statusCode)) {
        //       // console.log(res)
        //       t.setData({
        //         kaozhengList:res.data.data
        //       })
        //     }
        //   },
        //   "post",
        //   { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
        //   function () {
        //     console.log('系统错误')
        //   }
        // );
        // 获取学习时长及连续天数(学习记录)
        common.nRequest(
          getApp().data.services + "api/user/getstudylength",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              var _studyInfo = res.data.data;
              _studyInfo.study_length = parseFloat(_studyInfo.study_length / 60).toFixed(0)
              t.setData({
                studyInfo: _studyInfo
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
        // 获取已购课程列表
        common.nRequest(
          getApp().data.services + "api/user/gethasboughtcourses",
          { page: 1, per_page: 500 },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              var _courseDetails = res.data.data;
              // console.log(_courseDetails[0].study[0].bought_time)
              // console.log(_courseDetails[0].study[0].bought_time.split(' ')[0])
              for (var i = 0; i < _courseDetails.length; i++) {
                _courseDetails[i].courses.duration = parseInt(_courseDetails[i].courses.duration / 60)
                _courseDetails[i].bought_time = _courseDetails[i].bought_time.split(' ')[0]
              }
              
              t.setData({
                courseDetails: _courseDetails
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
        // 获取课程收藏列表
        common.nRequest(
          getApp().data.services + "api/user/getfavoritecourse",
          { page: 1, per_page: 500 },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              t.setData({
                favoritesList:res.data.data
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
      },
      fail:function(){
        // 弹出授权弹框授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'record')
      }
    })

    // 圆形进度条
    // var percent = parseInt(t.data.per);
    
    // if (percent <= 50) {
    //   var rotate = 'rotate(' + (percent * 3.6) + 'deg)';
    //   t.setData({
    //     rotateR: rotate,
    //     colorBool: false
    //   })
    // } else {
    //   var rotate = 'rotate(' + ((percent - 50) * 3.6) + 'deg)';
    //   t.setData({
    //     rotateL: rotate,
    //     rotateR: 'rotate(0deg)',
    //     colorBool: true
    //   })
    // }
  },
  slideFun: function () {
    this.setData({
      isPullDown: !this.data.isPullDown,
    })
  },
  navFun: function(e){
    // console.log(e.target.dataset.nav)
    this.setData({
      nav: e.target.dataset.nav
    })
    getApp().globalData.recordNav = e.target.dataset.nav;
  },
  textualAssistantLink: function (e) {
    wx.navigateTo({
      url: '../courseDetails/courseDetails?courseid=' + e.currentTarget.dataset.courseid + '&into=1'
    })
  },
})