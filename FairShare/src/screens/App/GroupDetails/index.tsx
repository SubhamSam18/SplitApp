import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';

type GroupDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GroupDetails = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<GroupDetailsNavigationProp>();
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
                                <Text style={styles.sectionTitle}>Balances</Text>
                                {summary?.memberSummary?.map((member: any) => (
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
