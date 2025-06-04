import './index.scss';
import MenubarLanding from '../MenubarLanding';
import React, { useState, useRef, useContext } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { Stepper } from 'primereact/stepper';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Link, useNavigate } from 'react-router-dom';
import { InputMask } from "primereact/inputmask";
import { AuthContext } from '../../context/AuthContext';
import { authUtils } from '../../utils/auth';

/**
 * SignUp Component
 * 
 * This component renders a multi-step sign-up form using the PrimeReact Stepper component.
 * It collects personal, school, and account-related information from users and validates inputs before submission.
 * 
 * Key Features:
 * - **Personal Info Step**: Collects real name, personal email, phone number, and birth date.
 * - **School Info Step**: Collects school name, school district, and school email.
 * - **Account Info Step**: Collects username, password, and account type (Student or Teacher).
 * - Password validation ensures the "Password" and "Confirm Password" fields match.
 * - Uses a Stepper for a clear and interactive step-by-step form flow.
 * - Leverages PrimeReact components for enhanced UI/UX.
 * - Navigation to the `/Interior` page upon successful form submission.
 * 
 * State Variables:
 * - `date`: Stores the user's selected birth date.
 * - `password`: Stores the entered password.
 * - `confirmPassword`: Stores the entered confirmation password.
 * - `loading`: Controls the loading spinner for the Submit button.
 * - `passwordError`: Holds an error message if passwords do not match.
 * - `isStudentAccount`: Determines the account type (true = Student Account, false = Teacher Account).
 * - `realName`, `personalEmail`, `phoneNumber`, `schoolName`, `schoolDistrict`, `schoolEmail`, `userName`: Store user input for various fields.
 * 
 * Usage:
 * Render the `SignUp` component to display the sign-up form. The component automatically manages navigation and state updates.
 */

export default function SignUp() {
    const [date, setDate] = useState(null);
    const stepperRef = useRef(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { get_user_account_info, error } = useContext(AuthContext);

    const [isStudentAccount, setIsStudentAccount] = useState(true); // true = Student Account, false = Teacher Account
    const [realName, setRealName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();
    const [schoolName, setSchoolName] = useState('');
    const [schoolDistrict, setSchoolDistrict] = useState('');
    const [schoolEmail, setSchoolEmail] = useState('');
    const [userName, setUserName] = useState('');

    const options = [
        { label: 'Student Account', value: true },
        { label: 'Teacher Account', value: false }
    ];

    const load = async () => {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
    
        setPasswordError('');
        setLoading(true);
    
        const profileImages = [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png'
        ];
        

        const randomProfileImage = profileImages;
    
        const formData = {
            real_name: realName,
            personal_email: personalEmail,
            phone_number: String(phoneNumber),
            birth_date: date ? new Date(date).toISOString().split('T')[0] : null,
            school_name: schoolName,
            school_district: schoolDistrict,
            school_email: schoolEmail,
            account_username: userName,
            password,
            is_teacher: !isStudentAccount, // Convert to boolean
            profile_img_url: randomProfileImage,
        };
    
        try {
            // First, create the user account
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                throw new Error(errorMessage || 'Failed to register user.');
            }
            
            console.log(formData.account_username)
            navigate('/signin', { state: { isFirstTime: true }})            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    
    
    
    return (
        <div>
            

            <section className='signUp-bg-wrapper'>
            <MenubarLanding />
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
                                                <InputMask value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}  id="phone" mask="(999) 999-9999" placeholder="(999) 999-9999"  />
                                            </div>
                                            <FloatLabel>
                                                <Calendar className='Calender-resize' value={date} onChange={(e) => setDate(e.value)} showIcon dateFormat='dd/MM/yy' showTime={false}/>
                                                <label className='font-resize-2vw' htmlFor="birth_date">Birth Date</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-17 flex pt-4 justify-content-end">
                                    <Button label="Next" className='w-100-max450' icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
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
                                                    <div className="account-type w-100 card flex justify-content-center">
                                                        <SelectButton 
                                                            value={isStudentAccount} 
                                                            onChange={(e) => setIsStudentAccount(e.value)} 
                                                            options={options} 
                                                            className='w-100'
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
                                        {error && <p className='center' style={{ color: 'red' }}>{error}</p>}
                                    </div>
                                </div>
                            </StepperPanel>
                        </Stepper>
                        <Divider />
                        <div className='signup-bottom-text'>
                            <p>Already have an account? <Link to="/signin">SignIn</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}