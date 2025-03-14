import React, { useCallback, useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from "@react-navigation/native";

const AddItemUserInputModal = ({ visible, onClose, onSubmit }) => {
    const [amount, setAmount] = useState("");
    const [itemName, setItemName] = useState("");
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [EntryTime, setEntryTime] = useState(new Date());

    useEffect(() => {
        if (visible) {
            setEntryTime(new Date());
        }
    }, [visible]);

    const onCheckOutTimeChange = (selectedDate) => {
        console.log(selectedDate);
        setShowCheckOutPicker(false);
        if (selectedDate) setEntryTime(selectedDate);
    };

    const handleProceed = () => {
        const data = {
            ItemName: itemName,
            Amount: amount,
            Time: EntryTime.toISOString(),
        };
        onSubmit(data); // Pass data to parent
        onClose();
        setTimeout(() => {
            setAmount("");
            setItemName("");
        }, 100);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <TouchableOpacity style={styles.MainModalCon} activeOpacity={2} onPress={onClose}>
                <TouchableOpacity style={styles.ModalCon} onPress={null} activeOpacity={1}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    {/* Modal Content */}
                    <Text style={styles.modalTitle}>Add New Item</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Item Name"
                        placeholderTextColor="#aaa"
                        value={itemName}
                        onChangeText={setItemName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        maxLength={6}
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <TouchableOpacity
                        onPress={() => setShowCheckOutPicker(true)}
                        style={styles.input}
                    >
                        <Text style={styles.timeText}>
                            {EntryTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showCheckOutPicker && (
                        <DateTimePickerModal
                            isVisible={showCheckOutPicker}
                            value={EntryTime}
                            mode="datetime"
                            is24Hour={false}
                            display="spinner"
                            // onChange={onCheckOutTimeChange}//
                            onConfirm={onCheckOutTimeChange}
                            onCancel={()=>setShowCheckOutPicker(false)}
                        />
                    )}

                    <TouchableOpacity
                        style={[
                            styles.enterButton,
                            amount && itemName ? styles.buttonActive : styles.buttonDisabled,
                        ]}
                        disabled={!amount || !itemName}
                        onPress={handleProceed}
                    >
                        <Text style={styles.enterButtonText}>Proceed</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    MainModalCon: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    ModalCon: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        paddingInline: 25,
        paddingBottom: 30,
        alignItems: "center",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 4,
        borderColor: "#4caf50",
        zIndex: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    closeButtonText: {
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    timeText: {
        textAlign: "center",
        fontSize: 16,
        color: "#333",
    },
    enterButton: {
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 20,
    },
    buttonActive: {
        backgroundColor: "#4caf50",
    },
    buttonDisabled: {
        backgroundColor: "#b0c4de",
    },
    enterButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default AddItemUserInputModal;
