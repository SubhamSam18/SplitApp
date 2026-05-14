import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Groups = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Groups Screen</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
    text: { fontSize: 20, fontWeight: 'bold' }
});

export default Groups;
