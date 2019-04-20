// pages/aiQuestion/aiQuestion.js
const app = getApp()
var common = require("../../utils/util.js");
var plugin = requirePlugin("WechatSI")
var manager;
var timeCount,answerArr;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    isanimation:false,
    onstatus: false,
    min: '01',//分
    secs: '00',//秒
    questionList:[],//试题列表
    question:{},//当前试题
    _index:1,//题目序号
    replenish: '0',//是否要补充
    // recordList:[],//音频数组
    token:'',
    audioList:[],//缓存每道题的题目和回答音频，用作下一页的音频列表渲染
    time:0,//每道题的录音时长
    clickNext:false,//是否可以点击下一题
    isrecord: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   answerArr = [];
  //   this.setData({
  //     isShow: app.globalData.isShow,
  //     isplay: app.globalData.isplay,
  //     replenish: '0',
  //     clickNext: false,
  //     _index: 1,//题目序号
  //     onstatus: false,
  //     isanimation: false,
  //   })
  //   // 获取面试题
  //   this.getQuestionFun()
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取面试题
    // this.getQuestionFun()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    manager = plugin.getRecordRecognitionManager()
    answerArr = [];
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay,
      replenish: '0',
      clickNext: false,
      _index: 1,//题目序号
      onstatus: false,
      isanimation: false,
    })
    console.log('replenish')
    console.log(this.data.replenish)
    // 获取面试题
    this.getQuestionFun()
    var t = this;
    // 识别结束事件
    var audioList = [];//缓存在本地的音频地址和题目
    // answerArr = [];
    manager.onStop = function (res) {
      console.log("停止")
      console.log(res)
      t.setData({
        isrecord: false,
        isanimation:false,
        // 是否可以点击下一题
        clickNext: false
      })
      // console.log("record file path", res.tempFilePath)
      // console.log("result", res.result)
      if(res.result != ''){
        var audioandquestion = {};
        audioandquestion.tempFilePath = res.tempFilePath;
        audioandquestion.question = t.data.question.title;
        audioandquestion.index = t.data._index + '_' + t.data.replenish;
        audioandquestion._index = t.data._index;
        audioandquestion.time = t.data.time;
        audioList.push(audioandquestion)
        // console.log("999999999999999999")
        // console.log(audioList)
        t.setData({
          audioList: audioList
        })
        wx.setStorage({
          key: 'audioList',
          data: audioList,
        })
        wx.getStorage({
          key: 'postid',
          success: function (_postid) {
            if (t.data.replenish == '0') {
              t.setData({
                replenish: '1',
              })
              //上传音频
              wx.uploadFile({
                url: getApp().data.services + "api/interview/storeaudiofile", //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                name: 'audio_file',
                header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
                formData: {
                  'profession_id': _postid.data,
                  'question_id': t.data.question.id,
                  'audio_number': '1',
                  'audio_file': res.tempFilePath
                },
                success: function (_success) {
                  console.log('_success')
                  console.log(_success)
                  t.setData({
                    // 是否可以点击下一题
                    clickNext:true
                  })
                  var answer = {
                    question_id: t.data.question.id,//问题id
                    audio_file: JSON.parse(_success.data).data.audio_file,//保存音频文件时返回的文件名
                    audio_text: res.result,//	识别后的文本
                    audio_number: '1',//音频序号：默认为1，有多个时递增；用于标记音频顺序
                    question_no: t.data._index,//回答顺序编号：问题标题前的序号
                    duration:t.data.time//回答时长
                  };
                  // answer.audio_file = JSON.parse(_success.data).data.audio_file;
                  // answer.audio_text = res.result;
                  answerArr.push(answer)
                  wx.setStorage({
                    key: 'answerArr',
                    data: answerArr,
                  })
                  console.log('这里这里1')
                  
                  console.log(answer)
                  console.log(answerArr)
                  console.log(t.data.replenish)
                  console.log(t.data.isanimation)
                },
                fail: function (res) {
                  t.setData({
                    // 是否可以点击下一题
                    clickNext: false
                  })
                  wx.showToast({
                    title: '上传失败啦',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            } else if (t.data.replenish == '1') {
              t.setData({
                replenish: '2',
                min:'00',
                secs:'00',
                clickNext: false
              })
              //上传音频
              wx.uploadFile({
                url: getApp().data.services + "api/interview/storeaudiofile", //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                name: 'audio_file',
                header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
                formData: {
                  'profession_id': _postid.data,
                  'question_id': t.data.question.id,
                  'audio_number': '2',
                  'audio_file': res.tempFilePath
                },
                success: function (_success) {
                  t.setData({
                    // 是否可以点击下一题
                    clickNext: true
                  })
                  var answer = {
                    question_id: t.data.question.id,//问题id
                    audio_file: JSON.parse(_success.data).data.audio_file,//保存音频文件时返回的文件名
                    audio_text: res.result,//	识别后的文本
                    audio_number: '2',//音频序号：默认为1，有多个时递增；用于标记音频顺序
                    question_no: t.data._index,//回答顺序编号：问题标题前的序号
                    duration: t.data.time//回答时长
                  };
                  answerArr.push(answer)
                  wx.setStorage({
                    key: 'answerArr',
                    data: answerArr,
                  })
                  console.log('这里这里2')
                  console.log(answer)
                  console.log(answerArr)

                },
                fail: function (res) {
                  t.setData({
                    // 是否可以点击下一题
                    clickNext: false
                  })
                  wx.showToast({
                    title: '上传失败啦',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }else{
              t.setData({
                // 是否可以点击下一题
                clickNext: true,
                replenish: '2'
              })
              console.log("replenish=3")
            }
          }
        })
      }else{
        // wx.showToast({
        //   title: '你说什么？我没听清楚，请再说一遍',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.showModal({
          // title: '提示',
          content: '你说什么？我没听清楚，请再说一遍',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              // manager.stop();
            }
          }
        })
      }
    }
    // 识别开始事件
    manager.onStart = function (res) {
      console.log("开始")
      console.log(res)
      t.setData({
        isrecord:true
      })
    }
    // 录制音频错误
    // 识别错误事件
    manager.onError = (res) => {
      console.log(res)
      if (res.retcode == '-30011') {
        console.log("00000")
        manager = plugin.getRecordRecognitionManager()
      }
      wx.showModal({
        title: '提示',
        content: res.retcode + '录音出错啦~请重新录制',
        showCancel: false,
        success:function(res){
          
          manager = {};
          clearInterval(timeCount);
          t.setData({
            replenish: t.data.replenish,
            min: '01',
            secs: '00',
            isanimation: false,
            onstatus: false
          })
        }
      })
    }
  },
// 封装请求获取面试题
getQuestionFun:function(){
  var t = this;
  wx.getStorage({
    key: 'token',
    success: function (_token) {
      t.setData({
        token: _token.data
      })
      wx.getStorage({
        key: 'postid',
        success: function (_postid) {
          // 获取指定职业的面试题
          common.nRequest(
            getApp().data.services + "api/interview/getinterviewquestion",
            {
              id: _postid.data
            },
            function (res) {
              if (getApp().data.Reg.test(res.statusCode)) {
                // console.log("这里1")
                // console.log(res)
                if (res.data.data.length > 0) {
                  t.setData({
                    questionList: res.data.data,
                    question: res.data.data[0],
                    _index: 1,
                    // min: parseInt(res.data.data[0].time_limit) / 60 < 10 ? "0" + parseInt(res.data.data[0].time_limit) / 60 : parseInt(res.data.data[0].time_limit) / 60
                  })
                } else {
                  wx.showToast({
                    title: '不好意思，暂时没有测试题哟~',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
            function () {
              console.log('系统错误')
            }
          );
        },
      })
    },
    fail: function () {
      wx.showToast({
        title: '必须授权登录后才能参与面试哟~',
        icon: 'none',
        duration: 2000
      })
    }
  })
},
  // 录音
  mikeFun: function () {
    var t = this;
    var manager = plugin.getRecordRecognitionManager();
    if (t.data.replenish == '2'){
      wx.showToast({
        title: '每道题只能答两次哟~',
        icon: 'none',
        duration: 2000
      })
    }else{
      // console.log(t.data.onstatus)
      if (!t.data.onstatus) {//录音开始
        console.log("2")
        // recorderManager.start(options)
        manager.start({ duration: 60000, lang: "zh_CN" })
        t.setData({
          isanimation: true,
          onstatus: !t.data.onstatus,
          
        })
        // 倒计时
        var secs = parseInt(t.data.secs);
        var min = parseInt(t.data.min);
        timeCount = setInterval(function () {
          if (secs <= 0) {
            min--;
            secs = 59;
            t.setData({
              min: Math.floor(min) < 10 ? '0' + min : min,
              secs: 59
            })
            if (min < 0) {
              clearInterval(timeCount);
              t.setData({
                min: '01',
                secs: '00',
                onstatus: !t.data.onstatus,
                isanimation: false
              })
              // 倒计时结束，停止录音
              // manager.stop();
              t.setData({
                time:60
              })
            }
          } else {
            secs--;
            t.setData({
              secs: Math.floor(secs) < 10 ? '0' + secs : secs
            })
            // clearInterval(timeCount);
          }
        }, 1000)
      } else {//录音结束
      console.log("3")
        manager.stop();
        clearInterval(timeCount);
        t.setData({
          isanimation: false,
          onstatus: !t.data.onstatus,
          time: 60 - parseInt(t.data.secs),
          min:'01',
          secs:'00',
          // 是否可以点击下一题
          clickNext: false
          // replenish: '1',
        });
        // recorderManager.stop();
        
        // 暂停，跳到下一题
      }
    }
  },
  // 下一题
  nextQuestion:function(){
    var t = this;
    if(t.data.clickNext){
      if (t.data.isanimation) {
        wx.showToast({
          title: '请点击结束本次录音再答下一题~',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (t.data._index + 1 <= t.data.questionList.length) {
          t.setData({
            _index: t.data._index + 1,
            question: t.data.questionList[t.data._index],
            replenish: '0',
            min: '01',
            secs: '00',
          })
        } else {
          if (t.data.audioList.length > 0) {
            wx.redirectTo({
              url: '../afs/afs?iscode=1',
            })
          } else {
            wx.showToast({
              title: '您一道题都没有回答，没有可查看的面试结果哟~',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    }else{
      wx.showToast({
        title: '还没上传完录音文件，请稍后点击',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 页面退出的时候
  onUnload:function(){
    console.log('true0')
    if (this.data.isrecord){
      console.log('true1')
      manager.stop()
    }
    manager = {}
    this.setData({
      replenish: '0',
      clickNext: false,
      _index: 1,//题目序号
      onstatus: false,
      isanimation: false,
    })
  }
})
// [
//   {
//     question_id: '1',
//     audio_file:'',
//     audio_text:'',
//     audio_number:'1',
//     question_no:'1',
//   },
//   {
//   question_id: '1',
//   audio_file: '',
//   audio_text: '',
//   audio_number: '2',
//   question_no: '1',
//   },
//   {
//   question_id: '2',
//   audio_file: '',
//   audio_text: '',
//   audio_number: '1',
//   question_no: '2',
//   }
// ]