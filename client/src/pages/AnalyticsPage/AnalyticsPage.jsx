import axios from "axios";
import { useState, useEffect } from "react";
import "./AnalyticsPage.css"
function AnalyticsPage() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        const findAnalytics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/analytics/${month}`, { withCredentials: true });
                setAnalytics(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        findAnalytics();
    }, [month])

    const totalMonthlyExpense = Number(analytics.thisMonthsExpense || 0) - Number(analytics.amountRecievedThisMonth || 0) + Number(analytics.amountPaidThisMonth || 0);
    const totalYearlyExpense = Number(analytics.thisYearsExpense || 0) - Number(analytics.amountRecievedThisYear || 0) + Number(analytics.amountPaidThisYear || 0);

    return (
        <div className="analyticsPage">
            <h1>Analytics</h1>
            <div className="months">
                <p>Your actual share this month.</p>
                <select name="months" id="months" className="months"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                </select>
            </div>
            <div className="analyticsGrid">
                <div className="box">
                    <h3>Spent Today</h3>
                    <p>₹{analytics.todaysExpense}</p>
                </div>
                <div className="box">
                    <h3>Total Monthly Expense</h3>
                    <p>₹{totalMonthlyExpense}</p>
                </div>
                <div className="box">
                    <h3>Total Yearly Expense</h3>
                    <p>₹{totalYearlyExpense}</p>
                </div>
                <div className="box received">
                    <h3>Received This Month</h3>
                    <p>₹{Math.abs(analytics.amountRecievedThisMonth)}</p>
                </div>
                <div className="box paid">
                    <h3>Paid This Month</h3>
                    <p>₹{analytics.amountPaidThisMonth}</p>
                </div>
                <div className="box received">
                    <h3>Received This Year</h3>
                    <p>₹{Math.abs(analytics.amountRecievedThisYear)}</p>
                </div>
                <div className="box paid">
                    <h3>Paid This Year</h3>
                    <p>₹{Math.abs(analytics.amountPaidThisYear)}</p>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;