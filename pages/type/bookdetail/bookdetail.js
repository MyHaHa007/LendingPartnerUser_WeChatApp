// pages/bookdetail/bookdetail.js
var app = getApp();
Page({
  data:{
    lists : ['简介','目录','书评'],
    catalog : [],
    discuss : [],  //书评
    reviews : [],
     image : '',
     title : '',
     author : '',
     publisher : '',
     isbn : '',
     summary : '',
     options : '',
     currentId : '',
     showSummary : 'block',
     showAssess : 'none',
     showPreview : 'none',
     hidden : 'hidden',
     bookcatalog : '',
     firstcatalog : '',
     userImg : '',
     userDiscuss : '',
     sum : '',
     amount : '',
     show_nodiscuss : 'none',
     show_discuss : 'none',
     text : '',
     book_id : ''
  },
  onLoad:function(options){
     var that = this;
     var isbn13 = options.isbn13;
     
     console.log(isbn13);
    wx.request({
      url: 'https://api.douban.com/v2/book/isbn/' + isbn13,
      data: {
         
      },
      method: 'GET', 
      header: { 'content-type': 'json'}, 
      success: function(res){
        console.log(res.data);
        var data = res.data;
        //  var book = JSON.stringify(data.catalog);
        //  var catalog = book.split(/[\n]/);
        that.setData({
          image: data.image, title: data.title, author: data.author, publisher: data.publisher, pubdate: data.pubdate, summary: data.summary, isbn: options.isbn13,
           bookcatalog : data.catalog
        })
        
             }
    })
    wx.request({
      url: 'http://10.0.26.2:5000/api/v1.0/library/' + options.isbn13,
      data: {

      },
      method: 'GET',
      header: { 'content-type': 'json' },
      success: function (res) {
        console.log(res.data);
        if (res.data.amount == 0) {
          that.setData({
            book_id: '无', amount: 0, sum: 0
          })
        }
        if (res.data.amount != 0) {
          that.setData({
            book_id: res.data.library[0].book_id,
            amount: res.data.amount,
            sum: res.data.sum
          })
        }

      }
    })

  },
onShow : function(){
  var token = app.globalData.base64.base;
  var that = this;
  if(token){
    wx.request({
      url: 'http://10.0.26.2:5000/api/v1.0/reviews',
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'json',
        'Authorization': 'Basic ' + token
      },
      success: function (res) {
        if (res.data.user_reviews.length == 0) {
          that.setData({
            show_nodiscuss: 'block',
            show_discuss: 'none',
            text: '该书暂还没书评，赶快来坐沙发吧~'
          })
        }
        else {
          that.setData({
            show_nodiscuss: 'none',
            show_discuss: 'block',
            reviews: res.data.user_reviews
          })
        }
      }
  })
  }
},
  extendClick : function(e){
    var that = this;
    var options = this.data.options;
    var index = e.currentTarget.id;
    var currentId = this.data.currentId;
    that.setData({
       currentId : index
    })
    if(index==0){
      that.setData({
         showSummary : 'block',
         showAssess : 'none',
         showPreview : 'none'
       })
    }
    // 目录

    if(index==1){
      that.setData({
         showSummary : 'none',
         showPreview : 'block',
         showAssess : 'none'        
       })
         var catalog = JSON.stringify(this.data.bookcatalog);
        var bookcatalog = catalog.split('\\n');      
        console.log(bookcatalog);
        var catalogs = new Array();
        for(var i=1;i<bookcatalog.length;i++){
           var _first = bookcatalog[0].replace(/"/,"");
           var _last = bookcatalog[bookcatalog.length-1].replace(/"/,"");
           catalogs.push(bookcatalog[i]);
        }
        console.log(catalogs);
        bookcatalog[0] = _first;
        bookcatalog[bookcatalog.length-1] = _last;
        if(bookcatalog.length > 1){
          that.setData({
           catalog : catalogs,firstcatalog :  bookcatalog[0]
         })
       
       }
       else{
          that.setData({
         catalog : ['该书暂无目录！']
        })
       }
     
    }
        //书评
        if(index==2){
       
          that.setData({
         showSummary : 'none',
         showAssess : 'block',
         showPreview : 'none'        
       }) 
          var token = app.globalData.base64.base;
          if (token){
         wx.request({
           url: 'http://10.0.26.2:5000/api/v1.0/reviews',
           data: {

           },
           method: 'GET',
           header: {
             'content-type': 'json',
              'Authorization': 'Basic ' + token
            }, 
            success : function(res){
              console.log("书评：");
              console.log(res.data);
              var arr = new Array();
              for (var i = res.data.user_reviews.length - 1; i >= 0; i--) {
                arr.push(res.data.user_reviews[i])
              }
              console.log(arr);
              if (res.data.user_reviews.length == 0){
                that.setData({
                  show_nodiscuss: 'block',
                  show_discuss: 'none',
                  text : '该书暂还没书评，赶快来坐沙发吧~'
                })
              }
              else{
                that.setData({
                  show_nodiscuss: 'none',
                  show_discuss: 'block',
                  reviews: arr
                })

              }

            }
         })
       }
       else{
         wx.showModal({
           title: '提示',
           content: '需要登录才能进行以下操作，是否登录？',
           success : function(res){
             if(res.confirm){
               wx.navigateTo({
                 url: '../../login/login',
               })
             }
             if(res.cancel){
               that.setData({
                 show_nodiscuss: 'block',
                 show_discuss : 'none',
                 text : '加载失败'
               })
             }
           }
         })
       }

    }
  },
  firstcatalog : function(e){
    var isbn = this.data.isbn13;
     wx.request({
       url: 'https://api.douban.com/v2/book/isbn/:' + isbn,
       data: {

       },
       method: 'GET', 
       header: { 'content-type': 'json'}, 
       success: function(res){
        console.log(res.data);
       
       },
       fail: function(res) {
         // fail
       },
       complete: function(res) {
         // complete
       }
     })
  },
  book_book : function(e){
    var that = this;
    var token = app.globalData.base64.base;
    var isbn = that.data.isbn;
    console.log(isbn);
    if(token){
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/library/' + isbn,
        method: 'GET',
        header: {
          'content-type': 'json',
          'Authorization': 'Basic ' + token
        },
        success : function(res){
          console.log(res.data);
          var data= res.data;
          if (data.amount != 0){
            wx.request({
              url: 'http://10.0.26.2:5000/api/v1.0/book_bar/' + data.library[0].book_id,
              method: 'POST',
              header: {
                'content-type': 'json',
                'Authorization': 'Basic ' + token
              },
              success : function(res){
                   console.log(res.data);
                   wx.showToast({
                     title: '已加入借书栏！',
                   })
              }
            })
          }
         else{
             wx.showToast({
               title: '加入借书栏失败！',
             })
          }
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
          if(res.cancel){
            wx.showToast({
              title: '添加失败',
              duration : 2000
            })
          }
        }
      })
      
    }
   
   
  },
  submit : function(e){
    var that = this;
    var reviews = that.data.reviews;
    var discuss = e.detail.value.discuss;
    var token = app.globalData.base64.base;
    var isbn = that.data.isbn;
    var title = that.data.title;
    if (token){
      if (discuss != ''){
        wx.request({
          url: 'http://10.0.26.2:5000/api/v1.0/reviews/'+isbn,
          data: {
            title: title,
            reviews: discuss
          },
          method: 'POST',
          header: {
            'Content-Type': 'json',
            'Authorization': 'Basic ' + token
          },
          success: function (res) {
            console.log("提交成功") 
            console.log(res.data);
            that.setData({
              reviews: res.data.new_reviews,
            })
          },
          fail: function (res) {
            console.log("提交失败")
          }
        })
      }
    }
    else{
      wx.showModal({
        title: '提示',
        content: '需要登录才能进行以下操作，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../../login/login',
            })
          }
          if (res.cancel) {
            wx.showToast({
              title: '提交失败',
              duration: 2000
            })
          }
        }
      })
    }
  }
})