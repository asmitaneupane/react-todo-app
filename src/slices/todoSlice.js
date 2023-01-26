//reducer
import { createSlice } from '@reduxjs/toolkit'

const getInitialTodo = () => {
    const localTodoList = window.localStorage.getItem
        ('todoList');
    if (localTodoList) {
        return JSON.parse(localTodoList);
    }
    //this removes the else part
    window.localStorage.setItem('todoList', JSON.stringify([]));
    return [];
}

const initialValue = {
    filterStatus: 'all',
    todoList: getInitialTodo(),
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState: initialValue,
    reducers: {
        addTodo: (state, action) => {
            state.todoList.push(action.payload);
            const todoList = window.localStorage.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                todoListArr.push({
                    ...action.payload,
                })
                window.localStorage.setItem('todoList',
                    JSON.stringify(todoListArr))
                console.log(todoListArr);
            }

            //if the localstorage is empty
            else {
                window.localStorage.setItem('todoList',
                    JSON.stringify([{ ...action.payload }]))
            }

        },
        deleteTodo: (state, action) => {
            const todoList = window.localStorage.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                todoListArr.forEach((todo, index) => {
                    if (todo.id === action.payload) {
                        todoListArr.splice(index, 1)
                    }
                });
                window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                state.todoList = todoListArr;
            }
        },
        updateTodo: (state, action) => {
            const todoList = window.localStorage.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                todoListArr.forEach((todo, index) => {
                    //now in our payload, we will also have id, title, and status
                    //hence we have to specify with which we want to get from the payload
                    if (todo.id === action.payload.id) {
                        //if the id is matched we will change the status so..
                        //same for the title
                        todo.title = action.payload.title;
                        todo.status = action.payload.status;
                    }
                });
                //setting back todo after updating
                window.localStorage.setItem('todoList',
                    JSON.stringify(todoListArr));
                //update state(redux state)
                state.todoList = todoListArr;
            }
        },
        updateFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        }
    }
})

export const { addTodo, deleteTodo, updateTodo, updateFilterStatus } = todoSlice.actions;
export default todoSlice.reducer;