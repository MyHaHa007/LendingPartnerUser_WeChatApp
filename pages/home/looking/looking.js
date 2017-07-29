var QR = require("../../../utils/qrcode.js");
var app = getApp();
Page({
  data: {
    noLooking : 'none',
    showLooking : 'none',
    items : [],
    lists : [],  //选择要还的书本
    array : [],  //封面等信息
    text : '',
    book_id : '',
    Allchecked : false,
    checked : false,
    modalFlag : 'none',
  },
  onLoad: function (options) {
    var that = this;
    var token = app.globalData.base64.base;
    if(token){
      that.setData({
        noLooking: 'none',
        showLooking: 'block',
      })
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/library/borrowed',
        data : {

        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Basic ' + token
        }, 
        success : function(res){
          console.log(res.data);
          var borrowed = res.data.borrowed;
          if (borrowed.length == 0){
            that.setData({
              noLooking: 'block',
              showLooking: 'none',
              text: '您目前还没借阅任何书本！'
            })
          }
          else{
            that.setData({
              noLooking: 'none',
              showLooking: 'block',
              items: borrowed,
            })
            
          }
          console.log(that.data.items);          
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '需要登录才能进行以下操作，是否登录？',
        success : function(res){
          if(res.confirm){
             wx.redirectTo({
               url: '../../login/login',
             })
          }
          else{
            that.setData({
              noLooking: 'block',
              showLooking: 'none',
              text : '加载失败'
            })
          }
        }
      })
    }
  },
  checkboxselected : function(e){
    var lists = this.data.lists;
    var items = this.data.items;
    var Allchecked = this.data.Allchecked;
    if (Allchecked == false){
      this.setData({
        Allchecked : true,
        checked : true,
      })
      for(var i=0;i<items.length;i++){
        lists.push(items[i].book_id);
      }
    }
    else{
      this.setData({
        Allchecked: false,
        checked: false,
        lists: []
      })
    }
    console.log(this.data.lists)
  },
  submit : function(e){
    var that = this;
    var lists = that.data.lists;
    var token = app.globalData.base64.base;
    var str = '';
    var book;
    var lists = that.data.lists;
    for (var i = 0; i < lists.length; i++) {
      str = str + lists[i] + '&';
    }
    book = str.substring(0, str.length - 1);
    if (lists.length == 0){
      wx.showToast({
        title: '请选择您需要还的书本！',
        duration : 1000
      })
    }
    else{
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/library/return/',
        data : {
          book : book
        },
        method: 'PUT',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + token
        }, 
        success : function(res){
              // console.log(res.data);
              that.setData({
                modalFlag : 'block'
              })
              var url = book;
              var timer = setTimeout(() => {
                var size = that.setCanvasSize();
                var url = res.data.qcode_token;
                that.creatQRcode(url, 'canvas', size.w, size.h);
                clearTimeout(timer);
              }, 2000)
        },
        fail : function(res){
          console.log("11111111111111失败");
        }

      })
    }
},
  creatQRcode(url, canvasId, canvasWidth, canvasHeight) {
    QR.qrApi.draw(url, canvasId, canvasWidth, canvasHeight);
  },
  setCanvasSize() {
    var size = {};    //设size为一个对象
    var res = wx.getSystemInfoSync();
    var scale = 550 / 750;
    var width = res.windowWidth * scale;   //获取分辨率
    var height = width;
    size.w = width;
    size.h = height;
    return size;   //返回一个size对象
  },
  contentClick : function(e){
    console.log(e);
    var that = this;
    var items = that.data.items;
    var lists = that.data.lists;
    that.setData({
      lists : e.detail.value
    })
    if (e.detail.value.length != items.length) {
      this.setData({
        Allchecked: false
      })
    }
    else {
      this.setData({
        Allchecked: true,
      })
    }
    console.log(that.data.lists);
  },
  modalOk: function () {
    var that = this;
    that.setData({
      modalFlag: 'none'
    })
    that.onLoad();
  },
})