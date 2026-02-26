import React from 'react'


const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <div>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>
                {todo.text}
            </span>
            <button
                onClick={() => onDelete(todo.id)}>
                삭제
            </button>
        </div>
    )
}

export default TodoItem