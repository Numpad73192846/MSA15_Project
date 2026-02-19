import React from 'react'
import { useState } from 'react'

const Home = () => {
    // const view = "detail"
    // view 라는 이름의 상태 정의
    const [view, setView] = useState("detail")

    // 관련상품 리스트
    const productList = [
        { id: 1, name: "20인치 모니터", price: 100000 },
        { id: 2, name: "24인치 모니터", price: 200000 },
        { id: 3, name: "27인치 모니터", price: 300000 },
    ]

    return (
        <div>
            <h1>상품 페이지</h1>

            <div>
                <button onClick={() => setView("detail")}> {/* 버튼 클릭 시 view 상태를 detail로 변경 */}
                    상품 상세
                </button>
                <button onClick={() => setView("related")}> {/* 버튼 클릭 시 view 상태를 related로 변경 */}
                    관련 상품
                </button>
            </div>
            {/* 조건부 렌더링 */}
            {
                view === "detail" && (
                    <div>
                        <h2>세로 모니터</h2>
                        <p>가로 세로 토글이 되는 디자인</p>
                        <h3>320,000원</h3>
                    </div>
                )
            }
            {
                view === "related" && (
                    <>
                        <h2>관련 상품 목록</h2>
                        <ul>
                            {
                                productList.map((item) => (
                                    <li key={item.id}>
                                        {item.name} - {item.price}원
                                    </li>
                                ))}
                        </ul>
                    </>
                )
            }
        </div>
    )
}

export default Home