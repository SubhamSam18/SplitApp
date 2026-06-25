import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { styles } from './styles';
import { useSelector } from 'react-redux';

const ExpenseDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { expenseId } = route.params;
    const user = useSelector((state) => state.user.userData);

    const [loading, setLoading] = useState(true);
    const [expense, setExpense] = useState(null);
    const [hasSettled, setHasSettled] = useState(false);

    const fetchExpenseDetails = async () => {
        try {
            const res = await API.get(`/expense/${expenseId}`);
            setExpense(res.data);
            
            const groupId = res.data.group?._id || res.data.group;
            const payerId = res.data.paidBy?._id || res.data.paidBy;
            
            if (groupId && payerId && user?._id && payerId !== user._id) {
                const summaryRes = await API.get(`/groups/${groupId}/summary`);
                const balances = summaryRes.data?.balances || [];
                const debt = balances.find(b => 
                    (b.from._id === user._id || b.from === user._id) && 
                    (b.to._id === payerId || b.to === payerId)
                );
                if (!debt || debt.amount <= 0) {
                    setHasSettled(true);
                }
            }
        } catch (error) {
            console.log('Error fetching expense details:', error);
            Alert.alert('Error', 'Could not load expense details');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchExpenseDetails();
        }, [expenseId])
    );

    const handleEditExpense = async () => {
        if (!expense) return;
        const groupId = expense.group?._id || expense.group;
        try {
            const res = await API.get(`/groups/${groupId}/summary`);
            const members = res.data?.memberSummary?.map((m) => ({
                _id: m.userId,
                name: m.name,
                email: m.email || ''
            })) || [];
            navigation.navigate('CreateExpense', {
                expenseId,
                expenseType: "Edit",
                pageName: "Edit Expense",
                groupName: expense.group?.name,
                groupId,
                groupMembers: members
            });
        } catch (error) {
            console.log('Error fetching group members for edit:', error);
            navigation.navigate('CreateExpense', {
                expenseId,
                expenseType: "Edit",
                pageName: "Edit Expense",
                groupName: expense.group?.name,
                groupId,
                groupMembers: expense.splits?.map(m => ({
                    _id: m.user,
                    name: m.name,
                    email: m.email || ''
                })) || []
            });
        }
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense? This will revert all balances.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await API.delete(`/expense/${expenseId}`);
                            Alert.alert('Success', 'Expense deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            console.log('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete expense');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Expense" showBack={true} onBackPress={() => navigation.goBack()} />
                <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
            </SafeAreaView>
        );
    }

    if (!expense) return null;

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Expense Details" showBack={true} onBackPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.description}>{expense.description}</Text>
                    <Text style={styles.amount}>₹{expense.amount}</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Paid by</Text>
                        <Text style={styles.infoValue}>{expense.paidBy?.name || expense.payerName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>{new Date(expense.expenseDate).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Group</Text>
                        <Text style={styles.infoValue}>{expense.group?.name || 'Personal'}</Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.infoLabel}>Split Type</Text>
                        <Text style={styles.infoValue}>{expense.splitType === 'equal' ? 'Equally' : 'Exact Amounts'}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Splits</Text>
                {expense.splits?.map((split, index) => (
                    <View key={index} style={styles.splitItem}>
                        <Text style={styles.memberName}>{split.name}</Text>
                        <Text style={styles.memberAmount}>₹{split.amount}</Text>
                    </View>
                ))}

                {(!((expense.paidBy?._id || expense.paidBy) === user?._id) && expense.splits?.find(s => s.user === user?._id)) && (
                    hasSettled ? (
                        <View style={[styles.settleExpenseButton, { backgroundColor: '#e9ecef', borderColor: '#ced4da' }]}>
                            <Text style={[styles.settleExpenseButtonText, { color: '#6c757d' }]}>
                                Expense has been settled
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={styles.settleExpenseButton} 
                            onPress={() => {
                                const iOweAmount = expense.splits.find(s => s.user === user?._id).amount;
                                Alert.alert(
                                    'Settle Expense Share',
                                    `Are you sure you want to settle your share of ₹${iOweAmount} with ${expense.paidBy?.name || expense.payerName}?`,
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Settle',
                                            style: 'default',
                                            onPress: async () => {
                                                try {
                                                    setLoading(true);
                                                    await API.post('/settle/group', {
                                                        groupId: expense.group?._id || expense.group,
                                                        from: user._id,
                                                        to: expense.paidBy?._id || expense.paidBy,
                                                        amount: iOweAmount
                                                    });
                                                    setHasSettled(true);
                                                    Alert.alert('Success', 'Your share settled successfully!');
                                                } catch (error) {
                                                    console.log('Settle error:', error);
                                                    Alert.alert('Error', 'Failed to settle payment');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Text style={styles.settleExpenseButtonText}>
                                Settle Your Share (₹{expense.splits.find(s => s.user === user?._id).amount})
                            </Text>
                        </TouchableOpacity>
                    )
                )}

                <TouchableOpacity style={styles.editButton} onPress={handleEditExpense}>
                    <Text style={styles.editButtonText}>Edit Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete Expense</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExpenseDetails;