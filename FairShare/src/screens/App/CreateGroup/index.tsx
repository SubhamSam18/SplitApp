import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, ScrollView, 
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
    TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import API from '../../../services/api';
import { styles } from './styles';

type CreateGroupNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CreateGroup'>;

const CreateGroup = () => {
    const navigation = useNavigation<CreateGroupNavigationProp>();
    
    const [name, setName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddMember = () => {
        const trimmedEmail = emailInput.trim().toLowerCase();
        if (!trimmedEmail) return;

        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (members.includes(trimmedEmail)) {
            Alert.alert('Duplicate Member', 'This email is already added.');
            return;
        }

        setMembers([...members, trimmedEmail]);
        setEmailInput('');
    };

    const handleRemoveMember = (emailToRemove: string) => {
        setMembers(members.filter(email => email !== emailToRemove));
    };

    const handleCreateGroup = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Field', 'Please enter a group name.');
            return;
        }

        if (members.length === 0) {
            Alert.alert('Missing Members', 'Please add at least one member to the group.');
            return;
        }

        setLoading(true);
        try {
            await API.post('/groups/', { name: name.trim(), members });
            Alert.alert(
                'Success', 
                'Group created successfully!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            console.log("Create Group Error: ", error);
            const msg = error.response?.data?.message || 'Failed to create group.';
            if (error.response?.data?.invalidEmails) {
                Alert.alert(
                    'Invalid Members', 
                    `The following emails do not exist: ${error.response.data.invalidEmails.join(', ')}`
                );
            } else {
                Alert.alert('Error', msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={styles.backButtonText}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>New Group</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Group Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Goa Trip 🌴"
                                    placeholderTextColor="#A0A0A0"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Add Members (by Email)</Text>
                                <View style={styles.addMemberRow}>
                                    <TextInput
                                        style={[styles.input, styles.memberInput]}
                                        placeholder="friend@example.com"
                                        placeholderTextColor="#A0A0A0"
                                        value={emailInput}
                                        onChangeText={setEmailInput}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {members.length > 0 && (
                                <View style={styles.membersList}>
                                    <Text style={styles.membersListTitle}>Added Members:</Text>
                                    {members.map((email, index) => (
                                        <View key={index} style={styles.memberChip}>
                                            <Text style={styles.memberEmail}>{email}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveMember(email)}>
                                                <Text style={styles.removeMemberText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}

                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.createButton} 
                                onPress={handleCreateGroup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.createButtonText}>Create Group</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateGroup;
