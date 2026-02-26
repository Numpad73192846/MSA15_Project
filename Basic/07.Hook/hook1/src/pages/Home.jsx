import React from 'react'
import { useState } from 'react'
import TodoItem from '../components/TodoItem'
import { useEffect } from 'react'

const Home = () => {
    // state  
    const [todoList, setTodoList] = useState(
        // 로컬스토리지에서 불러옴
        (() => {
            const svcTodoList = localStorage.getItem("todoList")
            return svcTodoList ? JSON.parse(svcTodoList) : []
        })()
    )

    // 할일 목록  
    const [text, setText] = useState("")       // 새로운 할 일 입력
    const [search, setSearch] = useState("")   // 검색어


    // 이벤트 핸들러
    // - 할일 완료 토글
    const handleToggle = (id) => {
        const newTodos = todoList.map(
            todo => todo.id === id
                ? { ...todo, completed: !todo.completed }
                : todo
        )
        // 상태 업데이트
        setTodoList(newTodos)
    }
    // - 할일 삭제
    const handleDelete = (id) => {
        const newTodos = todoList.filter(todo => todo.id !== id)
        // 상태 업데이트
        setTodoList(newTodos)
    }

    // 할일 추가
    const handleAdd = () => {
        // 입력 값이 없으면 추가 안함
        if (!text.trim()) return;

        const newTodos = [
            ...todoList,
            { id: Date.now(), text: text.trim(), completed: false }
        ]
        // 상태 업데이트
        setTodoList(newTodos)
        setText("")
    }
    // 할일 전체 개수와 완료된 개수
    const total = todoList.length;
    const completed = todoList.filter(todo => todo.completed).length;

    // 검색어가 포함된 할일 목록
    const searchedTodos = todoList.filter(todo =>
        // 리액트 복습하기 > includes("복습") > true
        // 리액트 복습하기 > includes("자바") > false
        todo.text.includes(search)
    );

    // useEffect(중요한 Hook)
    useEffect(() => {
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }, [todoList]) // todoList가 변경되면 first() 실행



    return (
        <div>
            <h1>Todo List 앱</h1>

            <input
                type="text"
                placeholder="할 일 입력"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleAdd}>추가</button>
            <br /><br />
            <input
                type="text"
                value={search}
                placeholder="검색어를 입력하세요."
                onChange={e => setSearch(e.target.value)}
            />
            <h3>전체 : {total} / 완료 {completed}</h3>

            {
                searchedTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))
            }
        </div>
    )
}

export default Home