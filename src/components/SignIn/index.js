import './index.scss';
import MenubarLanding from '../MenubarLanding';
import { InputText } from 'primereact/inputtext';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password'
import { Divider } from 'primereact/divider';
import { authUtils } from '../../utils/auth';
import { Toast } from 'primereact/toast';



export default function SignIn() {
    const toast = useRef(null);
    const location = useLocation()
    const hasShownToast = useRef(false); 


    useEffect(() => {
        if (location.state?.isFirstTime && toast.current && !hasShownToast.current) {
            toast.current.show({
                severity: 'info',
                summary: 'Welcome!',
                detail: 'Sign in with your new account',
                life: 3000,
                position: 'top-center'
            });
            hasShownToast.current = true; 
        }
    }, [location.state?.isFirstTime]);

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error_message, setErrorMessage] = useState('');
    const navigate = useNavigate();
    // const { login, error, get_user_account_info, userId, user, logout } = useContext(AuthContext); // Use AuthContext to access login

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage('Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            const result = await authUtils.login(username, password);
            
            if (result.success) {
                setErrorMessage('');
                // If you need to store additional user data
                if (result.data.user) {
                    localStorage.setItem('user', JSON.stringify(result.data.user));
                }
                navigate('/Interior');
            } else {
                setErrorMessage(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <section className='signIn-bg-wrapper'>
            <MenubarLanding />
                <div className='SignIn-Wrapper'>
                    <div className='signIn-form-wrapper'>
                        <h1 className='title'>Login to SkillBridge</h1>
                        <div className="wrapper-width-70 wrapper-trans-20 wrapper-trans-down-media">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon password-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="p-inputgroup flex-1">
                                <div className=''>
                                    <span className="p-inputgroup-addon password-addon">
                                        <i className='pi pi-lock'></i>
                                    </span>
                                </div>
                                <Password
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    
                                />
                            </div>
                            <div className="card flex flex-wrap justify-content-start gap-3">
                                <Button
                                    className='login-btn w-100'
                                    label="Login"
                                    // icon="pi pi-check"
                                    loading={loading}
                                    onClick={() => {
                                            if (username.length > 0 && password.length > 0) {
                                                handleLogin()
                                            }
                                        }
                                    }
                                />

                                {error_message && <p style={{ color: 'red' }}>{error_message}</p>}
                            </div>
                        </div>
                        <Divider />
                        <div className='signin-bottom-text'>
                            <p>Don't have an account? <Link to="/signup">SignUp</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
