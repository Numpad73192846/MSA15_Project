import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {

	return (
		<>
			<footer>
				<div className="footer-content">
					<div className="footer-section">
						<h4>튜터링고</h4>
						<p>최고의 튜터와 함께하는<br />1:1 맞춤 당금 플롯</p>
					</div>

					<div className="footer-section">
						<h4>서비스</h4>
						<ul>
							<li><Link to={'/tutors'}>튜터 찾기</Link></li>
							<li><Link to={'/tutor/register'}>튜터 등록</Link></li>
						</ul>
					</div>

					<div className="footer-section">
						<h4>회사 소개</h4>
						<ul>
							<li><Link to={'/about'}>소개</Link></li>
							<li><Link to={'/jobs'}>채용</Link></li>
							<li><Link to={'/partnership'}>파트너십</Link></li>
						</ul>
					</div>

					<div className="footer-section">
						<h4>고객 지원</h4>
						<ul>
							<li><Link to={'/contact'}>문의하기</Link></li>
							<li><Link to={'/faq'}>FAQ</Link></li>
							<li><Link to={'/guide/policies'}>이용약관</Link></li>
						</ul>
					</div>
				</div>

				<div className="footer-bottom">
					<p>&copy; 2026 튜터링고. All rights reserved.</p>
				</div>
			</footer>

			{/* Top Button */}
			<button id="topBtn" className="top-button" title="맨 위로">
				<i className="bi bi-arrow-up"></i>
			</button>
		</>
	)

}

export default Footer