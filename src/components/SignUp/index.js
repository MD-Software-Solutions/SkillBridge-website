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
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const options = ['Student Account', 'Teacher Account']; 
    const [selectedAccount, setSelectedAccount] = useState(options[0]);

    const [selectedSchool, setSelectedSchool] = useState('');

    const handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
    };

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
                                                <InputText placeholder="Real Name" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-envelope'></i>
                                                </span>
                                                <InputText placeholder="Personal Email" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-phone'></i>
                                                </span>
                                                <InputText placeholder="Phone Number" />
                                            </div>
                                            <FloatLabel>
                                                <Calendar id="buttondisplay" className='Calender-resize' value={date} onChange={(e) => setDate(e.value)} showIcon />
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
                                                    <i className='pi pi-building'></i> {/* Icon for school */}
                                                </span>
                                                <InputText
                                                    value={selectedSchool}
                                                    onChange={handleSchoolChange}
                                                    placeholder="School Name"
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-home'></i> {/* Icon for district */}
                                                </span>
                                                <InputText placeholder="School District" />
                                            </div>
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-envelope'></i>
                                                </span>
                                                <InputText placeholder="School Email" />
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
                                                <InputText placeholder="UserName" />
                                            </div>
                                            <div class="password-input-wrapper">
                                                <div>
                                                    <div className="card flex justify-content-center">
                                                        <FloatLabel>
                                                            <Password className='password-translate-fix' inputId="password" value={value} onChange={(e) => setValue(e.target.value)}  toggleMask/>
                                                            <label className='password-translate-fix-txt' htmlFor="password">Password</label>
                                                        </FloatLabel>
                                                    </div>
                                                    <div className="p-inputgroup flex-1">
                                                        <span className="p-inputgroup-addon">
                                                            <i className='pi pi-lock'></i>
                                                        </span>
                                                        <InputText placeholder="Confirm Password" />
                                                    </div>
                                                </div>
                                                <div className='account-translate-fix'>
                                                    <div className="card flex justify-content-center">
                                                        <SelectButton 
                                                            value={selectedAccount} 
                                                            onChange={(e) => setSelectedAccount(e.value)} 
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
