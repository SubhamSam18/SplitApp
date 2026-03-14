import './AccountOptions.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function AccountOptions(response) {
    console.log("Account Reponse", response.userDetails);
    const navigate = useNavigate();
    const handleLogout = async () => {
        const response = await axios.post('/api/auth/logout');
        navigate('/login');
    }
    return (
        <div className="accountOptionValues">
            <div className="accountDetails">
                <p className="userName">{response.userDetails.userName}</p>
            </div>
            <div className="optionValues">
                <select name="currencyCd" id="currency" placeholder="Currency" defaultValue="IND">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <button className="changePassword">Change Password</button>
                <button className="logout" onClick={() => handleLogout()}>Logout</button>
            </div>
        </div>
    )
}
export default AccountOptions;