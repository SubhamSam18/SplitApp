import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import assets from '../../../assets/asset';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';

type GroupDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GroupDetails = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<GroupDetailsNavigationProp>();
    const user = useSelector((state: RootState) => state.user.userData) as any;
    const { groupId, groupName } = route.params;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');

    const fetchGroupData = async () => {
        try {
            const res = await API.get(`/groups/${groupId}/summary`);
            setSummary(res.data);
        } catch (error) {
            console.log('Error fetching group summary:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchGroupData();
        }, [groupId])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchGroupData();
    };

    const handleEditGroup = () => {
        if (!summary) return;
        const memberEmails = summary.memberSummary
            .filter((m: any) => m.userId !== summary.currentUserId)
            .map((m: any) => m.email)
            .filter((email: any) => email);
        const groupData = {
            _id: summary.group.id,
            name: summary.group.name,
            groupAvatar: summary.group.groupAvatar,
            members: memberEmails
        };
        navigation.navigate('CreateGroup', { group: groupData } as any);
    }

    const handleSettleGroupDebt = (debt: any) => {
        Alert.alert(
            'Settle Up',
            `Are you sure you want to settle your debt of ₹${debt.amount} with ${debt.to?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Settle',
                    style: 'default',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await API.post('/settle/group', {
                                groupId: summary.group.id,
                                from: user._id,
                                to: debt.to._id,
                                amount: debt.amount
                            });
                            Alert.alert('Success', 'Payment settled successfully!');
                            fetchGroupData();
                        } catch (error) {
                            console.log('Settle error:', error);
                            Alert.alert('Error', 'Failed to settle payment');
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <SafeAreaView style={styles.container}>
            <Header title={groupName || "Group Details"} showBack={true} onBackPress={() => navigation.goBack()} />

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
            ) : (
                <>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={styles.headerCard}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEditGroup()}>
                                <Image source={assets.editIcon} style={styles.editIcon} />
                            </TouchableOpacity>
                            <Text style={styles.groupName}>{summary?.group?.name || groupName}</Text>
                            <Text style={styles.totalExpenseLabel}>Total Group Spending</Text>
                            <Text style={styles.totalExpenseAmount}>₹{summary?.totalExpense || 0}</Text>
                        </View>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'expenses' && styles.activeTabButton]}
                            onPress={() => setActiveTab('expenses')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
                                Expenses
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'balances' && styles.activeTabButton]}
                            onPress={() => setActiveTab('balances')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === 'balances' && styles.activeTabText]}>
                                Balances
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
                        showsVerticalScrollIndicator={false}
                    >
                        {activeTab === 'expenses' ? (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent Expenses</Text>
                                </View>
                                {summary?.expenses?.length > 0 ? (
                                    [...summary.expenses].reverse().map((expense: any) => (
                                        <TouchableOpacity key={expense._id} style={styles.expenseCard} onPress={() => navigation.navigate('ExpenseDetails', { expenseId: expense._id })}>
                                            <View style={styles.expenseInfo}>
                                                <Text style={styles.expenseDescription}>{expense.description}</Text>
                                                <Text style={styles.expenseSubText}>
                                                    {new Date(expense.expenseDate).toLocaleDateString()}
                                                </Text>
                                            </View>
                                            <View style={styles.expensePayerInfo}>
                                                <Text style={[styles.expenseAmount, { color: '#1A1A1A' }]}>
                                                    ₹{expense.amount}
                                                </Text>
                                                <Text style={styles.expensePayer}>by {expense.payerName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No expenses yet</Text>
                                )}
                            </View>
                        ) : (
                            <View style={styles.section}>
                                {(summary?.balances?.filter((b: any) => b.from._id === user._id) || []).length > 0 || 
                                 (summary?.balances?.filter((b: any) => b.to._id === user._id) || []).length > 0 ? (
                                    <>
                                        <Text style={styles.sectionTitle}>Your Debts</Text>
                                        
                                        {summary?.balances?.filter((b: any) => b.from._id === user._id).map((debt: any) => (
                                            <View key={debt._id} style={[styles.balanceCard, { borderLeftColor: '#dc3545', justifyContent: 'space-between' }]}>
                                                <View style={styles.memberInfo}>
                                                    <View style={styles.avatarPlaceholder}>
                                                        <Text style={styles.avatarText}>{getInitial(debt.to?.name)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.memberName}>You owe {debt.to?.name}</Text>
                                                        <Text style={[styles.memberBalance, { color: '#dc3545', marginTop: 4, fontSize: 14 }]}>
                                                            ₹{debt.amount}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <TouchableOpacity 
                                                    style={styles.settleButton}
                                                    onPress={() => handleSettleGroupDebt(debt)}
                                                >
                                                    <Text style={styles.settleButtonText}>Settle Up</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}

                                        {summary?.balances?.filter((b: any) => b.to._id === user._id).map((credit: any) => (
                                            <View key={credit._id} style={[styles.balanceCard, { borderLeftColor: '#28a745' }]}>
                                                <View style={styles.memberInfo}>
                                                    <View style={styles.avatarPlaceholder}>
                                                        <Text style={styles.avatarText}>{getInitial(credit.from?.name)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.memberName}>{credit.from?.name} owes you</Text>
                                                        <Text style={[styles.memberBalance, { color: '#28a745', marginTop: 4, fontSize: 14 }]}>
                                                            ₹{credit.amount}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                        
                                        <View style={{ height: 20 }} />
                                    </>
                                ) : null}

                                <Text style={styles.sectionTitle}>Overall Net Balances</Text>
                                {summary?.memberSummary?.filter((member: any) => member.userId !== user._id).map((member: any) => (
                                    <View
                                        key={member.userId}
                                        style={[
                                            styles.balanceCard,
                                            { borderLeftColor: member.netBalance >= 0 ? '#28a745' : '#dc3545' }
                                        ]}
                                    >
                                        <View style={styles.memberInfo}>
                                            <View style={styles.avatarPlaceholder}>
                                                <Text style={styles.avatarText}>{getInitial(member.name)}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.memberName}>{member.name}</Text>
                                                <Text style={styles.expenseSubText}>{member.email}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.memberBalance, { color: member.netBalance >= 0 ? '#28a745' : '#dc3545' }]}>
                                            {member.netBalance >= 0 ? '+' : ''}₹{member.netBalance}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </>
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateExpense', {
                    groupId,
                    groupMembers: summary?.memberSummary?.map((m: any) => ({
                        _id: m.userId,
                        name: m.name,
                        email: m.email
                    })) || [],
                    pageName: "Add Expense",
                    expenseType: "Add",
                })}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default GroupDetails;
