<template>
  <div class="todo-wrapper">
    <section class="todoapp">
      <header class="header">
        <h4>todoList</h4>
        <input type="text"
          class="new-todo" 
          placeholder="What need to be done" 
          v-model="newTodo" 
          @keyup.enter="addTodo">
      </header>
      <section class="main" > 
        <input type="checkbox" class="toggle-all" v-model="allDone" v-show="todos.length">
        <ul class="todo-list">
          <li class="todo" 
            v-for="todo in filtertodos"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }"
          >
            <div class="view">
              <input type="checkbox" class="toggle" v-model="todo.completed">
              <label @dblclick="editTodo(todo)">{{todo.title}}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input type="text" class="edit"
              v-model="todo.title"
              v-todo-focus="todo === editedTodo"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            >
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length">
        <span class="todo-count">
          {{remaining}} {{remaining | pluralize}}left
        </span>
        <ul class="filter">
          <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
          <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
          <li><a href="#/completed" :class="{ selected: visibility == 'completed'}">Completed</a></li>
        </ul>
        <button class="remove-completed" @click="removeCompleted"
        >Clear Completed</button>
      </footer>
    </section>
  </div>
</template>

<script>

var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
var filters= {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter(todo => {
      return !todo.completed
    })
  },
  completed(todos) {
    return todos.filter( todo => {
      return todo.completed
    })
  }
}
export default {
  name: 'todoList',
  data() {
    return {
      todos:todoStorage.fetch(),
      newTodo: '',
      editedTodo: null,
      visibility:'all'
    }
  },
  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
  },
  computed: {
    filtertodos(){
        return filters[this.visibility](this.todos) 
    },
    remaining() {
      return filters.active(this.todos).length;
    },
    allDone: {
      get() {
        return this.remaining === 0;
      },
      set (value) {
        this.todos.forEach(todo => {
          todo.completed = value;
        })
      }
    }
  },
  filters: {
    pluralize:function(n) {
      return n === 1? ' item ':' items '
    }
  },
  watch: {
    todos: {
      handler(todos) {
        todoStorage.save(todos)
      },
      deep:true,
    }
  },
  methods:{
    onHashChange () {
      var visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },
    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      if(!value) {
        return
      }
      this.todos.push({
        id:todoStorage.uid++,
        title:value,
        completed:false,
      })
      this.newTodo = ''

    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo),1)
    },
    editTodo(todo){
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },
    doneEdit(todo) {
      if(!this.editedTodo) {
        return 
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if(!todo.title) {
        this.removeTodo(todo);
      }
    },
    // 键盘的esc键退出时的操作
    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    removeCompleted() {
      this.todos = filters.active(this.todos);
    },
  },
  directives: {
    'todo-focus': function (el,binding) {
      if(binding.value) {
        el.focus();
      }
    }
  }
}
</script>

<style lang='scss'>
  input[type=checkbox] {
    cursor: pointer;
    font-size: 14px;
    width: 20px;
    height: 17px;
    position: relative;
    -webkit-appearance: none;
    appearance: none;
  }
  
  input[type=checkbox]:after {
    position: absolute;
    width: 18px;
    height: 22px;
    top: 0px;
    content: " ";
    color: #fff;
    display: inline-block;
    visibility: visible;
    padding: 0px 2px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
  }
  
  input[type=checkbox]:checked:after {
    content: "✓";
    font-size: 16px;
    font-weight:600;
    color: #36AEFF;
    text-align: center;
  }
  li {
    list-style: none;
  }
  button {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-weight: inherit;
    color: inherit;
    outline: none;
  }
  .todo-wrapper {
    max-width: 520px;
    margin: 0 auto;
    font-weight: 300;
    .todoapp {
      background: #fff;
      margin: 140px 0px 40px 0px;
      position: relative;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2),
                  0 25px 50px 0 rgba(0,0,0,0.1);
      input {
        outline: none;
      }
      input::-webkit-input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }
      input::-moz-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }
      input::placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }
      h4 {
        position: absolute;
        top: -150px;
        width: 100%;
        font-weight: 600;
        font-size: 40px;
        text-align: center;
        color: rgba(175,47,47,0.15);
        text-rendering: optimizeLegibility;
      }
    }
    .new-todo, .edit {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-weight: inherit;
      line-height: 32px;
      border: 0;
      color: inherit;
      padding: 6px;
      border: 1px solid #999;
      box-shadow: inset 0 -1px 5px 0 rgba(0,0,0,0.2);
      box-sizing: border-box;
    } 
    .new-todo {
      padding: 16px 16px 16px 60px;
      border: none;
      background: rgba(0,0,0,0.003);
      box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);;
    }
    .main {
      position: relative;
      z-index: 2;
      border-top: 1px solid #e6e6e6;
      .toggle-all {
        position: absolute;
        top: -47px;
        left: 15px;
        
      }
      .todo-list {
        margin: 0;
        padding: 0;
        list-style: none;
        li {
          position: relative;
          font-size: 22px;
          border-bottom: 1px solid #ededed;
          label {
            width: 70%;
            white-space: pre-line;
            word-break: break-all;
            padding: 15px 60px 15px 15px;
            display: inline-block;
            line-height: 30px;
            transition: color 0.4s;
          }
          
          .toggle {
            margin-left: 20px;
          }
          .view {
            .destroy {
              display: none;
              position: absolute;
              top: 0;
              right: 10px;
              bottom: 0;
              width: 40px;
              height: 40px;
              margin: auto 0;
              font-size: 30px;
              margin-bottom: 11px;
              color: #cc9a9a;
              transition: color 0.2s ease-out;
              &:hover {
                color: #af5b5e;
              }
              &:after {
                content: '×';
              }
            }
          } 
        }
        li:hover {
          .view {
            .destroy{
            display: block;
          }
          }
        }
        .completed label {
            text-decoration: line-through;
            color: #d9d9d9;
        }
        li:last-child {
          border-bottom: none;
        }
        .editing {
          border-bottom: none;
          padding: 0; 
          .edit {
            display: block;
            width: 477px;
            padding: 13px 17px 12px 17px;
            margin: 0 0 0 43px;
          }
          .view {
            display: none;
          }
        }
      }
    }
    .edit {
      display: none;
    }
    .footer {
      color: #777;
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      border-top: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-between;
      .filter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        li {
          margin-right: 20px;
          a {
            color: inherit;
            // margin: 3px;
            // padding: 3px 7px;
            text-decoration: none;
            border: 1px solid transparent;
            border-radius: 3px;
          }
          .selected,&:hover {
            border-color: rgba(175,47,47,0.15);
          }
        }
      }
      .remove-completed:active {
        text-decoration: none;
      }
      .remove-completed:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  
</style>