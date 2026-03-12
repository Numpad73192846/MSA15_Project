import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {

	const [isLoading, setIsLoading] = useState(true)
	const [isLogin, setIsLogin] = useState(false)
	const [userInfo, setUserInfo] = useState(null)
	const [roles, setRoles] = useState(new Set())

	const navigate = useNavigate()

	const parseRoles = (authList) => {

		if ( !authList ) {
			return new Set()
		}

		return new Set( authList.map( ( obj ) => obj.auth ))
	}

	// 권한 확인
	const hasRole = ( role ) => roles.has( role )
	const hasAnyRole = (...roleList ) => roleList.some( (role) => roles.has( role ) )

	const loginSetting = useCallback( ( userdata ) => {
		setIsLogin( true )
		setUserInfo( userdata )
		setRoles( parseRoles( userdata.authorities ) )
	}, [])

	useEffect( () => {
		api.post('/auth/refresh')
		   .then( ( response ) => loginSetting( response.data ) )
		   .catch( () => setIsLogin( false ) )
		   .finally( () => setIsLoading( false ) )
	}, [ loginSetting ] )

	const login = async ( username, password, rememberMe = false ) => {

		setIsLoading( true )

		try {
			
			const response = await api.post('/auth/login', { username, password, rememberMe })
			loginSetting( response.data )
			navigate( '/' )

		} finally {
			setIsLoading( false )
		}

	}

	const logout = async () => {

		setIsLoading( true )

		try {
			
			await api.post('/auth/logout')

		} finally {
			setIsLogin( false )
			setUserInfo( null )
			setRoles( new Set() )
			setIsLoading( false )
			navigate( '/login' )
		}
	}

	return (
		<LoginContext.Provider value={{ isLoading, isLogin, userInfo, roles, hasRole, hasAnyRole, login, logout }} >
			{ children }
		</LoginContext.Provider>
	)
}

export default LoginContextProvider