import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateAndTimePicker = () => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());

    const showPicker = () => setPickerVisible(true);
    const hidePicker = () => setPickerVisible(false);

    const handleConfirm = (date) => {
        setSelectedDateTime(date); // Select ki hui date-time set hoti hai
        hidePicker();
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Pick Date & Time" onPress={showPicker} />
            <Text style={{ marginTop: 20 }}>
                Selected: {selectedDateTime.toLocaleString()}
            </Text>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="datetime"
                date={selectedDateTime}
                onConfirm={handleConfirm}
                onCancel={hidePicker}
                is24Hour={false}
                display="spinner"
            />
        </View>
    );
};

export default DateAndTimePicker;
