import { StyleSheet } from "react-native";

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
        marginTop: 50,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    description: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    amount: {
        fontSize: 36,
        fontWeight: '800',
        color: '#4361EE',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 32,
        marginBottom: 16,
    },
    splitItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    memberName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333333',
    },
    memberAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#FFF0F0',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    editButton: {
        marginTop: 40,
        backgroundColor: '#E8F2FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCE7FF',
    },
    editButtonText: {
        color: '#4361EE',
        fontSize: 16,
        fontWeight: '700',
    },
    deleteButtonText: {
        color: '#E53E3E',
        fontSize: 16,
        fontWeight: '700',
    }
});
