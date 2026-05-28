import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { headerStyles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/store";
import API from "../../services/api";
import Avatar from "../Avatar";

interface HeaderProps {
    title: string;
    subtitle?: string;
    showProfile?: boolean;
    showBack?: boolean;
    onBackPress?: () => void;
}

export const Header = ({ title, subtitle, showProfile, showBack, onBackPress }: HeaderProps) => {
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.user.userData) as any;
    
    const getAvatarUrl = () => {
        return user ? `${API.defaults.baseURL}/auth/avatar/${user._id}?t=${user.avatarUpdatedAt || ''}` : "";
    };

    return (
        <View style={headerStyles.container}>
            <View style={headerStyles.leftContainer}>
                {showBack && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        style={headerStyles.backButton}
                        activeOpacity={0.7}
                    >
                        <Text style={headerStyles.backIcon}>←</Text>
                    </TouchableOpacity>
                )}
                <View style={headerStyles.titleContainer}>
                    <Text style={headerStyles.title} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={headerStyles.subtitle}>{subtitle}</Text>}
                </View>
            </View>

            {showProfile && (
                <TouchableOpacity style={headerStyles.avatarContainer} activeOpacity={0.8} onPress={() => { navigation.navigate('Profile' as never) }}>
                    <Avatar url={getAvatarUrl()} size={40} />
                </TouchableOpacity>
            )}
        </View>
    )
}
