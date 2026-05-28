import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { analyticsStyles as styles } from './styles';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface AnalyticsData {
    todaysExpense: number;
    thisMonthsExpense: number;
    thisYearsExpense: number;
    amountRecievedThisMonth: number;
    amountPaidThisMonth: number;
    amountRecievedThisYear: number;
    amountPaidThisYear: number;
}

interface MonthlyDataPoint {
    month: number;
    label: string;
    value: number;
}

const Analytics = () => {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);


    const fetchAnalytics = async (month: number) => {
        try {
            const res = await API.get(`/analytics/${month}`);
            setData(res.data);
        } catch (error) {
            console.log('Error fetching analytics:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchMonthlyTrend = async () => {
        try {
            const currentMonth = now.getMonth() + 1;
            const promises = [];
            // Fetch up to last 6 months
            const startMonth = Math.max(1, currentMonth - 5);
            for (let m = startMonth; m <= currentMonth; m++) {
                promises.push(
                    API.get(`/analytics/${m}`).then(res => ({
                        month: m,
                        label: MONTH_SHORT[m - 1],
                        value: res.data.thisMonthsExpense || 0,
                    })).catch(() => ({
                        month: m,
                        label: MONTH_SHORT[m - 1],
                        value: 0,
                    }))
                );
            }
            const results = await Promise.all(promises);
            setMonthlyData(results);
        } catch (error) {
            console.log('Error fetching monthly trend:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchAnalytics(selectedMonth);
            fetchMonthlyTrend();
        }, [selectedMonth])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAnalytics(selectedMonth);
        fetchMonthlyTrend();
    };

    const changeMonth = (direction: number) => {
        const newMonth = selectedMonth + direction;
        if (newMonth < 1 || newMonth > 12) return;
        setSelectedMonth(newMonth);
        fetchAnalytics(newMonth);
    };

    const formatCurrency = (amount: number): string => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${Math.round(amount)}`;
    };

    const getInsight = (): { title: string; description: string } | null => {
        if (!data) return null;

        const monthlyAvg = data.thisYearsExpense / (now.getMonth() + 1);
        if (data.thisMonthsExpense > monthlyAvg * 1.3 && monthlyAvg > 0) {
            return {
                title: 'Spending Alert',
                description: `Your spending this month is ${Math.round(((data.thisMonthsExpense - monthlyAvg) / monthlyAvg) * 100)}% above your monthly average.`,
            };
        }
        if (data.amountRecievedThisMonth > data.amountPaidThisMonth && data.amountRecievedThisMonth > 0) {
            return {
                title: 'Positive Cash Flow',
                description: `You received ₹${Math.round(data.amountRecievedThisMonth - data.amountPaidThisMonth)} more than you paid this month. Great!`,
            };
        }
        if (data.thisMonthsExpense === 0) {
            return {
                title: 'No Expenses Yet',
                description: 'Start adding expenses to your groups to see analytics here.',
            };
        }
        return null;
    };

    const maxChartValue = Math.max(...monthlyData.map(d => d.value), 1);

    const statsCards = data ? [
        {
            label: 'Monthly Spend',
            value: data.thisMonthsExpense,
            icon: '📊',
            bgStyle: styles.bgPrimaryLight,
            textStyle: styles.textPrimary,
        },
        {
            label: 'Yearly Spend',
            value: data.thisYearsExpense,
            icon: '📅',
            bgStyle: styles.bgDark,
            textStyle: styles.textDark,
        },
        {
            label: 'Received (Month)',
            value: data.amountRecievedThisMonth,
            icon: '💰',
            bgStyle: styles.bgSuccessLight,
            textStyle: styles.textSuccess,
        },
        {
            label: 'Paid (Month)',
            value: data.amountPaidThisMonth,
            icon: '💳',
            bgStyle: styles.bgDangerLight,
            textStyle: styles.textDanger,
        },
    ] : [];

    const insight = getInsight();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Header
                title="Analytics"
                showProfile={true}
            />

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
            ) : (
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
                    <View style={styles.monthSelectorContainer}>
                        <TouchableOpacity
                            style={[styles.monthArrowButton, selectedMonth <= 1 && styles.monthArrowDisabled]}
                            onPress={() => changeMonth(-1)}
                            disabled={selectedMonth <= 1}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.monthArrowText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.monthLabel}>
                            {MONTH_NAMES[selectedMonth - 1]} {now.getFullYear()}
                        </Text>
                        <TouchableOpacity
                            style={[styles.monthArrowButton, selectedMonth >= 12 && styles.monthArrowDisabled]}
                            onPress={() => changeMonth(1)}
                            disabled={selectedMonth >= 12}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.monthArrowText}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.todayCard}>
                        <View style={styles.todayCardInner}>
                            <Text style={styles.todayLabel}>Today's Spending</Text>
                            <Text style={styles.todayAmount}>
                                ₹{data?.todaysExpense || 0}
                            </Text>
                            <Text style={styles.todaySubtitle}>
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        {statsCards.map((stat, index) => (
                            <View
                                key={index}
                                style={styles.statCard}
                            >
                                <View style={styles.statIconRow}>
                                    <View style={[styles.statIconCircle, stat.bgStyle]}>
                                        <Text style={styles.statIconText}>{stat.icon}</Text>
                                    </View>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                                <Text style={[styles.statValue, stat.textStyle]}>
                                    {formatCurrency(stat.value)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {insight && (
                        <View style={styles.insightCard}>
                            <Text style={styles.insightIcon}>💡</Text>
                            <View style={styles.insightTextContainer}>
                                <Text style={styles.insightTitle}>{insight.title}</Text>
                                <Text style={styles.insightDescription}>{insight.description}</Text>
                            </View>
                        </View>
                    )}

                    {monthlyData.length > 0 && (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Spending Trend</Text>
                                <Text style={styles.sectionBadge}>Last {monthlyData.length} months</Text>
                            </View>
                            <View style={styles.chartCard}>
                                <View style={styles.chartContainer}>
                                    {monthlyData.map((point, index) => {
                                        const barHeight = maxChartValue > 0
                                            ? Math.max(4, (point.value / maxChartValue) * 120)
                                            : 4;
                                        const isActive = point.month === selectedMonth;
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.chartBarWrapper}
                                                onPress={() => {
                                                    setSelectedMonth(point.month);
                                                    fetchAnalytics(point.month);
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.chartBarValue}>
                                                    {point.value > 0 ? formatCurrency(point.value) : ''}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.chartBar,
                                                        { height: barHeight },
                                                        isActive ? styles.chartBarActive : styles.chartBarInactive,
                                                    ]}
                                                />
                                                <Text
                                                    style={[
                                                        styles.chartBarLabel,
                                                        isActive && styles.chartBarLabelActive,
                                                    ]}
                                                >
                                                    {point.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Settlements</Text>
                        <Text style={styles.sectionBadge}>This Year</Text>
                    </View>
                    <View style={styles.settlementCard}>
                        <View style={styles.settlementRow}>
                            <View style={styles.settlementLeft}>
                                <View style={[styles.settlementIconCircle, styles.bgSuccessLight]}>
                                    <Text style={styles.settlementIconText}>📥</Text>
                                </View>
                                <View>
                                    <Text style={styles.settlementLabel}>Total Received</Text>
                                    <Text style={styles.settlementSublabel}>This year</Text>
                                </View>
                            </View>
                            <Text style={[styles.settlementAmount, styles.textSuccess]}>
                                +₹{Math.round(data?.amountRecievedThisYear || 0)}
                            </Text>
                        </View>

                        <View style={styles.settlementDivider} />

                        <View style={styles.settlementRow}>
                            <View style={styles.settlementLeft}>
                                <View style={[styles.settlementIconCircle, styles.bgDangerLight]}>
                                    <Text style={styles.settlementIconText}>📤</Text>
                                </View>
                                <View>
                                    <Text style={styles.settlementLabel}>Total Paid</Text>
                                    <Text style={styles.settlementSublabel}>This year</Text>
                                </View>
                            </View>
                            <Text style={[styles.settlementAmount, styles.textDanger]}>
                                -₹{Math.round(data?.amountPaidThisYear || 0)}
                            </Text>
                        </View>

                        <View style={styles.settlementDivider} />

                        <View style={styles.settlementRow}>
                            <View style={styles.settlementLeft}>
                                <View style={[styles.settlementIconCircle, styles.bgPrimaryLight]}>
                                    <Text style={styles.settlementIconText}>⚖️</Text>
                                </View>
                                <View>
                                    <Text style={styles.settlementLabel}>Net Settlement</Text>
                                    <Text style={styles.settlementSublabel}>This year</Text>
                                </View>
                            </View>
                            {(() => {
                                const net = (data?.amountRecievedThisYear || 0) - (data?.amountPaidThisYear || 0);
                                return (
                                    <Text style={[styles.settlementAmount, net >= 0 ? styles.textSuccess : styles.textDanger]}>
                                        {net >= 0 ? '+' : '-'}₹{Math.abs(Math.round(net))}
                                    </Text>
                                );
                            })()}
                        </View>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Monthly Settlements</Text>
                        <Text style={styles.sectionBadge}>{MONTH_SHORT[selectedMonth - 1]}</Text>
                    </View>
                    <View style={styles.settlementCard}>
                        <View style={styles.settlementRow}>
                            <View style={styles.settlementLeft}>
                                <View style={[styles.settlementIconCircle, styles.bgSuccessLight]}>
                                    <Text style={styles.settlementIconText}>🤝</Text>
                                </View>
                                <View>
                                    <Text style={styles.settlementLabel}>Received</Text>
                                    <Text style={styles.settlementSublabel}>{MONTH_NAMES[selectedMonth - 1]}</Text>
                                </View>
                            </View>
                            <Text style={[styles.settlementAmount, styles.textSuccess]}>
                                +₹{Math.round(data?.amountRecievedThisMonth || 0)}
                            </Text>
                        </View>

                        <View style={styles.settlementDivider} />

                        <View style={styles.settlementRow}>
                            <View style={styles.settlementLeft}>
                                <View style={[styles.settlementIconCircle, styles.bgDangerLight]}>
                                    <Text style={styles.settlementIconText}>💸</Text>
                                </View>
                                <View>
                                    <Text style={styles.settlementLabel}>Paid</Text>
                                    <Text style={styles.settlementSublabel}>{MONTH_NAMES[selectedMonth - 1]}</Text>
                                </View>
                            </View>
                            <Text style={[styles.settlementAmount, styles.textDanger]}>
                                -₹{Math.round(data?.amountPaidThisMonth || 0)}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Analytics;
