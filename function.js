var btnAdd = document.getElementById("btnAdd")
var btnCleanAll = document.getElementById("btnCleanAll")
var addReturn = document.getElementById("addReturn")
var divShow = document.getElementById("divShow")
var numList = document.getElementById("num")
var showModify = document.getElementById("showModify")
var textModify = document.getElementById("textModify")
var btnModify = document.getElementById("btnModify")

function giveMessage(element,message){ //推送框框
    element.innerHTML=`<div class="alert alert-primary alert-dismissible fade show" role="alert">`+message+`<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`+element.innerHTML
}

function showModifyControl(){ //显示隐藏编辑链接
    var tmp = document.getElementsByTagName("A")
    for(i=0;i<tmp.length;i++){
        tmp[i].style.display=showModify.checked?"inline":"none"
    }
}

function showTodoList(){ //显示列表
    showModify.checked = false //防止一个bug的出现
    divShow.innerHTML=``
    var tmp;
    var keylist=new Array(1024)
    for(i=0;i<localStorage.length;i++){
        keylist[i] = localStorage.key(i)
    }
    keylist.sort(function(n1,n2){
        return n2-n1;
    })
    for(i=0;i<localStorage.length;i++){
        var key = keylist[i]
        tmp=JSON.parse(localStorage.getItem(key))
        divShow.innerHTML+=`<label class="list-group-item"><input class="form-check-input me-1" type="checkbox" value=""`+(tmp['done']?` checked="checked"`:``)+` onclick="doneTodoThings(this)" name="`+key+`">`+tmp['data']+`<button type="button" class="btn-close" aria-label="Close" style="float:right;" onclick="deleteTodoThings(this)" name="`+key+`"></button><a href="#" style="float:right;display:none;" data-bs-toggle="modal" data-bs-target="#windowModify" key="`+key+`">编辑</a></label>`
        //感觉这段可以更优雅一点？直接插入是不是有点暴力了感觉
    }
    num.innerHTML = ""+localStorage.length
}

function doneTodoThings(element){ //已完成
    var key = element.name
    tmp=JSON.parse(localStorage.getItem(key))
    tmp['done']=element.checked?true:false
    localStorage.setItem(key,JSON.stringify(tmp))
}

function deleteTodoThings(element){ //删除
    var key = element.name
    tmp=JSON.parse(localStorage.getItem(key))
    if(window.confirm("确定删除待办事项:「"+tmp['data']+"」？")){
        localStorage.removeItem(key)
        showTodoList()
    }
}

function addTodoThings(message){ //添加
    var data={}
    var timestamp = new Date().getTime();
    data['done']=false
    data['data']=message
    data['timestamp']=timestamp
    localStorage.setItem(timestamp,JSON.stringify(data))
}

btnAdd.onclick = function(){ //添加按钮
    if(localStorage.length>100){
        giveMessage(addReturn,"亲爱的打工人，你要做的事情真的这么多吗？")
        return
    }
    var textarea = document.getElementById("textareaAdd")
    tmp = textarea.value
    tmp = tmp.replace(/\ +/g,"");
    tmp = tmp.replace(/[\r\n]/g,"");
    if(tmp.length ==0){
        giveMessage(addReturn,"内容为空你是想干嘛？")
        return
    }
    if(!window.localStorage){
        giveMessage(addReturn,"浏览器不支持localStorage，TodoList无法实现")
        return
    }
    addTodoThings(textarea.value)
    giveMessage(addReturn,"新增一条待办事项成功~~打工人请继续加油~~")
    showTodoList()
    textarea.value=""
}

btnCleanAll.onclick = function(){ //清空按钮
    if(window.confirm("确定清空列表？")){
        localStorage.clear()
        showTodoList()
    }
}

//编辑链接监听
var windowModify = document.getElementById('windowModify')
var keyNow = 0
windowModify.addEventListener('show.bs.modal', function (event) {
    keyNow = event.relatedTarget.getAttribute('key')
    var data = JSON.parse(localStorage.getItem(keyNow))
    textModify.value = data['data']
})

btnModify.onclick = function(){
    tmp = textModify.value
    tmp = tmp.replace(/\ +/g,"");
    tmp = tmp.replace(/[\r\n]/g,"");
    if(tmp.length ==0){
        giveMessage(addReturn,"更新待办事项失败了..因为:内容为空")
        return
    }
    var data = JSON.parse(localStorage.getItem(keyNow))
    if(data['data']==textModify.value){
        giveMessage(addReturn,"更新待办事项失败了..因为:与原内容一致")
        return
    }
    data['data'] = textModify.value
    localStorage.setItem(keyNow,JSON.stringify(data))
    showTodoList()
    giveMessage(addReturn,"更新待办事项成功了!!那就继续努力呀!")
}