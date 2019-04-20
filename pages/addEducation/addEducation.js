// pages/addEducation/addEducation.js 
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    dateedd: '',
    datePickerValueedd: ['', '', ''],
    datePickerIsShowedd: false,
    searchMajorList: [],//检索专业数组
    // postName: '',//岗位输入框的值
    listShow: false,//学历下拉框的显示
    workInfo: {},//修改工作经验的默认数据
    record:'',//学历
    isShow: false,
    isplay: app.globalData.isplay,
    datevalue: '',
    datevalue1: ''
  },
  schollFocus:function(){
    this.setData({
      listShow:false
    })
  },
  onShow: function () {
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },
  onReady: function () {
    //获得radio组件
    this.radio = this.selectComponent("#radio")
  },
  // 暂停事件
  _pauseEvent() {
    getApp().globalData.isplay = 'pause';
    this.radio.pausefun("pause");
  },
  // 播放事件
  _playEvent() {
    getApp().globalData.isplay = 'play';
    this.radio.playfun("play");
  },
  // 提交表单
  formSubmit: function (e) {
    var t = this;
    var formInfo = e.detail.value;
    console.log(formInfo)
    if (formInfo.school == '') {
      wx.showToast({
        title: '学校不能为空',
        icon: 'none',
        duration: 2000
      })
    }  
    else if (formInfo.record == ''){
      wx.showToast({
        title: '学历不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.starTime == '') {
      wx.showToast({
        title: '开始时间不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.eddTime == '') {
      wx.showToast({
        title: '结束时间不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      // var reg = /[\u4e00-\u9fa5]/g;
      // var reg = /(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3'
      // var _starTime = formInfo.starTime;
      // var _endTime = formInfo.eddTime;
      var _starTime = t.data.datevalue;
      var _endTime = t.data.datevalue1; 
      // _starTime = _starTime.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3');
      // _endTime = _endTime.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3');
      // 获取token
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          // console.log(_starTime)
          wx.getStorage({
            key: 'edittype',
            success: function (_edittype) {
              console.log(_edittype)
              if (_edittype.data == 'add') {//添加
                console.log("添加工作经历")
                // 用户添加教育经历
                common.nRequest(
                  getApp().data.services + "api/user/addeduhistory",
                  {
                    school: formInfo.school,
                    major: formInfo.major,
                    education: formInfo.record,
                    start_time: _starTime,
                    end_time: _endTime,
                    description: formInfo.textarea
                  },
                  function (res) {
                    if (res.statusCode == app.data.status.s402) {
                      // console.log(res.data.data)
                      wx.navigateBack()
                      // wx.redirectTo({
                      //   url: '../editMaterial/editMaterial'
                      // })
                    }
                  },
                  "post",
                  { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
                  function () {
                    console.log('系统错误')
                  }
                );
              } else if (_edittype.data == 'change') {//修改
                // console.log("修改工作经历")
                // 用户修改教育经历
                common.nRequest(
                  getApp().data.services + "api/user/updateeduhistory",
                  {
                    id: t.data.workInfo.id,
                    school: formInfo.school,
                    major: formInfo.major,
                    education: formInfo.record,
                    start_time: _starTime,
                    end_time: _endTime,
                    description: formInfo.textarea
                  },
                  function (res) {
                    if (res.statusCode == app.data.status.s402) {
                      console.log(res.statusCode)
                      // wx.redirectTo({
                      //   url: '../editMaterial/editMaterial'
                      // })
                      wx.navigateBack()
                    }
                  },
                  "post",
                  { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
                  function () {
                    console.log('系统错误')
                  }
                );
              }
            },
          })
        }
      })
    }
  },
  // 选择学历
  selectRecord:function(){
    this.setData({
      listShow: !this.data.listShow
    })
  },
  selectRecordList:function(e){
    this.setData({
      record: e.currentTarget.dataset.val,
      listShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    wx.getStorage({
      key: 'editwork',
      success: function (_editwork) {
        console.log(_editwork.data)
        if (_editwork != '') {
          t.setData({
            workInfo: _editwork.data,
            record: _editwork.data.education,
            date: _editwork.data.start_time,
            dateedd: _editwork.data.end_time,
            datevalue: _editwork.data.start_time,
            datevalue1: _editwork.data.end_time
          })
        } else {
          t.setData({
            workInfo: {}
          })
        }
      },
    })
  },

// 开始时间插件方法
  showDatePicker: function (e) {
    this.setData({
      datePickerIsShow: true,
      listShow: false
    });
  },

  datePickerOnSureClick: function (e) {
    // console.log('datePickerOnSureClick');
    // console.log(e);
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
      datevalue: e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    });
  },

  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
  // 结束时间插件方法
  showDatePickeredd: function (e) {
    this.setData({
      datePickerIsShowedd: true,
      listShow: false
    });
  },

  datePickerOnSureClickedd: function (e) {
    this.setData({
      dateedd: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日`,
      datePickerValueedd: e.detail.value,
      datePickerIsShowedd: false,
      datevalue1: e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    });
  },

  datePickerOnCancelClickedd: function (event) {
    console.log('datePickerOnCancelClickedd');
    console.log(event);
    this.setData({
      datePickerIsShowedd: false,
    });
  },
})