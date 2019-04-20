//app.js 
const Towxml = require('/towxml/main'); //HTML转小程序
let Promise = require('./utils/ES2015ponyfill/promise').Promise;//canvars
var common = require("./utils/util.js");
App({
  data: {
    services: "https://dev.wefundvc.com/",//测试
    // services: "https://api.exinghang.com/",//正式
    // services: "https://dev.exinghang.com/",
    Reg: /^20[0123456789]$/,//判断接口返回状态是否为20开头
    imgReg: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,//判断图片格式
    status:{
      s201:'201',//正常显示数据
      s402: '402',//显示错误信息，告知用户
      s203: '203',//删除成功
      s204:'204',//删除失败
      s301:'301',//需要后续操作
      s401:'401',//系统错误
      s403:'403',//敏感词
    }

  },
  // canvas的全局方法
  promise: {
    getDeviceInfo: function () {//获取设备信息
      let promise = new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: function (res) {
            resolve(res)
          },
          fail: function () {
            reject()
          }
        })
      })
      return promise
    }
  },
  getGid: (function () {//全局唯一id
    let id = 0
    return function () {
      id++
      return id
    }
  })(),
  
  // onShow: function (options) {
  //   console.log("[onShow] 场景值:", options.scene)
  // },
  onLaunch: function (ops) {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
      //console.log('abcb')
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      console.log('更新失败')
    })
    // wx.clearStorage() 
    const t = this;
    if(ops){
      console.log(ops)
      // 缓存二维码传过来的参数
      wx.setStorageSync('options', ops)
      // 请求后台接口，保存二维码传过来的参数
      common.nRequest(
        t.data.services + "api/log",
        { enterUrl: ops.path, parameter: JSON.stringify(ops.query) },
        function (res) {
          // if (getApp().data.Reg.test(res.statusCode)) {
          //   // console.log(res)
          // }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded' },
        function () {
          console.log('系统错误')
        }
      );
      if (ops.query.course_id && !ops.query.pid) {//pid存在是普通的二维码，course_id存在的是分销的推广二维码，pid和course_id不会同时存在，课程(分销)推广二维码需要获取用户的手机号码（授权基本资料、头像、昵称、手机号码），不管之前是否已经授权过基本资料，只要用户授权了手机号码，都算拉新成功，如果用户拒绝授权手机号码，不算拉新成功。
        t.globalData.codeType = '2';
        wx.setStorageSync('codeType', '2')
        wx.setStorageSync('distributor_id', ops.query.distributor_id)
        wx.setStorageSync('course_id', ops.query.course_id)
        // 获取用户信息
        // common.nRequest(
        //   t.data.services + "api/user/getdetail",
        //   { },
        //   function (res) {
        //     if (getApp().data.Reg.test(res.statusCode)) {
        //       console.log(res)
        //     }
        //   },
        //   "post",
        //   { 'content-type': 'application/x-www-form-urlencoded' },
        //   function () {
        //     console.log('系统错误')
        //   }
        // );
      }else{
        wx.setStorageSync('codeType', '1')
        if (ops.query.pid){
          // console.log(ops.query.pid)
          t.globalData.pid = ops.query.pid
          // console.log(t.globalData.pid)
        }
      }

    }else if(ops.scene == 1044){
      console.log("shareTicket")
      console.log(ops.shareTicket)
      var shareTickets = ops.shareTicket;
    
      wx.getShareInfo({
        shareTicket: shareTickets,
        success: function (res) {
          console.log('success');
          console.log(res);
          //console.log(res);  
          wx.showToast({
            title: '分享成功',
            duration: 5000
          })
        },
        fail: function (res) {
          console.log('fail');
          console.log(res);
          wx.showToast({
            title: 'fail:' + res.errMsg,
            duration: 5000
          })
        }
      }); 
    }
    
    // canvas
    t.deviceInfo = t.promise.getDeviceInfo();

  },
  onLoad: function (options) {
    
  },
  onHide:function(){
    // wx.clearStorage()
  },
  globalData: {
    userInfo: null,
    // audio: wx.createInnerAudioContext(),
    audio: wx.getBackgroundAudioManager(),
    isShow:false,
    isplay: 'pause',
    token: '',
    showLogin:false,
    showGetPhone:false,
    recordNav:'1',
    codeType:'',
    courseId:0,
    courseHandouts:"",//讲义内容
    courseTitle:'',//讲义标题
    testRecord:false,//测试记录
    pid:'',
    normalCode : false,//是否普通二维码进来
  },
  towxml: new Towxml()    
})