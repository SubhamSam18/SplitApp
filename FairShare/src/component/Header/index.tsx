import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { headerStyles } from "./styles";

interface HeaderProps {
    title: string;
    subtitle?: string;
    avatar?: string;
    showBack?: boolean;
    onBackPress?: () => void;
}

export const Header = ({ title, subtitle, avatar, showBack, onBackPress }: HeaderProps) => {
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
            
            {avatar && (
                <TouchableOpacity style={headerStyles.avatarContainer} activeOpacity={0.8}>
                    <Image source={{ uri: avatar }} style={headerStyles.avatar} />
                </TouchableOpacity>
            )}
        </View>
    )
}
