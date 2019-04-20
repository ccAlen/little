// pages/aiCommonQuestions/aiCommonQuestions.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //article将用来存储towxml数据
    article: {},
    isShow: false,
    isplay: app.globalData.isplay,
    skillList:[],//常见试题岗位列表
    selected:'',
    postList:[],
    postselected:'',
    skillDetailshow: 'list',
    backicon: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // 获取面试技巧分类列表
    common.nRequest(
      getApp().data.services + "api/interview/getskillcats",
      {
        
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // 获取面试技巧
          common.nRequest(
            getApp().data.services + "api/interview/getskills",
            {
              cat_id: res.data.data[0].id
            },
            function (res) {
              if (getApp().data.Reg.test(res.statusCode)) {
                t.setData({
                  postList: res.data.data,
                  skillDetailshow: 'list'
                })
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded' },
            function () {
              console.log('系统错误')
            }
          );
          t.setData({
            skillList: res.data.data,
            selected:res.data.data[0].id
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 返回按钮
  comebackFun:function(){
    this.setData({
      backicon:false,
      skillDetailshow: 'list'
    })
  },
  selectClassFun: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var t = this;
    t.setData({
      selected: e.currentTarget.dataset.id,
      backicon:false
    })
    // 获取面试技巧
    common.nRequest(
      getApp().data.services + "api/interview/getskills",
      {
        cat_id: e.currentTarget.dataset.id
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          t.setData({
            postList: res.data.data,
            skillDetailshow: 'list'
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  postSelectFun:function(e){
    var t = this;
    t.setData({
      postselected: e.currentTarget.dataset.postid
    })
    // 获取面试技巧详情
    common.nRequest(
      getApp().data.services + "api/interview/getskilldetail",
      {
        id: e.currentTarget.dataset.postid
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          //html转WXML
          let wxml = app.towxml.toJson(res.data.data.contents);
          t.setData({
            skillDetail: res.data.data,
            skillDetailshow: 'detail',
            article: wxml,
            backicon: true
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },

  aiIndex: function () {
    wx.redirectTo({
      url: '../aiInterviewer/aiInterviewer',
    })
  },
  aiQuestions: function () {
    // wx.redirectTo({
    //   url: '../aiCommonQuestions/aiCommonQuestions',
    // })
  },
  aiRecord: function () {
    wx.redirectTo({
      url: '../aiRecord/aiRecord',
    })
  }
})