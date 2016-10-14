$(function(){
    var add_input=$(".add");
    var add_item=$(".add-box .button");
    var inners=$(".inner-contents");
    var input=$("input");
    var todos=[];
    var com="";
    if(localStorage.table){
        todos=JSON.parse(localStorage.table);
        creatItem();
    }else{
        localStorage.table=JSON.stringify(todos);
    }
    var left=null;
    inners.on("touchstart",".inner-content",function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });

    //鼠标左右移
    inners.on("touchend",".inner-content",function(e){
        var move_left=e.originalEvent.changedTouches[0].pageX;
        var x=move_left-left;
        var index=$(this).closest(".inner-content").index();
        // var complete=todos[index].com;
        // var del=todos[index].del;
        if(x>40 && move_left>0){
            $(this).css({"transition":"transform .8s ease","transform":"translate3d(40px,0,0)"})
                .delay(400)
                .queue(function(){
                    $(this).css({"transition":"transform .4s ease","transform":"translate3d(0,0,0)"})
                        .find(".icons").eq(1)
                        .addClass("complete")
                        .dequeue();
                })
        }
        if(x<-40){
            $(this).css({"transition":"transform .8s ease","transform":"translate3d(-40px,0,0)"})
                .delay(400)
                .queue(function(){
                    $(this).css({"transition":"transform .4s ease","transform":"translate3d(0,0,0)"})
                        .find(".icons").eq(1)
                        .removeClass("complete")
                        .addClass("icon-guanbigongjulan")
                        .dequeue();
                })
        }
    });
    //出现input框，失去焦点添加
    add_input.on("click",function(){
        $(this).addClass("add-none").removeClass("add-show");
        $(".add-list").removeClass("add-list-none").addClass("add-list-show");
    });
    input.on("blur",function(){
        var value=input[0].value;
        if(value){
            todos.push({
                title:value,
                state:0,
                isDel:0,
                com:"complete",
                del:"icon-guanbigongjulan"
            });
            localStorage.table=JSON.stringify(todos);
            creatItem(value);
        }
    });

    //添加单条记录
    add_item.on("click",function(){
        add_input.removeClass("add-none").addClass("add-show");
        $(".add-list").removeClass("add-list-show").addClass("add-list-none");
       input[0].value="";
        refresh();

    });

    function creatItem(){
        $.each(todos,function(i,v){
            $('<li class="inner-content item"><div class="icon-jishi icon-font icon-jishiben"></div><div class="title">'+v.title+'</div><div class="icons change icon-xiugai"></div> <div class="icons queding"></div></li>').appendTo(".inner-contents")
        });
    }

    //修改记录
    inners.on("touchstart",".change",function(){
        var index=$(this).closest("li").index();
        add_input.addClass("add-none").removeClass("add-show");
        $(".add-list").removeClass("add-list-none").addClass("add-list-show");
        input[0].value=$(this).prev(".title").text();
        input.on("blur",function(){
            todos[index].title=input[0].value;
            todos[index].state=1;
            localStorage.table=JSON.stringify(todos);

        });
    });

    //删除单条记录
    inners.on("click",".icon-guanbigongjulan",function(){
        $(this).closest(".item").css({"transition":"transform .8s ease","transform":"translate3d(-100%,0,0)"})
            .delay(800)
            .queue(function(){
                $(this).remove().dequeue();
            });
        var index=$(this).closest(".item").index();
        todos.splice(index,1);
        localStorage.table=JSON.stringify(todos);
        if(todos.length===0){
            refresh();
        }
    });

    //选中单条记录
    inners.on("click", ".icon-jishi",function(){
        $(this).toggleClass("icon-jishiben").toggleClass("icon-queding1");
        $(this).closest(".item").find(".queding").toggleClass("icon-guanbigongjulan");
    });

    //全选，删除全部记录
    $(".bianji").on("click",function(){
        if($(".icon-jishi").length===0){
            $(".bianji span").removeClass("quanxuan")
                .addClass("noquan").removeClass("active");
        }else{
            $(this).find("span").removeClass("noquan").toggleClass("quanxuan").toggleClass("active");
            $(".icon-jishi").toggleClass("icon-jishiben").toggleClass("icon-queding1");
            $(".icon-jishi").closest(".item").find(".queding").toggleClass("icon-guanbigongjulan");
            $('<li class="inner-content delete-inner ">删除全部</li>').appendTo(".inner-contents")
            $(".delete-inner").on("click",function(){
                $(".inner-content")
                    .addClass("delete")
                    .delay(400)
                    .queue(function(){
                        $(this).remove().dequeue();
                        $(".bianji").find("span").removeClass("quanxuan").removeClass("active").addClass("noquan");
                    });
                todos=[];
                localStorage.table=JSON.stringify(todos);
            })
        }
    });

    //刷新
    function refresh(){
        history.go(-0); //刷新
    }

    //调整全选的状态
    if(todos.length===0){
        $(".bianji span").removeClass("quanxuan")
            .addClass("noquan").removeClass("active");
    }else{
        $(".bianji span").removeClass("noquan").addClass("quanxuan");
    }
});