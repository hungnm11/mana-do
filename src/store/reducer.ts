import { Todo, TodoStatus } from '../models/todo';
import {
  AppActions,
  CREATE_TODO,
  DELETE_ALL_TODOS,
  DELETE_TODO,
  SET_TODO,
  TOGGLE_ALL_TODOS,
  UPDATE_TODO_STATUS,
  EDIT_TODOS,
} from './actions';

export interface AppState {
  todos: Array<Todo>;
}

const list = JSON.parse(localStorage.getItem('todo-list') || '[]');

export const initialState: AppState = {
  todos: [],
};

function reducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case SET_TODO:
      return {
        ...state,
        todos: action.payload,
      };
    case CREATE_TODO:
      list.push(action.payload);
      localStorage.setItem('todo-list', JSON.stringify(list));
      // state.todos.push(action.payload);

      return {
        ...state,
        todos: list,
      };

    case UPDATE_TODO_STATUS:
      const index2 = list.findIndex(
        (todo: { id: string }) => todo.id === action.payload.todoId
      );
      list[index2].status = action.payload.checked
        ? TodoStatus.COMPLETED
        : TodoStatus.ACTIVE;
      localStorage.setItem('todo-list', JSON.stringify(list));
      return {
        ...state,
        todos: list,
      };

    case EDIT_TODOS:
      const index3 = list.findIndex(
        (todo: { id: string }) => todo.id === action.payload.todoId
      );
      list[index3].content = action.payload.content;
      localStorage.setItem('todo-list', JSON.stringify(list));
      return {
        ...state,
        todos: list,
      };

    case TOGGLE_ALL_TODOS:
      const tempTodos = state.todos.map((e) => {
        return {
          ...e,
          status: action.payload ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
        };
      });

      return {
        ...state,
        todos: tempTodos,
      };

    case DELETE_TODO:
      const index1 = list.findIndex(
        (todo: { id: string }) => todo.id === action.payload
      );
      list.splice(index1, 1);
      localStorage.setItem('todo-list', JSON.stringify(list));

      return {
        ...state,
        todos: list,
      };
    case DELETE_ALL_TODOS:
      const del =
        (list != null &&
          localStorage.setItem('todo-list', JSON.stringify([]))) ||
        [];
      return {
        ...state,
        todos: del,
      };
    default:
      return state;
  }
}

export default reducer;
