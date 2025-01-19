import './index.scss';
import MenubarLanding from '../MenubarLanding';
import { InputText } from 'primereact/inputtext';
import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, error } = useContext(AuthContext); // Use AuthContext to access login

    const handleLogin = async () => {
        setLoading(true);

        // Call login function from AuthContext
        const isSuccess = await login(username, password);
        

        setLoading(false);

        if (isSuccess) {
            navigate('/Interior'); // Navigate on successful login
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div>
            

            <section className='signIn-bg-wrapper'>
            <MenubarLanding />
                <div className='SignIn-Wrapper'>
                    <div className='signIn-form-wrapper'>
                        <h1>Log In</h1>
                        <div className="wrapper-width-70 wrapper-trans-20 wrapper-trans-down-media">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className='pi pi-lock'></i>
                                </span>
                                <InputText
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="card flex flex-wrap justify-content-center gap-3">
                                <Button
                                    label="Submit"
                                    icon="pi pi-check"
                                    loading={loading}
                                    onClick={handleLogin}
                                />
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
