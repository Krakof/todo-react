import React, { Component } from 'react';
import './App.scss';
import TodoItem from "./components/TodoItem";

class App extends Component {
  constructor() {
      super();

      this.state = {
          todoList: [],
          idGeneric: 0,
          newTodo: '',
          focusedTodo: null // to do item that is currently being edited
      };

      this.ENTER_KEY = 13;

      this.removeTodo = this.removeTodo.bind(this);
      this.editTodo = this.editTodo.bind(this);
      this.cancelEdit = this.cancelEdit.bind(this);
      this.saveEdit = this.saveEdit.bind(this);
      this.toggle = this.toggle.bind(this);
  }

    //Set all todos done/undone
    toggleAll(e) {
        const status = e.target.checked;

        this.setState(state => {
            const todoList = state.todoList.map(todo => {
                todo.done = status;
                return todo
            });

            return {todoList}
        })
    }

    //Set single to do item as done/undone
    toggle(id) {
        this.setState(state => {
            let todoList = state.todoList.map(todo => {
                if (todo.id === id) {
                    todo.done = !todo.done;
                }

                return todo;
            });

            return {todoList}
        });
    }

    //set to state new todo value
    handleChange(e) {
        this.setState({newTodo: e.target.value})
    }

    //remove all done todos
    removeAllDone() {
      this.setState(state => {
          const todoList = state.todoList.filter(todo => {
              return !todo.done
          });

          return { todoList}
      })
    }

    addTodo(e = null) {

        if (e) {

            //checking if 'Enter' key  was pressed;
            if (e.keyCode !== this.ENTER_KEY) return;

            e.preventDefault();
        }

        //check if entered string is valid
        const title = this.isTodoEmpty(this.state.newTodo);

        if (!title) return;

        this.setState(state => {

            //push new to do item to todoList
            const todoList = [
                ...state.todoList,
                {
                    id: state.idGeneric, //set uniq id to new item
                    title,
                    done: false
                }];

            return {
                todoList,
                newTodo: '',
                idGeneric: state.idGeneric + 1
            }
        });
    }

    removeTodo(id) {

        this.setState(state => {
            let todoList = state.todoList.filter(todo => {
                return todo.id !== id;
            });

            return {
                todoList,
                focusedTodo: null
            }
        });
    }

    editTodo(todo) {
        this.setState({focusedTodo: todo});

    }

    cancelEdit() {
        this.setState({focusedTodo: null}); // reset focus
    }

    //update title for focused to do item
    saveEdit(title) {
        if (!this.state.focusedTodo) return;

        this.setState(state => {
            let todoList = state.todoList.map(todo => {
                if (todo.id === state.focusedTodo.id) {
                    todo.title = title;
                }

                return todo;
            });

            return {
                todoList,
                focusedTodo: null
            }
        });
    }

  isTodoEmpty(value) {
      return value.trim();
  }

    todoItems() {
      const list = this.state.todoList.map(todo => {
          return (
              <TodoItem
                  key={todo.id}
                  todo={todo}
                  isFocused={!!this.state.focusedTodo}
                  toggle={this.toggle}
                  remove={this.removeTodo}
                  edit={this.editTodo}
                  cancel={this.cancelEdit}
                  save={this.saveEdit}
              />
          )
      });

        return (
            <ul className={"list"}>
                {list}
            </ul>
        )
    }

  render() {
    const {todoList, newTodo} = this.state;
    //calc number of the completed to do items
    const completedNum = todoList.reduce((sum, todo) => {
            return todo.done ? sum + 1 : sum;
    }, 0);
    const list = this.todoItems();

    return (
      <div className="App">
        <div className="App-header">
            <h1>to do list</h1>
            <div className={"action " + (completedNum ? "" : "hide")}>
                <button
                    className={"btn clear"}
                    onClick={() => this.removeAllDone()}
            >Clear completed</button>
            </div>
        </div>
            <div className={"row new-todo"}>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input
                                type="checkbox"
                                disabled={!todoList.length}
                                checked={todoList.length && completedNum === todoList.length}
                                onChange={(e) => this.toggleAll(e)}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className={"form-control"}
                        placeholder={"What do you need to do?"}
                        value={newTodo}
                        onChange={(e) => this.handleChange(e)}
                        autoFocus={true}
                        onKeyDown={(e) => this.addTodo(e)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-outline-light btn--add btn--action"
                    disabled={!this.isTodoEmpty(newTodo)}
                    onClick={() => this.addTodo()}
                />
            </div>
            {list}
            <p>Please click on todo item to edit. Press 'Enter' to save or 'Esc' to cancel changes.</p>
      </div>
    )
  }
}

export default App;
