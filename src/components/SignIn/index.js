import './index.scss';
import MenubarLanding from '../MenubarLanding';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate('/Interior');
        }, 2000);
    };

    return (
        <div>
            <MenubarLanding />

            <section className='signIn-bg-wrapper'>
                <div className='SignIn-Wrapper'>
                    <div className='signIn-form-wrapper'>
                        <h1>Log In</h1>
                        <div class="wrapper-width-70 wrapper-trans-20 wrapper-trans-down-media">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Username" />
                            </div>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className='pi pi-lock'></i>
                                </span>
                                <InputText placeholder="Password" />
                            </div>
                            <div className="card flex flex-wrap justify-content-center gap-3">
                                <Button label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
