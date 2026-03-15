import './AccountOptions.css';
import { useNavigate } from 'react-router-dom';
import API from "../../services/api";
import { useLoading } from "../../context/LoadingContext";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

function AccountOptions(response) {
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading();
    const [changePassword, setChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [settingPopup, setSettingPopup] = useState(false);
    const [confirmationPopup, setConfirmationPopup] = useState(false);
    const handleLogout = async () => {
        try {
            startLoading("Logging Out...");
            const response = await API.post('/auth/logout', {
                withcredentials: true
            })
            // console.log(response);
            setTimeout(() => {
                stopLoading();
                navigate("/auth");
            }, 2000);
        }
        catch (error) {
            console.log("Error", error);
        }
    }
    const handleChangePassword = async () => {
        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                console.error("All fields are required");
                return;
            }
            startLoading("Changing Password...");
            await API.post('/auth/changePassword', {
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
            setTimeout(() => {
                stopLoading();
                navigate("/auth");
            }, 2000);
        }
        catch (error) {
            stopLoading();
            console.log("Error", error);
        }
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
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CNY">CNY</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                    <option value="CHF">CHF</option>
                    <option value="SEK">SEK</option>
                    <option value="NZD">NZD</option>
                    <option value="HKD">HKD</option>
                    <option value="SGD">SGD</option>
                    <option value="NOK">NOK</option>
                    <option value="MXN">MXN</option>
                    <option value="ZAR">ZAR</option>
                    <option value="BRL">BRL</option>
                    <option value="TRY">TRY</option>
                    <option value="RUB">RUB</option>
                </select>
                <button className="changePassword" onClick={() => { setChangePassword(!changePassword), (settingPopup) ? setSettingPopup(false) : setConfirmationPopup(false), setConfirmationPopup(false) }}>Change Password</button>
                <button className="settings" onClick={() => { setSettingPopup(!settingPopup), (changePassword) ? setChangePassword(false) : setConfirmationPopup(false) }}>Settings</button>
                <button className="logout" onClick={() => handleLogout()}>Logout</button>
            </div>
            <AnimatePresence>
                <motion.div className="changePasswordPopUp">
                    {changePassword && (
                        <div className="changePasswordPopUpValues">
                            <input type="text" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <input type="text" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button className="changePasswordButton" onClick={() => handleChangePassword()}>Change Password</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            <AnimatePresence>
                <motion.div className="settingsPopup">
                    {settingPopup && (
                        <div className="settingsPopupValues">
                            <button className="deleteAccount" onClick={() => setConfirmationPopup(!confirmationPopup)}>Delete Account</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            <AnimatePresence>
                <motion.div className="confirmationPopup">
                    {confirmationPopup && (
                        <div className="confirmationPopupValues">
                            <p>Are you sure you want to delete your account?</p>
                            <button className="deleteAccountConfirmation" onClick={() => { }}>Yes, Delete My Account</button>
                            <button className="cancelConfirmation" onClick={() => { setConfirmationPopup(!confirmationPopup), setSettingPopup(false) }}>Cancel</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
export default AccountOptions;