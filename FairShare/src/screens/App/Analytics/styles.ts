import { StyleSheet } from 'react-native';

export const analyticsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loader: {
        marginTop: 100,
    },

    // Month Selector
    monthSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8,
        gap: 16,
    },
    monthArrowButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    monthArrowDisabled: {
        opacity: 0.3,
    },
    monthArrowText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4361EE',
    },
    monthLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        minWidth: 140,
        textAlign: 'center',
    },

    // Today's Highlight Card
    todayCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    todayCardInner: {
        alignItems: 'center',
    },
    todayLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    todayAmount: {
        fontSize: 40,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -1,
    },
    todaySubtitle: {
        fontSize: 13,
        color: '#888888',
        marginTop: 6,
        fontWeight: '500',
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    statIconText: {
        fontSize: 16,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888888',
        flex: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sectionBadge: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4361EE',
        backgroundColor: '#F0F3FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },

    // Monthly Bar Chart
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 150,
        paddingTop: 10,
    },
    chartBarWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    chartBarValue: {
        fontSize: 9,
        fontWeight: '700',
        color: '#888888',
        marginBottom: 4,
    },
    chartBar: {
        width: 18,
        borderRadius: 9,
        minHeight: 4,
    },
    chartBarActive: {
        backgroundColor: '#4361EE',
    },
    chartBarInactive: {
        backgroundColor: '#E1E7FF',
    },
    chartBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#888888',
        marginTop: 8,
    },
    chartBarLabelActive: {
        color: '#4361EE',
        fontWeight: '700',
    },

    // Settlement Summary Card
    settlementCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
    },
    settlementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    settlementDivider: {
        height: 1,
        backgroundColor: '#EAEAEA',
    },
    settlementLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settlementIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settlementIconText: {
        fontSize: 18,
    },
    settlementLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    settlementSublabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#888888',
        marginTop: 2,
    },
    settlementAmount: {
        fontSize: 17,
        fontWeight: '700',
    },

    // Quick Insight Card
    insightCard: {
        backgroundColor: '#F0F3FF',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E7FF',
    },
    insightIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    insightTextContainer: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4361EE',
        marginBottom: 2,
    },
    insightDescription: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666666',
        lineHeight: 17,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888888',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#A0A0A0',
        textAlign: 'center',
        marginTop: 6,
    },

    bgPrimaryLight: {
        backgroundColor: '#F0F3FF'
    },
    bgDark: {
        backgroundColor: '#F8F9FA'
    },
    bgSuccessLight: {
        backgroundColor: '#E8F8F0'
    },
    bgDangerLight: {
        backgroundColor: '#FDF2F2'
    },

    textPrimary: {
        color: '#4361EE'
    },
    textDark: {
        color: '#1A1A1A'
    },
    textSuccess: {
        color: '#28a745'
    },
    textDanger: {
        color: '#dc3545'
    },
});
