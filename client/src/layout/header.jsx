import React, {useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink} from 'react-router-dom'
import { selectCartHidden, selectSettingHidden } from '../redux/ui/ui-selector'
import { selectIsAdmin, selectIsAuth,selectIsLoading } from "../redux/auth/auth-selector"
import { toggleSettingHidden } from "../redux/ui/ui-actions"
import { ReactComponent as SewingIcon } from '../assets/icons/sewing.svg'
import { ReactComponent as PersonIcon } from '../assets/icons/person.svg'
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg'

import CartIcon from "../components/cart-icon"
import CartDropdown from "../components/cart-dropdown";
import SettingDropdwon from "../components/setting-dropdown"
import { useState } from 'react'
import {useThrottle} from '../utils/hooks/useThrottle'

const Header = () => {
    const isAdmin = useSelector(state => selectIsAdmin(state));
    const isAuthenticated = useSelector(state => selectIsAuth(state));
    const loading = useSelector(state => selectIsLoading(state))
    const cartDropdown = useSelector(state => selectCartHidden(state))
    const settingDropdown = useSelector(state => selectSettingHidden(state))
    const dispatch = useDispatch()

    const handleToggleSettingHidden = () => {
        dispatch(toggleSettingHidden())
    }

    const [minimize, setMinimize] = useState(false)
    
    const scrollFunction = () => {
        console.log('throttel')
        if (window.scrollY > 50) {
            setMinimize(true)
        } else {
            setMinimize(false)
        }
    }

    const scrollThrottle = useThrottle(scrollFunction,100);


    useEffect(() => {
        window.addEventListener('scroll',scrollThrottle);
        return () => {
            window.removeEventListener('scroll',scrollThrottle);
        }
     }, [])

        
    const header = (
        <header className={`header container ${minimize ? 'minimize':''}`}>
            <Link className="logo_container" to="/">
                <SewingIcon className='logo'/>
                <div className="brand">Allan Sewing Machines</div>
            </Link>

            <div className="options">
                <NavLink exact className="option" to="/" >Home</NavLink>
                <NavLink className="option" to="/shop" >Shop</NavLink>
                <NavLink className="option" to="/shop" >About</NavLink>
                {
                    isAuthenticated ? 
                    <>
                    <div className="option menu" onClick={handleToggleSettingHidden}>
                        <PersonIcon />
                    </div>
                    </>
                    :
                    <NavLink className="option" to='/signin'>Sign in</NavLink>
                }
            
                <CartIcon />

                <div className="option menu">
                    <SearchIcon />
                </div>
            
            </div>

            {
                cartDropdown ? 
                    <CartDropdown />
                :null
            }
            {
                isAuthenticated && settingDropdown ? 
                    <SettingDropdwon />
                :null
            }
        </header>
        )

    return(
    <>
        {isAdmin && isAuthenticated && !loading ? null:(header)}
    </>
    );
}


export default Header;