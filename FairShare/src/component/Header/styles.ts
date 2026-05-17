import { StyleSheet, Platform } from "react-native";

export const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdadaff',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    backIcon: {
        fontSize: 28,
        color: '#1A1A1A',
        fontWeight: '900',
        marginTop: -10,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: '#6C757D',
        fontWeight: '500',
        marginTop: -2,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#4361EE',
        padding: 2,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
});