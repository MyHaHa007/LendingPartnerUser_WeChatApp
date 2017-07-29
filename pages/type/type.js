Page({
  data:{
    items: [],
    color : '',
    border : '',
    width : '',
    size : '',
    lists : [],
    object : '',
    color : '',
    currentId : 0,  
    keyword : '',
  },
  onLoad:function(e){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          scrollWidth: res.windowWidth
        })
      }
    })   

    wx.request({
      url: 'http://10.0.26.2:5000/api/v1.0/labels',
      data : {},
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success : function(res){
        console.log(res.data.class);
        that.setData({
          items: res.data.class, lists: res.data.class[0].sub_class,
          currentId  : 0
         })
      }
    })
  },
  onReady:function(){

  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  checkcolor : function(e){
    console.log(e);
    var index = e.currentTarget.id;
    console.log(index);
    var currentId = this.data.currentId;
    var items = this.data.items;
    var lists = this.data.lists;
     var object = this.data.object;
     if(index){
        this.setData({
          lists: items[index].sub_class,
          currentId: index
        })
     }   
  },
  content_type : function(e){
    var lists = this.data.lists;
    var index = e.currentTarget.id;
    var tag = lists[index];
    console.log(tag);
    wx.navigateTo({
          url: '../type/typeresult/typeresult?tag='+tag      
           });
  },
  // =================关键字查询========================
  inputClick : function(){
    wx.navigateTo({
      url: '../type/keyword/keyword',
    })
  }
})

