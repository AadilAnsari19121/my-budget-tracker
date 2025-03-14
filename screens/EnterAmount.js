import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

const EnterAmount = ({ onProceed, themeColor = '#f0f8ff' }) => {
    const [amount, setAmount] = useState('');

    return (
        <KeyboardAvoidingView
            style={[styles.container]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Title */}
            <Text style={styles.title}>Enter the amount for weekly balance</Text>
            <Text style={styles.subtitle}>
                You can edit or update this later in the settings.
            </Text>

            {/* Amount Input with ₹ Symbol */}
            <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    maxLength={6} // Limit to 3 characters (e.g., 993.99)
                    value={amount}
                    onChangeText={setAmount}
                    multiline={true}
                />
            </View>

            {/* Proceed Button */}
            <TouchableOpacity
                style={[styles.enterButton, amount ? styles.buttonActive : styles.buttonDisabled]}
                onPress={() => onProceed(amount)}
                disabled={!amount} // Disable button if no amount is entered
            >
                <Text style={styles.enterButtonText}>Proceed</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#2b2b2b',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#606060',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        marginBottom: 60,
        width: '45%',
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '600',
        color: '#333',
        marginRight: 5,
    },
    input: {
        flex: 1,
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
    enterButton: {
        position: 'absolute',
        bottom: 40,
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
        elevation: 3,
    },
    buttonActive: {
        backgroundColor: '#4caf50', // Green color for active state
    },
    buttonDisabled: {
        backgroundColor: '#b0c4de', // Light gray for disabled state
    },
    enterButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default EnterAmount;