function saveData(data){
    if(window.localStorage){
        localStorage.setItem("todoData",JSON.stringify(data))
    }
}

const app = Vue.createApp({
    data() {
        return {
            newTodoText: '',
            todos: [],
            nextTodoId: 1,
        }
    },
    mounted(){ //挂载后读取localStorage的数据
        if(window.localStorage){
            var todoData = localStorage.getItem("todoData")
            if(todoData!=null){
                var data = JSON.parse(todoData)
                this.nextTodoId+=data.length
                for(i=0;i<data.length;i++){
                    var tmp = data[i]
                    if(tmp['id']>=this.nextTodoId){ //防止出现相同ID
                        this.nextTodoId=tmp['id']+1
                    }
                    this.todos.push({
                        id: tmp['id'],
                        title: tmp['title']
                    })
                }
            }
        }else{
            this.newTodoText = "[警告]  浏览器不支持localSotrage，todoList无法保存"
        }
    },
    methods: {
        addNewTodo(){
            //防止出现一个bug
            var tmp = document.getElementsByTagName("A")
            for(i=0;i<tmp.length;i++){
                tmp[i].style.display="none"
            }
            var tmp = this.newTodoText
            tmp = tmp.replace(/\ +/g,"");
            tmp = tmp.replace(/[\r\n]/g,"");
            if(tmp.length ==0){
                alert("你的计划难道就是空的吗？")
                return
            }
            this.todos.push({
                id: this.nextTodoId++,
                title: this.newTodoText,
            })
            this.newTodoText = ''
            saveData(this.todos)
        },
        clear(){
            if(window.confirm("确定清空全部待办事项？")){
                this.todos.splice(0,this.todos.length)
                localStorage.removeItem("todoData")
                this.nextTodoId=0; //刷新id记录
            }
        },
        remove(index){
            if(window.confirm("确定删除待办事项:「"+this.todos[index].title+"」？")){
                this.todos.splice(index,1)
                saveData(this.todos)
            }
        },
        showModifyControl(){
            var tmp = document.getElementsByTagName("A")
            for(i=0;i<tmp.length;i++){
                tmp[i].style.display=tmp[i].style.display=="none"?"inline":"none"
            }
        },
        modify(index){
            var newTitle = prompt("请输入新的待办事项",this.todos[index].title)
            if(newTitle!=null && newTitle!=""){
                this.todos[index].title=newTitle
                saveData(this.todos)
            }
        }
    }
})

app.component('todo-item', {
    template: `
            <label class="list-group-item">
            <input class="form-check-input me-1" type="checkbox" style="display:none;"/>
                {{ title }}
                <button type="button" class="btn-close" aria-label="Close" style="float:right;" v-on:click="$emit('remove')">
                </button>
                <a href="#" style="float:right;display:none;" v-on:click="$emit('modify')">编辑</a>
            </label>
            `,
    props: ['title','id'],
    emits: ['remove','modify']
})
app.mount('#mainApp')