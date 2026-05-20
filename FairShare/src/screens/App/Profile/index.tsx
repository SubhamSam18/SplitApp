import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, updateUser } from "../../../../Redux/userSlice";
import { Header } from "../../../component/Header";
import Avatar from "../../../component/Avatar";
import API from "../../../services/api";
import styles from "./styles";
import type { RootState } from "../../../../Redux/store";
import { useNavigation } from "@react-navigation/native";

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.user.userData) as any;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Summary state
    const [summary, setSummary] = useState({ youAreOwed: 0, youOwe: 0 });
    const [loadingSummary, setLoadingSummary] = useState(false);

    // Edit profile state
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Change password state
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatingPassword, setUpdatingPassword] = useState(false);



    const fetchSummary = async () => {
        try {
            setLoadingSummary(true);
            const res = await API.get("/summary");
            setSummary(res.data);
        } catch (err) {
            console.log("Error fetching summary in Profile:", err);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSummary();
            setEditName(user.name || "");
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!editName.trim()) {
            Alert.alert("Validation Error", "Name cannot be empty");
            return;
        }
        setUpdatingProfile(true);
        try {
            const res = await API.put("/auth/updateProfile", { name: editName.trim() });
            dispatch(updateUser({ name: res.data.user.name }));
            Alert.alert("Success", "Profile updated successfully!");
            setIsEditModalVisible(false);
        } catch (error: any) {
            console.log("Update profile error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Validation Error", "All fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Validation Error", "New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Validation Error", "New password must be at least 6 characters");
            return;
        }
        setUpdatingPassword(true);
        try {
            await API.post("/auth/changePassword", {
                currentPassword,
                newPassword,
                confirmPassword
            });
            Alert.alert("Success", "Password changed successfully!");
            setIsPasswordModalVisible(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.log("Change password error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to change password");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out from SplitAura?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.post("/auth/logout");
                        } catch (e) {
                            console.log("Backend logout error (safe to ignore):", e);
                        }
                        dispatch(clearUser());
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action is irreversible.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete Permanently",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.post("/auth/deleteAccount");
                            Alert.alert("Account Deleted", "Your account has been deleted.");
                            dispatch(clearUser());
                        } catch (err: any) {
                            console.log("Delete account error:", err);
                            Alert.alert("Error", err.response?.data?.message || "Failed to delete account");
                        }
                    }
                }
            ]
        );
    };

    const totalBalance = summary.youAreOwed - summary.youOwe;

    return (
        <SafeAreaView style={styles.container}>
            <Header title="My Profile" showBack={true} onBackPress={() => navigation.goBack()} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Avatar & User Details */}
                <View style={styles.profileHeaderCard}>
                    <View style={styles.avatarWrapper}>
                        <Avatar
                            url="https://img.freepik.com/premium-psd/3d-male-avatar-profile_975163-767.jpg?semt=ais_hybrid&w=740&q=80"
                            size={100}
                        />
                        <TouchableOpacity
                            style={styles.avatarEditBadge}
                            activeOpacity={0.7}
                            onPress={() => setIsEditModalVisible(true)}
                        >
                            <Text style={styles.avatarEditIcon}>✏️</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name || "FairShare User"}</Text>
                    <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
                </View>

                {/* Net Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceTitle}>Net Balance Summary</Text>
                    {loadingSummary ? (
                        <ActivityIndicator color="#4361EE" size="small" style={{ marginVertical: 10 }} />
                    ) : (
                        <Text style={[styles.balanceValue, { color: totalBalance >= 0 ? "#2EC4B6" : "#E63946" }]}>
                            {totalBalance >= 0 ? "+" : ""}₹{totalBalance}
                        </Text>
                    )}
                    <View style={styles.balanceSplitRow}>
                        <View style={styles.balanceSubItem}>
                            <Text style={styles.balanceSubTitle}>You're Owed</Text>
                            <Text style={styles.balanceOwedValue}>₹{summary.youAreOwed}</Text>
                        </View>
                        <View style={styles.balanceDivider} />
                        <View style={styles.balanceSubItem}>
                            <Text style={styles.balanceSubTitle}>You Owe</Text>
                            <Text style={styles.balanceOweValue}>₹{summary.youOwe}</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Actions */}
                <View style={styles.actionsCard}>
                    <Text style={styles.sectionHeader}>Preferences & Settings</Text>

                    {/* Edit Profile */}
                    <TouchableOpacity
                        style={styles.actionRow}
                        activeOpacity={0.7}
                        onPress={() => {
                            setEditName(user?.name || "");
                            setIsEditModalVisible(true);
                        }}
                    >
                        <View style={styles.actionLabelContainer}>
                            <Text style={styles.actionIcon}>👤</Text>
                            <Text style={styles.actionLabel}>Edit Full Name</Text>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                    {/* Change Password */}
                    <TouchableOpacity
                        style={styles.actionRow}
                        activeOpacity={0.7}
                        onPress={() => setIsPasswordModalVisible(true)}
                    >
                        <View style={styles.actionLabelContainer}>
                            <Text style={styles.actionIcon}>🔒</Text>
                            <Text style={styles.actionLabel}>Change Password</Text>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                </View>

                {/* Destructive Actions */}
                <View style={styles.actionsCard}>
                    <Text style={styles.sectionHeader}>Account</Text>

                    {/* Logout */}
                    <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={handleLogout}>
                        <View style={styles.actionLabelContainer}>
                            <Text style={styles.actionIcon}>🚪</Text>
                            <Text style={[styles.actionLabel, styles.logoutText]}>Logout</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Delete Account */}
                    <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={handleDeleteAccount}>
                        <View style={styles.actionLabelContainer}>
                            <Text style={styles.actionIcon}>🗑️</Text>
                            <Text style={[styles.actionLabel, styles.deleteText]}>Delete Account Permanently</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Footer Info */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>SplitAura v1.0.0</Text>
                    <Text style={styles.footerSubText}>FairShare Expense Management</Text>
                </View>
            </ScrollView>

            {/* Modal: Edit Profile */}
            <Modal
                visible={isEditModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            style={styles.modalContainer}
                        >
                            <Text style={styles.modalTitle}>Update Full Name</Text>
                            <Text style={styles.modalSubtitle}>Change the name displayed to other group members.</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Full Name"
                                placeholderTextColor="#A0A0A0"
                                value={editName}
                                onChangeText={setEditName}
                            />

                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalCancelButton]}
                                    onPress={() => setIsEditModalVisible(false)}
                                >
                                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalSaveButton]}
                                    onPress={handleUpdateProfile}
                                    disabled={updatingProfile}
                                >
                                    {updatingProfile ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={styles.modalSaveButtonText}>Save</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal: Change Password */}
            <Modal
                visible={isPasswordModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsPasswordModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            style={styles.modalContainer}
                        >
                            <Text style={styles.modalTitle}>Change Password</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Current Password"
                                placeholderTextColor="#A0A0A0"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="New Password"
                                placeholderTextColor="#A0A0A0"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Confirm New Password"
                                placeholderTextColor="#A0A0A0"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalCancelButton]}
                                    onPress={() => setIsPasswordModalVisible(false)}
                                >
                                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalSaveButton]}
                                    onPress={handleChangePassword}
                                    disabled={updatingPassword}
                                >
                                    {updatingPassword ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={styles.modalSaveButtonText}>Update</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfilePage;