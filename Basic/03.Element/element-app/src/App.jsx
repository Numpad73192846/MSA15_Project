import React, { Component } from 'react'
import './App.css'

// 클래스형 컴포넌트
class App extends Component {
  render() {
    // React 엘리먼트 생성
    // 1. React.createElement로 엘리먼트 생성
    const link = React.createElement('a', {
      href: 'https://www.google.com',
      target: '_blank',
      style: { color: 'blue' }
    }, '구글 사이트 바로 가기')

    const box = React.createElement('div', {
      className: 'box'
    }, 'Box')

    const element = React.createElement('div', null,
      React.createElement('h1', null, 'Hello Element'),
      React.createElement('p', null, 'this is an Element'),
      link,
      box
    )

    // 2. JSX로 엘리먼트 생성
    const element2 = (
      <div>
        <h1>Hello Element</h1>
        <p>this is an Element</p>
        <a href="https://www.google.com"
          target="_blank"
          style={{ color: 'red' }}>구글 사이트 바로 가기</a>
        <div className="box">Box</div>
      </div>
    )

    // element 또는 element2 중 하나를 반환합니다.
    return element2
  }
}

export default App
