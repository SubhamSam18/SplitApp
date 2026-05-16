import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, ScrollView, 
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
    TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { MainStackParamList } from '../../../navigator/types';
import API from '../../../services/api';
import { styles } from './styles';
import { Header } from '../../../component/Header';

type CreateExpenseNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CreateExpense'>;

const CreateExpense = () => {
    const navigation = useNavigation<CreateExpenseNavigationProp>();
    const route = useRoute<any>();
    const { groupId, groupMembers } = route.params;
    const userData = useSelector((state: any) => state.user.userData);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState<string>('');
    const [splitType, setSplitType] = useState<'equal' | 'exact'>('equal');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [exactAmounts, setExactAmounts] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Default to all members selected for equal split
        if (groupMembers) {
            setSelectedMembers(groupMembers.map((m: any) => m._id));
        }
        if (userData?._id) {
            setPaidBy(userData._id);
        }
    }, [groupMembers, userData]);

    const toggleMember = (memberId: string) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleExactAmountChange = (memberId: string, val: string) => {
        setExactAmounts({ ...exactAmounts, [memberId]: val });
    };

    const handleCreateExpense = async () => {
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (selectedMembers.length === 0) {
            Alert.alert('Error', 'Please select at least one person to split with');
            return;
        }

        const totalAmount = parseFloat(amount);
        let splits = [];

        if (splitType === 'equal') {
            splits = selectedMembers.map(id => {
                const member = groupMembers.find((m: any) => m._id === id);
                return { user: id, name: member.name };
            });
        } else {
            let runningTotal = 0;
            for (const id of selectedMembers) {
                const memberAmount = parseFloat(exactAmounts[id] || '0');
                if (memberAmount <= 0) {
                    Alert.alert('Error', `Please enter a valid amount for ${groupMembers.find((m: any) => m._id === id).name}`);
                    return;
                }
                const member = groupMembers.find((m: any) => m._id === id);
                splits.push({ user: id, name: member.name, amount: memberAmount });
                runningTotal += memberAmount;
            }

            if (Math.abs(runningTotal - totalAmount) > 0.01) {
                Alert.alert('Error', `Total split amount (₹${runningTotal}) must match expense amount (₹${totalAmount})`);
                return;
            }
        }

        setLoading(true);
        try {
            await API.post('/expense/', {
                data: {
                    groupId,
                    description: description.trim(),
                    amount: totalAmount,
                    splitType,
                    splits,
                    paidBy: paidBy || userData?._id,
                    expenseDate: new Date()
                }
            });
            Alert.alert('Success', 'Expense added successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.log('Create Expense Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Add Expense" showBack onBackPress={() => navigation.goBack()} />
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.input, styles.amountInput]}
                                    placeholder="₹0"
                                    placeholderTextColor="#A0A0A0"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="What was this for?"
                                    placeholderTextColor="#A0A0A0"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            <View style={styles.paidByContainer}>
                                <Text style={styles.label}>Paid By</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paidByScroll}>
                                    {groupMembers.map((member: any) => (
                                        <TouchableOpacity 
                                            key={member._id}
                                            style={[styles.paidByButton, paidBy === member._id && styles.activePaidByButton]}
                                            onPress={() => setPaidBy(member._id)}
                                        >
                                            <Text style={[styles.paidByText, paidBy === member._id && styles.activePaidByText]}>
                                                {member._id === userData?._id ? 'You' : member.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.splitTypeContainer}>
                                <TouchableOpacity 
                                    style={[styles.splitTypeButton, splitType === 'equal' && styles.activeSplitType]}
                                    onPress={() => setSplitType('equal')}
                                >
                                    <Text style={[styles.splitTypeText, splitType === 'equal' && styles.activeSplitTypeText]}>Equally</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.splitTypeButton, splitType === 'exact' && styles.activeSplitType]}
                                    onPress={() => setSplitType('exact')}
                                >
                                    <Text style={[styles.splitTypeText, splitType === 'exact' && styles.activeSplitTypeText]}>Exact Amounts</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.memberSelectionTitle}>Split with:</Text>
                            {groupMembers.map((member: any) => (
                                <TouchableOpacity 
                                    key={member._id} 
                                    style={[styles.memberItem, selectedMembers.includes(member._id) && styles.activeMemberItem]}
                                    onPress={() => toggleMember(member._id)}
                                >
                                    <View style={styles.memberInfo}>
                                        <View style={[styles.checkbox, selectedMembers.includes(member._id) && styles.checkboxChecked]}>
                                            {selectedMembers.includes(member._id) && <Text style={styles.checkmark}>✓</Text>}
                                        </View>
                                        <View>
                                            <Text style={styles.memberName}>{member._id === userData?._id ? 'You' : member.name}</Text>
                                            <Text style={styles.memberEmail}>{member.email}</Text>
                                        </View>
                                    </View>

                                    {splitType === 'exact' && selectedMembers.includes(member._id) && (
                                        <TextInput
                                            style={styles.exactAmountInput}
                                            placeholder="₹0"
                                            value={exactAmounts[member._id] || ''}
                                            onChangeText={(val) => handleExactAmountChange(member._id, val)}
                                            keyboardType="numeric"
                                            onClick={(e: any) => e.stopPropagation()}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.createButton} 
                                onPress={handleCreateExpense}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.createButtonText}>Save Expense</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateExpense;
