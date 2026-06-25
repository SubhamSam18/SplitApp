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
                            await API.post('/settle/friend', { to: friend._id });
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

    const totalOwed = friends.filter(f => f.balance > 0).reduce((sum, f) => sum + f.balance, 0);
    const totalOwe  = Math.abs(friends.filter(f => f.balance < 0).reduce((sum, f) => sum + f.balance, 0));
    const netBalance = totalOwed - totalOwe;

    const filteredFriends = friends.filter(friend =>
        friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Header title="Friends" showProfile={true} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
                showsVerticalScrollIndicator={false}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
                ) : (
                    <>
                        <View style={styles.summaryBanner}>
                            <Text style={styles.summaryBannerTitle}>Net Balance</Text>
                            <Text style={[styles.netBalanceAmount, {
                                color: netBalance > 0 ? '#ffffffff' : netBalance < 0 ? '#FFAAAA' : '#FFFFFF',
                            }]}>
                                {netBalance > 0 ? '+' : ''}{netBalance < 0 ? '-' : ''}₹{Math.abs(netBalance).toLocaleString()}
                            </Text>

                            <View style={styles.summaryStatsRow}>
                                <View style={styles.summaryStatBox}>
                                    <Text style={styles.summaryStatLabel}>You Are Owed</Text>
                                    <Text style={styles.summaryStatValue}>₹{totalOwed.toLocaleString()}</Text>
                                </View>
                                <View style={styles.summaryStatBox}>
                                    <Text style={styles.summaryStatLabel}>You Owe</Text>
                                    <Text style={styles.summaryStatValue}>₹{totalOwe.toLocaleString()}</Text>
                                </View>
                                <View style={styles.summaryStatBox}>
                                    <Text style={styles.summaryStatLabel}>Friends</Text>
                                    <Text style={styles.summaryStatValue}>{friends.length}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.listSection}>
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by name or email..."
                                    placeholderTextColor="#A0A0A0"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    clearButtonMode="while-editing"
                                />
                            </View>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>All Friends</Text>
                                {friends.length > 0 && (
                                    <View style={styles.friendCountBadge}>
                                        <Text style={styles.friendCountBadgeText}>{friends.length}</Text>
                                    </View>
                                )}
                            </View>

                            {filteredFriends.length > 0 ? (
                                filteredFriends.map((friend) => (
                                    <View key={friend._id} style={styles.friendCard}>
                                        <View style={styles.friendLeft}>
                                            <View style={styles.avatarPlaceholder}>
                                                <Text style={styles.avatarText}>{getInitial(friend.name)}</Text>
                                            </View>
                                            <View style={styles.friendDetails}>
                                                <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                                                <Text style={styles.friendEmail} numberOfLines={1}>{friend.email}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.friendRight}>
                                            {friend.balance > 0 ? (
                                                <View style={styles.balanceContainer}>
                                                    <Text style={styles.balanceLabel}>Owes You</Text>
                                                    <Text style={[styles.balanceAmount, { color: '#28a745' }]}>
                                                        +₹{friend.balance.toLocaleString()}
                                                    </Text>
                                                </View>
                                            ) : friend.balance < 0 ? (
                                                <View style={styles.balanceContainer}>
                                                    <Text style={styles.balanceLabel}>You Owe</Text>
                                                    <Text style={[styles.balanceAmount, { color: '#E63946' }]}>
                                                        ₹{Math.abs(friend.balance).toLocaleString()}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text style={styles.settledText}>✓ Settled</Text>
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
                                    {searchQuery ? 'No matching friends found' : "You don't have any friends in your groups yet."}
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Friends;
