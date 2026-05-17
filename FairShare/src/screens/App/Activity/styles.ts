import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888888',
        marginTop: 60,
        fontSize: 15,
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
    },
    detailsContainer: {
        flex: 1,
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        lineHeight: 20,
        marginBottom: 4,
    },
    deletedDescriptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888888',
        lineHeight: 20,
        marginBottom: 4,
        textDecorationLine: 'line-through',
    },
    timeText: {
        fontSize: 11,
        color: '#888888',
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    contributionLabel: {
        fontSize: 10,
        color: '#888888',
        fontWeight: '500',
        marginBottom: 2,
    },
    contributionAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    deletedBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    deletedText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },
});
