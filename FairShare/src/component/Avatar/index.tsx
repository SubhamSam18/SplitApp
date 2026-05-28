import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import styles from "./styles";

interface AvatarProps {
    url: string;
    size?: number;
}

const Avatar = ({ url, size = 50 }: AvatarProps) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [url]);

    const sizeStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    const sourceUrl = imageError || !url ? "https://img.freepik.com/premium-psd/3d-male-avatar-profile_975163-767.jpg?semt=ais_hybrid&w=740&q=80" : url;

    return (
        <View style={[styles.container, sizeStyle]}>
            <Image 
                source={{ uri: sourceUrl }} 
                style={[styles.image, sizeStyle]} 
                onError={() => setImageError(true)}
            />
        </View>
    );
};

export default Avatar;