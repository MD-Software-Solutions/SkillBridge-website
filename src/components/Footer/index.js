import React from 'react';
import { Card } from 'primereact/card';

export default function Footer() {
    return (
        <div className="Footer-wrapper">
            <Card className='border-radius-0' style={{ backgroundColor: '#0b0130', color: 'white'}}>
                <div className="p-card-footer text-center">
                    <p>@ 2024-2025 JCHS FBLA - Website Coding and Development</p>
                    <p>5575 State Bridge Rd, Johns Creek, GA 30022</p>
                </div>
            </Card>
        </div>
    );
}
