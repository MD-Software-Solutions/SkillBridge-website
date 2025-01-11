import './index.scss';
import MenubarLanding from '../MenubarLanding';
import React, { useState, useRef } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { Stepper } from 'primereact/stepper';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [date, setDate] = useState(null);
    const stepperRef = useRef(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const [isStudentAccount, setIsStudentAccount] = useState(true); // true = Student Account, false = Teacher Account
    const [realName, setRealName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [schoolDistrict, setSchoolDistrict] = useState('');
    const [schoolEmail, setSchoolEmail] = useState('');
    const [userName, setUserName] = useState('');

    const options = [
        { label: 'Student Account', value: true },
        { label: 'Teacher Account', value: false }
    ];

    const load = () => {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setPasswordError(''); // Clear any previous error

        const formData = {
            realName,
            personalEmail,
            phoneNumber,
            birthDate: date,
            schoolName,
            schoolDistrict,
            schoolEmail,
            userName,
            password,
            accountType: isStudentAccount ? 'Student Account' : 'Teacher Account'
        };

        console.log('Collected Form Data:', formData); // For debugging

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate('/Interior');
        }, 2000);
    };

    return (
        <div>
            <MenubarLanding />

            <section className='signUp-bg-wrapper'>
                <div className='SignUp-Wrapper'>
                    <div className='signUp-form-wrapper'>
                        <h1>Sign Up</h1>

                        <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                            <StepperPanel header="Personal Info">
                                <div className="flex flex-column h-12rem">
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        <div className='input-form-wrapper'>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-user"></i>
                                                </span>
                                                <InputText value={realName} onChange={(e) => setRealName(e.target.value)} placeholder="Real Name" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-envelope'></i>
                                                </span>
                                                <InputText value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} placeholder="Personal Email" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-phone'></i>
                                                </span>
                                                <InputText value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
                                            </div>
                                            <FloatLabel>
                                                <Calendar className='Calender-resize' value={date} onChange={(e) => setDate(e.value)} showIcon />
                                                <label className='font-resize-2vw' htmlFor="birth_date">Birth Date</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-end">
                                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="School Info">
                                <div className="flex flex-column h-12rem">
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        <div className='input-form-wrapper'>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-building'></i>
                                                </span>
                                                <InputText value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="School Name" className="w-full md:w-14rem" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-home'></i>
                                                </span>
                                                <InputText value={schoolDistrict} onChange={(e) => setSchoolDistrict(e.target.value)} placeholder="School District" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-envelope'></i>
                                                </span>
                                                <InputText value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} placeholder="School Email" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-between button-grid-wrapper-sign">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                    <Button label="Next" className='float-right-btn-sign' icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="Account info">
                                <div className="flex flex-column h-12rem">
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        <div className='input-form-wrapper'>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-user"></i>
                                                </span>
                                                <InputText value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
                                            </div>
                                            <div className="password-input-wrapper">
                                                <div>
                                                    <div>
                                                        <Password className='password-translate-fix' value={password} onChange={(e) => setPassword(e.target.value)} toggleMask placeholder="Password" />
                                                        <label className='password-translate-fix-txt'>Password</label>
                                                    </div>
                                                    <div>
                                                        <Password className='password-translate-fix2' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask placeholder="Confirm Password" />
                                                        <label className='password-translate-fix-txt'>Confirm Password</label>
                                                    </div>
                                                    {passwordError && <small className="p-error">{passwordError}</small>}
                                                </div>
                                                <div className='account-translate-fix'>
                                                    <div className="card flex justify-content-center">
                                                        <SelectButton 
                                                            value={isStudentAccount} 
                                                            onChange={(e) => setIsStudentAccount(e.value)} 
                                                            options={options} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="button-grid-wrapper-sign">
                                    <div className="flex pt-4 justify-content-start">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                    </div>
                                    <div className="card flex flex-wrap justify-content-center gap-3">
                                        <Button label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
                                    </div>
                                </div>
                            </StepperPanel>
                        </Stepper>
                    </div>
                </div>
            </section>
        </div>
    );
}
