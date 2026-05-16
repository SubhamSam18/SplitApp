import { Text, View, Image, TouchableOpacity } from "react-native";
import { headerStyles } from "./styles";

interface HeaderProps {
    title: string;
    avatar?: string;
    showBack?: boolean;
    onBackPress?: () => void;
}

export const Header = ({ title, avatar, showBack, onBackPress }: HeaderProps) => {
    return (
        <View style={headerStyles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={{ marginRight: 12 }}>
                        <Text style={headerStyles.backButtonText}>←</Text>
                    </TouchableOpacity>
                )}
                <Text style={headerStyles.title}>{title}</Text>
            </View>
            {avatar && (
                <View style={headerStyles.avatarContainer}>
                    <Image source={{ uri: avatar }} style={headerStyles.avatar} />
                </View>
            )}
        </View>
    )
}
