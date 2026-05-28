import { Image, View } from "react-native";
import styles from "./styles";

interface AvatarProps {
    url: string;
    size?: number;
}

const Avatar = ({ url, size = 50 }: AvatarProps) => {
    const sizeStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: url }} style={styles.image} />
        </View>
    );
};

export default Avatar;