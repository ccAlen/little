// pages/textualAssistant_step/textualAssistant_step.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // delList:'',
    // onfocusindex:'',
    specialtyList:'',//专业输入框的值
    zhuanye: false,//判断用户是否从查询结果中选择专业
    postName:'',//岗位输入框的值
    zhiye: false,//判断用户是否从查询结果中选择职业
    searchMajorList:[],//搜索关键字返回的专业列表
    step:'1',//步骤
    isShow: false,
    isplay: app.globalData.isplay,
    zhuanyeid:'',
    zhiyeid:'',
    testRecord:false,
    text:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      text:true
    })
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
    console.log(this.data.text)
    console.log(app.globalData.testRecord)
    this.setData({
      zhuanye: false,
      zhiye: false,
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay,
      testRecord: app.globalData.testRecord
    })
  },

  
  // 专业输入框监听
  getInputValFun:function(e){
    const t = this;
    // console.log(e)
    let _val = e.detail.value;
    
    // 判断输入字符串长度，至少输入两个之后才请求
    let jmz = {};
    jmz.GetLength = function (str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    if (e.currentTarget.dataset.type == 'a') {//专业检索
      t.setData({
        specialtyList: _val,
        zhuanye: false
      });
      if (jmz.GetLength(_val) >= 4){
        common.nRequest(
          getApp().data.services + "api/major/retrievalmajor",
          { keyword: _val },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              // console.log(res)
              t.setData({
                searchMajorList: res.data.data
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded' },
          function () {
            console.log('系统错误')
          }
        );
      }
    }else if(e.currentTarget.dataset.type == 'b') {//职业检索
      // console.log(_val)
      t.setData({
        postName: _val,
        zhiye:false
      });
      if (jmz.GetLength(_val) >= 4) {
        common.nRequest(
          getApp().data.services + "api/prof/retrievalprof",
          { keyword: _val },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              // console.log(res)
              t.setData({
                searchMajorList: res.data.data
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded' },
          function () {
            console.log('系统错误')
          }
        );
      }
    }  
  },
  // 清除专业输入框
  clearTxtFun:function(e){
    let _val = e.target.dataset.val;
    if (e.target.dataset.type == 'zhuanye'){
      this.setData({
        specialtyList: '',
        searchMajorList: [],
      });
    }else{
      this.setData({
        searchMajorList: [],
        postName: ''
      });
    }
  },
  // 选择列表
  onclickListFun:function(e){
    console.log(e.target.dataset.list)
    if (e.currentTarget.dataset.type == 'a') {//专业选择
      this.setData({
        specialtyList: e.target.dataset.list,
        zhuanye: true,
        zhuanyeid: e.currentTarget.dataset.id
      })
      // 存储测试的专业id
      // wx.setStorage({
      //   key: "zhuanyeid",
      //   data: e.currentTarget.dataset.id
      // })
    } else if (e.currentTarget.dataset.type == 'b') {//岗位选择
      this.setData({
        postName: e.target.dataset.list,
        zhiye:true,
        zhiyeid: e.currentTarget.dataset.id
      })
      // 存储测试的岗位id
      // wx.setStorage({
      //   key: "zhiyeid",
      //   data: e.currentTarget.dataset.id
      // })
    }
  },
  // 下一步
  nextStep:function(e){
    const t = this;
    if (e.currentTarget.dataset.type == 'a'){//专业下一步
      if (t.data.specialtyList != '') {
        if(t.data.zhuanye){
          t.setData({
            step: '2',
            searchMajorList: [],
            postName: ''
          })
        }else{
          wx.showToast({
            title: '请从列表中选择专业',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '请输入专业关键字',
          icon: 'none',
          duration: 2000
        })
      }
    } else if(e.currentTarget.dataset.type == 'b') {//岗位下一步 
      // console.log(t.data.zhiye)
      t.setData({
        step: '3',
        searchMajorList: [],
        // postName: ''
      })
      // if (t.data.postName != '') {
      //   if(t.data.zhiye){
      //     t.setData({
      //       step: '3',
      //       searchMajorList: [],
      //       // postName: ''
      //     })
      //   }else{
      //     wx.showToast({
      //       title: '请从列表中选择职业',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   }
      // } else {
      //   wx.showToast({
      //     title: '请输入岗位关键字',
      //     icon: 'none',
      //     duration: 2000
      //   })
      // }
    }
  },
  //调用证书查询接口
  getSearchcert: function (_zhuanyeid, _zhiyeid, _token, new_search) {
    var t = this;
    // 查询证书并保存查询记录 
    var postData = {}
    if (new_search) {
      postData.new_search = '1'
    }
    if (_zhiyeid && _zhiyeid != '0') {
      postData.profession_id = _zhiyeid
    }
    if (_zhuanyeid) {
      postData.major_id = _zhuanyeid
    }
    common.nRequest(
      getApp().data.services + "api/cert/searchcert",
      postData,
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          if (res.data.data.payload) {
            wx.requestPayment({
              'timeStamp': res.data.data.payload.timeStamp,
              'nonceStr': res.data.data.payload.nonceStr,
              'package': res.data.data.payload.package,
              'signType': 'MD5',
              'paySign': res.data.data.payload.paySign,
              'success': function (paydata) {
              wx.navigateTo({
                url: '../notes/notes?new_search=1&zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid 
              })
                t.setData({ text: false })
              },
              'fail': function (res) {
                console.log('购买失败,返回重新测试')
                console.log(res)
                wx.showModal({
                  title: '提示',
                  content: '购买失败,返回重新测试',
                  showCancel: false,
                  success: function (res) {
                    wx.navigateBack()
                  }
                })
              }
            })
          }else if(res.data.data.major || res.data.data.profs){
            wx.navigateTo({
              url: '../notes/notes?new_search=1&zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
            })
            t.setData({ text: false })
          } else {
            wx.showToast({
              title: '购买数据有误',
              icon: 'none',
              duration: 2000
            })
          }
          // t.setData({
          //   recommend: res.data.data
          // })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 确认并生成建议结果
  generatingResult:function(){
    // 调付款接口，付款完成跳转到建议结果页面
    var t = this;
    if(t.data.text){
      // 查询证书并保存查询记录
      app.globalData.testRecord = true
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          t.getSearchcert(t.data.zhuanyeid, t.data.zhiyeid, _token.data, 'new_search')
        },
        fail: function () {
          t.getSearchcert(t.data.zhuanyeid, t.data.zhiyeid, 'new_search')
        }
      })
    }else{
      wx.navigateTo({
        url: '../notes/notes?new_search=1&zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
      })
      t.setData({ text: false })
    }
  },
  // 分享生成建议结果
  onShareAppMessage: function (res) {
    var t = this;
    return {
      title: '就业助手',
      path: '/pages/textualAssistant/textualAssistant',
      success(e) {
        // 分享解锁：分享出去即视为分享成功
        wx.navigateTo({
          url: '../notes/notes?new_search=1&zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
        })
        t.setData({ text: false })
      },
      fail(e) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  onUnload: function () {
    var that = this
    setTimeout(function () {
      that.setData({ text: true })
    }, 200)

  },
})