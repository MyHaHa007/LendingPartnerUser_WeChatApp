// pages/book/book.js
var app = getApp();
var Base64 = require("../../utils/base64.modified.js");
var QR = require("../../utils/qrcode.js");
Page({
  data:{
    items: [],
    lists : [],
    bookname : '',
    bookmore : 11,
    radio : '全选',
    iconselected: 'circle',    
    editorselected : 'block',
    confirm : 'block',
    finished : 'none',
    cancle : 'none',   
    checked : false,
    Allchecked : false,
    image : '',
    title : '',
    author : '',
    summary : '',
    userInfo : '',
    base64 : '',
    shownodata : 'none',
    showdata: 'none',
    img: '',
    text : '',
    // checked : false,
    book_id : '',
    radioValue : 0,
    access_token : '',
    modalFlag : 'none',
    startX : '',
    del : '',
    witdh : '',
    txtStyle : '',
    delwidth : '180rpx',
    CurrentId : 1000,
    width : '',
   
  },
  onLoad:function(e){

    var that = this;  
wx.request({
  url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx6eaffe8de3c98785&secret=4bb2619cbb504add2e21c304d10b2d0f',
  method : 'GET',
  header : {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  success : function(res){
    console.log(res.data);
    that.setData({
      access_token: res.data.access_token
    })
  }
})
// ======================二维码======================================
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var userInfo = app.globalData.userInfo;
    var token = app.globalData.base64.base;
    console.log(token);
    that.setData({
      modalFlag: 'none'
    })
     if(!token){
    wx.showModal({
      title: '提示',
      content: '需要登录才能进行以下操作，是否登录？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
        }
        if (res.cancel) {
          that.setData({
            shownodata: 'block',
            showdata: 'none',
            img: '../images/tabbar/book/nobook.png',
            text: '加载失败'
          })
        }
      }
    })
  }
   else{
      that.setData({
        shownodata: 'none',
        showdata: 'block' 
      })
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/book_bar/',
        data: {

        },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + token
        },
        success: function (res) {
          console.log(res.data);
          var book_bar = res.data.book_bar;
          var book_bars = new Array();
          if(book_bar.length == 0 ){
             that.setData({
               img : '../images/tabbar/book/nobook.png',
               text : '你还没添加任何书单，赶快去添加吧~'
             })
          }
          else{         
            console.log(book_bars);
            for (var i = book_bar.length-1;i>=0;i--){
              book_bars.push(book_bar[i]);
            }
            that.setData({
              items : book_bars,
            })
          }
        }
      })
   }
  },

  empty : function(){
    wx.showModal({
      title: '提示',
      content: '确定清空书架吗？',
      success : function(res){
        if (res.confirm){
            console.log("确定");
          }
          else{
             console.log("取消");
          }
        
      }
    })
  },
  checkboxselected : function(e){
    var Allchecked = this.data.Allchecked;
    var items = this.data.items;
    var bookid = new Array();
    for(var i = 0;i<items.length;i++){
      bookid.push(items[i].book_id);
    }
    console.log(bookid);
    if(Allchecked==false){
       this.setData({
         checked : true,
         Allchecked : true,
         lists: bookid
       })
    }
    if (Allchecked == true){
      this.setData({
        checked: false,
        Allchecked: false,
        lists: []
      })
    }
  },

  contentClick : function(e){
    console.log(e);
    var lists = this.data.lists;
    var items = this.data.items;
    var Allchecked = this.data.Allchecked;
    this.setData({
      lists: e.detail.value, CurrentId : 1000
    })
    if (e.detail.value.length != items.length){
      this.setData({
        Allchecked: false
      })
    }  
    else{
      this.setData({
        Allchecked: true,
      })
    }     

  },
  submit : function(e){
    var that = this;
    var items = that.data.items;
    var lists = that.data.lists;
    console.log(lists);
    var token = app.globalData.base64.base;
    var str = '';
    var bookid;
    var listsMsg = JSON.stringify(lists);
    var access_token = that.data.access_token;
    // console.log(lists.replace(/"([^"]*)"/g, "'$1'"));
    var account = listsMsg.replace(/"([^"]*)"/g, "'$1'");  
   // console.log(account.replace(/\[|]/g, ''));
    var Postaccount = account.replace(/\[|]/g, '');
    for(var i =0;i<lists.length;i++){
      str = str +lists[i]+'&';
    }
    bookid = str.substring(0,str.length-1);
    if (lists.length == 0){
      wx.showToast({
        title: '请选择您需要借阅的书单！',
        duration : 1000
      })
    }
    else{
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/book_bar/',
        data: {
          book: bookid
        },
        method: 'PUT',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + token
        },
        success : function(res){
          // console.log(res.data);
          that.setData({
            modalFlag: 'block'
          })
  // ====================画二维码=====================================   
          var timer = setTimeout(() => {
            var size = that.setCanvasSize();
            var url = res.data.qcode_token;
            that.creatQRcode(url, 'canvas', size.w, size.h);
            clearTimeout(timer);
          }, 2000)
        }

      })    

         }
  },
  creatQRcode(url,canvasId,canvasWidth,canvasHeight){
    QR.qrApi.draw(url, canvasId, canvasWidth, canvasHeight);
  },
  setCanvasSize(){
    var size = {};    //设size为一个对象
    var res=wx.getSystemInfoSync();
    var scale = 550/750;
    var width = res.windowWidth * scale;   //获取分辨率
    var height = width;
    size.w = width;
    size.h = height;
    return size;   //返回一个size对象
  },
  modalOk : function(){
    var that = this;
    var items = that.data.items;
    that.setData({
      modalFlag : 'none'
    })
      that.onShow();
  },
  // =================左滑删除====================================
  
  handStart : function(e){
    console.log(e);
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    } 
  },
  handMove : function(e){
    console.log(e);
    var that = this;
    var items = that.data.items;
    var index = e.currentTarget.dataset.id;
    var id = e.currentTarget.id;
    var startX = that.data.startX;
    if (id){ 
      if (startX-e.touches[0].clientX>20){
        that.setData({
          CurrentId : id
        })
      }
      if (startX - e.touches[0].clientX < 0){
        that.setData({
          CurrentId: 1000
        })
      }
    }
      that.setData({
        items: items
      });
      
  },
  delItem : function(){
    var that = this;
    var items = this.data.items;
    var token = app.globalData.base64.base;
    var CurrentId = that.data.CurrentId;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success : function(res){
        if(res.confirm){
          wx.request({
            url: 'http://10.0.26.2:5000/api/v1.0/book_bar/' + items[CurrentId].book_id,
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Basic ' + token
            },
            success: function (res) {
              console.log(res.data);
              items.splice(CurrentId,1);   //移除列表中下标为index的项               
              that.setData({
                items : items
              })
            }
          })
        }
      }
    })
    
  }
})
