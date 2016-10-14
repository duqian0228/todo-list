$(function(){
    var add_input=$(".add");
    var add_item=$(".add-box .button");
    var inners=$(".inner-contents");
    var input=$("input");

    var todos=[];
    var com="";
    if(localStorage.table){
        todos=JSON.parse(localStorage.table);
        $.each(todos,function(i,v){
            creatItem(v.title);
        });
    }else{
        localStorage.table=JSON.stringify(todos);
    }
    add_input.on("click",function(){
        $(this).addClass("add-none").removeClass("add-show");
        $(".add-list").removeClass("add-list-none").addClass("add-list-show");
    });
    add_item.on("click",function(){
        add_input.removeClass("add-none").addClass("add-show");
        $(".add-list").removeClass("add-list-show").addClass("add-list-none");
       input[0].value="";
    });
    input.on("blur",function(){
        var value=input[0].value;
        todos.push({
            title:value,
            state:0,
            isDel:0,
            com:"complete",
            del:"icon-guanbigongjulan"
        });
        localStorage.table=JSON.stringify(todos);
        creatItem(value);
    });
    function creatItem(value){
        $('<li class="inner-content item icon-font"><div class="icon-font icon-jishiben"></div><div class="title">'+value+'</div></li>').appendTo(".inner-contents")
    }
    var left=null;
    inners.on("touchstart",".inner-content",function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });
    inners.on("touchend",".inner-content",function(e){
        var move_left=e.originalEvent.changedTouches[0].pageX;
        var x=move_left-left;
        var index=$(this).closest(".inner-content").index();
        // var complete=todos[index].com;
        // var del=todos[index].del;
        if(x>40 && move_left>0){
            $(this).css({"transition":"transform .8s ease","transform":"translate3d("+x+"px,0,0)"})
                .delay(800)
                .queue(function(){
                    $(this)
                        .addClass("complete")
                        .css({"transition":"transform .4s ease","transform":"translate3d(0,0,0)"})
                        .dequeue();
                })
        }
        if(x<-40){
            $(this).css({"transition":"transform .8s ease","transform":"translate3d("+x+"px,0,0)"})
                .delay(800)
                .queue(function(){
                    $(this)
                        .removeClass("complete")
                        .addClass("icon-guanbigongjulan")
                        .css({"transition":"transform .4s ease","transform":"translate3d(0,0,0)"})
                        .dequeue();
                })
        }
    });
    inners.on("touchstart",".title",function(){
        var index=$(this).index();
        add_input.addClass("add-none").removeClass("add-show");
        $(".add-list").removeClass("add-list-none").addClass("add-list-show");
        input[0].value=$(this).text();
        input.on("blur",function(){
            todos[index].title=input[0].value;
            localStorage.table=JSON.stringify(todos);
        });
    });
    inners.on("touchstart",".inner-content",function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });
    inners.on("touchstart",".inner-content",function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });
    if(inners.find(".inner-content").length){
        $('<li class="inner-content delete-inner ">删除全部</li>').appendTo(".inner-contents")
    }
    //删除全部
    var delete_inner=$(".delete-inner");
    delete_inner.on("click",function(){
        $(".inner-content")
            .addClass("delete")
            .delay(800)
            .queue(function(){
                $(this).remove().dequeue();
            });
        todos=[];
        localStorage.table=JSON.stringify(todos);
    })
    inners.on("click",".icon-guanbigongjulan",function(){
        $(this).closest(".item").css({"transition":"transform .8s ease","transform":"translate3d(-100%,0,0)"})
            .delay(800)
            .queue(function(){
                $(this).remove().dequeue();
            });
        var index=$(this).closest(".item").index();
        todos.splice(index,1);
        localStorage.table=JSON.stringify(todos);
    })
});