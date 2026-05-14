import { Text, View, Image } from "react-native";
import { headerStyles } from "./styles";

interface HeaderProps {
    title: string;
    avatar: string;
}

export const Header = ({ title, avatar }: HeaderProps) => {
    return (
        <View style={headerStyles.container}>
            <Text style={headerStyles.title}>{title}</Text>
            <View style={headerStyles.avatarContainer}>
                <Image source={{ uri: avatar }} style={headerStyles.avatar} />
            </View>
        </View>
    )
}
