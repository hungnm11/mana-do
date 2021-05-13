import React, { useEffect, useReducer, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './todo.css';
import reducer, { initialState } from '../../store/reducer';
import {
  setTodos,
  createTodo,
  deleteTodo,
  toggleAllTodos,
  deleteAllTodos,
  updateTodoStatus,
  editTodos,
} from '../../store/actions';
import Service from '../../service';
import { TodoStatus } from '../../models/todo';
import { isTodoCompleted } from '../../utils';

type EnhanceTodoStatus = TodoStatus | 'ALL';

const ToDoPage = ({ history }: RouteComponentProps) => {
  const [{ todos }, dispatch] = useReducer(reducer, initialState);
  const [showing, setShowing] = useState<EnhanceTodoStatus>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);
  const [toggle, setToggle] = useState<Boolean>(false);
  const [getIdEl, setIdEl] = useState('');
  const [text, setText] = useState('');
  const [isComponentVisible, setIsComponentVisible] = useState<Boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const resp = await Service.getTodos();
      dispatch(setTodos(resp || []));
    })();
    document.addEventListener('click', onClickOutside, true);

    return () => {
      document.removeEventListener('click', onClickOutside, true);
    };
  }, []);

  const onClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
      setToggle(false);
    }
  };

  const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      try {
        const resp = await Service.createTodo(inputRef.current.value);
        dispatch(createTodo(resp));
        inputRef.current.value = '';
      } catch (e) {
        if (e.response.status === 401) {
          history.push('/');
        }
      }
    }
  };

  const onUpdateTodoStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: string
  ) => {
    dispatch(updateTodoStatus(todoId, e.target.checked));
  };

  const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  const onDeleteAllTodo = () => {
    dispatch(deleteAllTodos());
  };

  const onToggleInput = (todoId: string, value: string) => {
    setToggle(true);
    setIdEl(todoId);
    setText(value);
  };

  const onHandleKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === 'Enter' && editRef.current) {
      try {
        const value: string = editRef.current?.value as string;
        setToggle(false);
        dispatch(editTodos(id, value));
      } catch (e) {
        if (e.response.status === 401) {
          history.push('/');
        }
      }
    }
  };

  const onHandleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setText(event.target.value);
  };

  const showTodos = todos.filter((todo) => {
    switch (showing) {
      case TodoStatus.ACTIVE:
        return todo.status === TodoStatus.ACTIVE;
      case TodoStatus.COMPLETED:
        return todo.status === TodoStatus.COMPLETED;
      default:
        return true;
    }
  });

  const activeTodos = todos.reduce(function (accum, todo) {
    return isTodoCompleted(todo) ? accum : accum + 1;
  }, 0);

  return (
    <div className='ToDo__container'>
      <div className='Todo__creation'>
        <input
          ref={inputRef}
          className='Todo__input'
          placeholder='What need to be done?'
          onKeyDown={onCreateTodo}
        />
      </div>
      <div className='ToDo__list'>
        {showTodos.map((todo, index) => {
          return (
            <div key={index} className='ToDo__item' ref={ref}>
              <input
                type='checkbox'
                checked={isTodoCompleted(todo)}
                onChange={(e) => onUpdateTodoStatus(e, todo.id)}
              />
              {!toggle && !isComponentVisible && (
                <span
                  onDoubleClick={(e) => {
                    onToggleInput(todo.id, todo.content);
                    setIsComponentVisible(true);
                  }}
                >
                  {todo.content}
                </span>
              )}

              {toggle && getIdEl === todo.id && isComponentVisible ? (
                <span>
                  <input
                    type='text'
                    value={text}
                    onChange={onHandleChange}
                    autoFocus
                    id={todo.id}
                    ref={editRef}
                    onKeyDown={(e) => onHandleKeyPress(e, todo.id)}
                  />
                </span>
              ) : (
                <span
                  onDoubleClick={(e) => {
                    onToggleInput(todo.id, todo.content);
                    setIsComponentVisible(true);
                  }}
                >
                  {isComponentVisible && todo.content}
                </span>
              )}

              <button
                className='Todo__delete'
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
      <div className='Todo__toolbar'>
        {todos.length > 0 ? (
          <input
            type='checkbox'
            checked={activeTodos === 0}
            onChange={onToggleAllTodo}
          />
        ) : (
          <div />
        )}
        <div className='Todo__tabs'>
          <button className='Action__btn' onClick={() => setShowing('ALL')}>
            All
          </button>
          <button
            className='Action__btn'
            onClick={() => setShowing(TodoStatus.ACTIVE)}
          >
            Active
          </button>
          <button
            className='Action__btn'
            onClick={() => setShowing(TodoStatus.COMPLETED)}
          >
            Completed
          </button>
          <button className='Action__btn' onClick={onDeleteAllTodo}>
            Clear all todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToDoPage;
