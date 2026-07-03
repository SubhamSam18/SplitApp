import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Alert,
    TouchableOpacity,
    Modal,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { styles } from './styles';
import assets from '../../../assets/asset';

interface Split {
    user: string;
    name: string;
    amount: number;
}

interface ActivityItem {
    _id: string;
    groupId: string;
    expenseId?: string;
    description: string;
    amount: number;
    paidBy: string;
    createdBy: string;
    splits: Split[];
    createdAt: string;
}

const Activity = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [settlementModalVisible, setSettlementModalVisible] = useState(false);
    const [selectedSettlement, setSelectedSettlement] = useState<ActivityItem | null>(null);

    const fetchActivities = async () => {
        try {
            const res = await API.get('/activity/getActivities');
            setActivities(res.data.activities || []);
            setCurrentUserId(res.data.currentUserId || '');
        } catch (error) {
            console.log('Error fetching activities:', error);
            Alert.alert('Error', 'Could not load activity feed');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchActivities();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchActivities();
    };

    const formatRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) {
                if (date.getDate() === now.getDate()) {
                    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (
                date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()
            ) {
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return '';
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Header
                title="ACTIVITY"
                showProfile={true}
            />
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
            ) : (
                <>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#4361EE"
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        {activities.length > 0 ? (
                            activities.map((activity) => {
                                const isDeleted = activity.description.toLowerCase().includes('deleted');
                                const mySplit = Math.round(activity.splits?.find(s => s.user === currentUserId)?.amount ?? 0);
                                const isPayer = activity.paidBy === currentUserId;
                                let receivableAmount = activity.amount - mySplit;
                                receivableAmount = Math.round(receivableAmount);
                                const isSettlement = activity.description.toLowerCase().includes('settled');
                                let avatarBg = '#F3F4F6';
                                let avatarEmoji = assets.expenseIcon;

                                if (isDeleted) {
                                    avatarBg = '#F3F4F6';
                                    avatarEmoji = assets.deleteIcon;
                                } else if (isSettlement) {
                                    avatarBg = '#E8F8F0';
                                    avatarEmoji = assets.settlementIcon;
                                } else if (isPayer) {
                                    avatarBg = '#E8F8F0';
                                    avatarEmoji = assets.expenseIcon;
                                } else if (mySplit > 0) {
                                    avatarBg = '#FDF2F2';
                                    avatarEmoji = assets.expenseIcon;
                                }

                                return (
                                    <TouchableOpacity
                                        key={activity._id}
                                        style={styles.activityCard}
                                        activeOpacity={isDeleted ? 1 : 0.7}
                                        onPress={() => {
                                            if (isDeleted) return;
                                            if (isSettlement) {
                                                setSelectedSettlement(activity);
                                                setSettlementModalVisible(true);
                                            } else if (activity.expenseId) {
                                                navigation.navigate('ExpenseDetails', { expenseId: activity.expenseId });
                                            }
                                        }}
                                    >
                                        <View style={styles.leftSection}>
                                            <View style={[styles.avatarPlaceholder, { backgroundColor: avatarBg }]}>
                                                <Image source={avatarEmoji} style={styles.avatarImage} />
                                            </View>

                                            <View style={styles.detailsContainer}>
                                                <Text style={isDeleted ? styles.deletedDescriptionText : styles.descriptionText}>
                                                    {activity.description}
                                                </Text>
                                                <Text style={styles.timeText}>
                                                    {formatRelativeTime(activity.createdAt)}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.rightSection}>
                                            {isDeleted ? (
                                                <View style={styles.deletedBadge}>
                                                    <Text style={styles.deletedText}>DELETED</Text>
                                                </View>
                                            ) : isSettlement ? (
                                                isPayer ? (
                                                    <>
                                                        <Text style={styles.contributionLabel}>you settled</Text>
                                                        <Text style={[styles.contributionAmount, { color: '#6B7280' }]}>
                                                            ₹{activity.amount}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Text style={styles.contributionLabel}>received</Text>
                                                        <Text style={[styles.contributionAmount, { color: '#28a745' }]}>
                                                            +₹{activity.amount}
                                                        </Text>
                                                    </>
                                                )
                                            ) : isPayer ? (
                                                <>
                                                    <Text style={styles.contributionLabel}>you lent</Text>
                                                    <Text style={[styles.contributionAmount, { color: '#28a745' }]}>
                                                        +₹{receivableAmount}
                                                    </Text>
                                                </>
                                            ) : mySplit > 0 ? (
                                                <>
                                                    <Text style={styles.contributionLabel}>you borrowed</Text>
                                                    <Text style={[styles.contributionAmount, { color: '#dc3545' }]}>
                                                        -₹{mySplit}
                                                    </Text>
                                                </>
                                            ) : (
                                                <View style={styles.deletedBadge}>
                                                    <Text style={styles.deletedText}>NOT SPLIT</Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={styles.emptyText}>
                                No recent activity in your groups yet.
                            </Text>
                        )}
                    </ScrollView>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={settlementModalVisible}
                        onRequestClose={() => setSettlementModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Settlement Details</Text>
                                {selectedSettlement && (
                                    <>
                                        <Text style={styles.modalDetailText}>
                                            {selectedSettlement.description}
                                        </Text>
                                        <Text style={styles.modalAmountText}>
                                            ₹{selectedSettlement.amount}
                                        </Text>
                                        <Text style={styles.timeText}>
                                            {formatRelativeTime(selectedSettlement.createdAt)}
                                        </Text>
                                    </>
                                )}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setSettlementModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            )
            }
        </SafeAreaView >
    );
};

export default Activity;
