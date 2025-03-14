import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/AppLogo.png")} // Replace with your logo path
                    style={styles.logo}
                />
            </View>
            <Text style={styles.appName}>Unnecessary Spent Budget</Text>
            <Text style={styles.versionText}>1.0.0</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#ffffde",
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 100, // Makes it circular
        elevation: 5, // Shadow effect for Android
        shadowColor: "#000", // Shadow effect for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 20,
        overflow: "hidden",
    },
    logo: {
        width: 200, // Adjust as needed
        height: 200,
    },
    appName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
        marginInline: 10,
        textAlign: "center",
    },
    versionText: {
        position: "absolute",
        bottom: 20,
        fontSize: 12,
        color: "#333",
        opacity: 0.6,
    },
});
