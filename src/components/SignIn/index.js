import './index.scss';
import MenubarLanding from '../MenubarLanding';
import { InputText } from 'primereact/inputtext';
import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password'
import { Divider } from 'primereact/divider';


export default function SignIn() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, error, get_user_account_info, userId, user, logout } = useContext(AuthContext); // Use AuthContext to access login

    const handleLogin = async () => {
        
        setLoading(true);

        logout();

        setTimeout(async () => {
                // Call login function from AuthContext
            console.log("Are you serious right now")
            const isSuccess = await login(username, password);
            const get_user = await get_user_account_info(username);
            
            

            setLoading(false);

            if (isSuccess) {
                navigate('/Interior'); // Navigate on successful login
            } else {
                // alert('Invalid credentials. Please try again.');
            }
        }, 2000)


    };
    
    return (
        <div>
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
                                <br />
                                {error && <p className='center' style={{ color: 'red' }}>{error}</p>}
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
