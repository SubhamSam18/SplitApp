import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { styles } from './styles';

const ExpenseDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { expenseId } = route.params;

    const [loading, setLoading] = useState(true);
    const [expense, setExpense] = useState(null);

    const fetchExpenseDetails = async () => {
        try {
            const res = await API.get(`/expense/${expenseId}`);
            setExpense(res.data);
        } catch (error) {
            console.log('Error fetching expense details:', error);
            Alert.alert('Error', 'Could not load expense details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
    }, [expenseId]);

    const handleEditExpense = () => {
        if (!expense) return;
        navigation.navigate('CreateExpense', { 
            expenseId, 
            expenseType: "Edit", 
            pageName: "Edit Expense",
            groupName: expense.group?.name, 
            groupId: expense.group?._id || expense.group,
            groupMembers: expense.splits?.map(m => ({ 
                _id: m.user, 
                name: m.name, 
                email: m.email || '' 
            })) || []
        });
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