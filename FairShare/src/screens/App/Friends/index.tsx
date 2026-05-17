import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { styles } from './styles';

interface Friend {
    _id: string;
    name: string;
    email: string;
    balance: number;
}

const Friends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFriends = async () => {
        try {
            const res = await API.get('/friends/');
            setFriends(res.data || []);
        } catch (error) {
            console.log('Error fetching friends:', error);
            Alert.alert('Error', 'Could not load friends list');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFriends();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchFriends();
    };

    const handleSettleUp = (friend: Friend) => {
        const balanceInfo = friend.balance > 0 
            ? `${friend.name} owes you ₹${friend.balance}.` 
            : `You owe ${friend.name} ₹${Math.abs(friend.balance)}.`;

        Alert.alert(
            'Settle Up',
            `Are you sure you want to settle all balances with ${friend.name}? \n\n${balanceInfo}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Settle Up',
                    style: 'default',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await API.post('/settlement/friend', { to: friend._id });
                            Alert.alert('Success', `Balances with ${friend.name} settled successfully!`);
                            fetchFriends();
                        } catch (error) {
                            console.log('Settle up error:', error);
                            Alert.alert('Error', 'Failed to settle payment');
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    const totalOwed = friends
        .filter(f => f.balance > 0)
        .reduce((sum, f) => sum + f.balance, 0);

    const totalOwe = Math.abs(
        friends
            .filter(f => f.balance < 0)
            .reduce((sum, f) => sum + f.balance, 0)
    );

    const netBalance = totalOwed - totalOwe;

    const filteredFriends = friends.filter(friend => 
        friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header 
                title="Your Friends" 
                avatar="https://cdn-icons-png.flaticon.com/512/3675/3675805.png" 
            />

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
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
                ) : (
                    <>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Net Balance</Text>
                            <Text style={[
                                styles.netBalanceAmount, 
                                { color: netBalance > 0 ? '#28a745' : netBalance < 0 ? '#dc3545' : '#1A1A1A' }
                            ]}>
                                {netBalance > 0 ? '+' : ''}₹{netBalance}
                            </Text>

                            <View style={styles.splitSection}>
                                <View style={styles.moneyBox}>
                                    <Text style={styles.moneyLabel}>You are owed</Text>
                                    <Text style={[styles.moneyValue, { color: '#28a745' }]}>
                                        ₹{totalOwed}
                                    </Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.moneyBox}>
                                    <Text style={styles.moneyLabel}>You owe</Text>
                                    <Text style={[styles.moneyValue, { color: '#dc3545' }]}>
                                        ₹{totalOwe}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search friends by name or email..."
                                placeholderTextColor="#A0A0A0"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                clearButtonMode="while-editing"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>All Friends</Text>
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <View key={friend._id} style={styles.friendCard}>
                                    <View style={styles.friendLeft}>
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.avatarText}>{getInitial(friend.name)}</Text>
                                        </View>
                                        <View style={styles.friendDetails}>
                                            <Text style={styles.friendName} numberOfLines={1}>
                                                {friend.name}
                                            </Text>
                                            <Text style={styles.friendEmail} numberOfLines={1}>
                                                {friend.email}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.friendRight}>
                                        {friend.balance > 0 ? (
                                            <View style={styles.balanceContainer}>
                                                <Text style={styles.balanceLabel}>owes you</Text>
                                                <Text style={[styles.balanceAmount, { color: '#28a745' }]}>
                                                    ₹{friend.balance}
                                                </Text>
                                            </View>
                                        ) : friend.balance < 0 ? (
                                            <View style={styles.balanceContainer}>
                                                <Text style={styles.balanceLabel}>you owe</Text>
                                                <Text style={[styles.balanceAmount, { color: '#dc3545' }]}>
                                                    ₹{Math.abs(friend.balance)}
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.settledText}>Settled up</Text>
                                        )}

                                        {friend.balance !== 0 && (
                                            <TouchableOpacity 
                                                style={styles.settleButton}
                                                onPress={() => handleSettleUp(friend)}
                                            >
                                                <Text style={styles.settleButtonText}>Settle Up</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>
                                {searchQuery ? "No matching friends found" : "You don't have any friends in your groups yet."}
                            </Text>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Friends;
