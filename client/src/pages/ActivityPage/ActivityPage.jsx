import { useState, useEffect } from "react";
import "./ActivityPage.css";
import API from "../../services/api";

function ActivityPage() {
    const [activities, setActivities] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");

    const activity = async () => {
        const response = await API.get(`/activity/getActivities`, {
            withCredentials: true
        })
        setActivities(response.data.activities);
        setCurrentUserId(response.data.currentUserId);
    };

    useEffect(() => {
        activity();
    }, []);
    return (
        <div className="activity-container">
            <h1 className="activity-title">Activity Feed</h1>
            {activities.length === 0 ? (
                <div className="no-activity">
                    <p>No recent activity.</p>
                </div>
            ) : (
                <div className="activity-list">
                    {activities.map((act) => (
                        <div className="activity-card">
                            <div className="activity-icon">
                                🔔
                            </div>
                            <div className="activity-content">
                                <p className="activity-text">{act.description}</p>
                                {(() => {
                                    const userSplit = act.splits.find(s => s.user === currentUserId);
                                    if (!userSplit) return null;
                                    const isPayer = act.paidBy === currentUserId;

                                    if (isPayer) {
                                        const lentAmount = act.amount - (userSplit.amount || 0);
                                        return <p className="activity-contribution" style={{ color: '#10b981', fontWeight: '500', margin: '4px 0' }}>You get back: ₹{lentAmount.toFixed(0)}</p>
                                    } else {
                                        return <p className="activity-contribution" style={{ color: '#ef4444', fontWeight: '500', margin: '4px 0' }}>You owe: ₹{(userSplit.amount || 0).toFixed(0)}</p>
                                    }
                                })()}
                                <p className="activity-time">
                                    {new Date(act.createdAt).toLocaleString(undefined, {
                                        month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityPage;