import React, { Component } from 'react'

class ClassComponent extends Component {

    constructor(props) {
        super(props);

        // 상태 정의
        this.state = {
            name: "Aloha",
        };
        // 이벤트 바인딩
        // : 컴포넌트 인스턴스에 클래스 메소드가 자동으로 바인딩 되지 않기 때문에
        //    this를 명시적으로 바인딩 해야한다.
        this.handleClickAloha = this.clickAloha.bind(this)
        this.handleClickJoeun = this.clickJoeun.bind(this)
    }

    // 이벤트 핸들러
    clickAloha() {
        console.log("Aloha Click!");
        // 상태 업데이트
        this.setState({ name: 'Aloha' });
    }

    clickJoeun() {
        console.log("Joeun Click!");

        // 상태 업데이트
        this.setState({ name: 'Joeun' });
    }


    render() {
        const { name } = this.state;
        return (
            <div>
                <h1>클래스 컴포넌트</h1>
                <h2>Hello I'm {name}</h2>
                <button onClick={this.handleClickAloha}>Aloha</button>
                <button onClick={this.handleClickJoeun}>Joeun</button>
            </div>
        )
    }
}


export default ClassComponent;