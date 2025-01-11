import MenuInterior from '../MenuInterior';
import './index.scss';

export default function EmbededForm({ formLink }) {
    return (
        <div>
            <MenuInterior />
            <div className='embededForm-wrappe-primary'>
                <iframe src={formLink} title="Embedded Google Form" />
            </div>
        </div>
    );
}
