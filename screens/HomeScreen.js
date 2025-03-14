import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AddItemUserInputModal from './AddItemUserInputModal';
import { FlatList } from 'react-native';

const HomeScreen = () => {
    const [weeklyAmount, setweeklyAmount] = useState(0);
    const [FinalBudget, setFinalBudget] = useState(0);
    const [reminingDay, setreminingDay] = useState(1);
    const [weeklyAmountColor, setweeklyAmountColor] = useState('#4caf50');
    const [InputModal, setInputModalVisible] = useState(false);
    const [ItemsArray, setItemArray] = useState([]);
    const [AllItemDataArray, setAllItemDataArray] = useState([]); //yeh woh data hoga jo weekly par reset nahi hoga quki yeh history dikhane ke liye he
    const [WeekSpendAmount, setWeekSpendAmount] = useState(0);
    const ResetWeekDay = 1;
    const [Item_Reseted, setItem_Reseted] = useState(2);
    const truncateTitle = (title) => (title.length > 20 ? `${title.slice(0, 20)}...` : title);

    useEffect(() => {
        const date = new Date();
        const RemDay = WeekDayRem(date);
        setreminingDay(RemDay);
        CheckResetDate();
    }, []);

    useFocusEffect(
        useCallback(() => {

            const date = new Date();
            const RemDay = WeekDayRem(date);
            setreminingDay(RemDay);
            CheckResetDate();
        }, [])
    );

    useEffect(() => {
        setColorOfWeekBalance(weeklyAmount, FinalBudget);
    }, [weeklyAmount]);

    useEffect(() => {
        if (ItemsArray.length > 0 || ItemsArray !== null) {
            setTimeout(() => {
                saveData();
            }, 200);

        }
    }, [weeklyAmount, ItemsArray, Item_Reseted, WeekSpendAmount]);

    const getData = async () => {
        try {
            const BudgetAmount = await AsyncStorage.getItem('BudgetAmount');
            const Item_Array = await AsyncStorage.getItem('Item_Array');
            const All_Item_Data_Array = await AsyncStorage.getItem('All_Item_Data_Array');
            const Item_reset = await AsyncStorage.getItem('Item_Reset');
            const Final_Budget = await AsyncStorage.getItem('BudgetAmount2');
            const Week_Spend_Amount = await AsyncStorage.getItem('WeekSpendAmount');
            const EditValue = await AsyncStorage.getItem('EditAm');


            if (EditValue !== null) {
                console.log("edit checking status: ", JSON.parse(EditValue));
                if (JSON.parse(EditValue)) {
                    const editedFinalBudget = JSON.parse(Final_Budget) - JSON.parse(Week_Spend_Amount);
                    setweeklyAmount(editedFinalBudget);
                    console.log("editied amount: ", editedFinalBudget, " ", JSON.parse(Final_Budget), " ", JSON.parse(Week_Spend_Amount));
                    setTimeout(async () => {
                        await AsyncStorage.setItem('EditAm', JSON.stringify(false));
                    }, 100);
                } else {
                    if (BudgetAmount !== null) { setweeklyAmount(JSON.parse(BudgetAmount)) }
                }
            } else {
                if (BudgetAmount !== null) { setweeklyAmount(JSON.parse(BudgetAmount)) }
            }
            if (Final_Budget !== null) { setFinalBudget(JSON.parse(Final_Budget)); }
            if (Item_Array !== null) { setItemArray(JSON.parse(Item_Array)); }
            if (All_Item_Data_Array !== null) { setAllItemDataArray(JSON.parse(All_Item_Data_Array)); }
            if (Item_reset !== null) { setItem_Reseted(JSON.parse(Item_reset)); }
            if (Week_Spend_Amount !== null) { setWeekSpendAmount(JSON.parse(Week_Spend_Amount)); }

        } catch (error) { console.log("get item error ", error); }
    };

    const saveData = async () => {
        try {
            console.log("saving weekspend data", WeekSpendAmount);
            await AsyncStorage.setItem('BudgetAmount', JSON.stringify(weeklyAmount));
            await AsyncStorage.setItem('Item_Array', JSON.stringify(ItemsArray));
            await AsyncStorage.setItem('All_Item_Data_Array', JSON.stringify(AllItemDataArray));
            await AsyncStorage.setItem('Item_Reseted', JSON.stringify(Item_Reseted));
            await AsyncStorage.setItem('WeekSpendAmount', JSON.stringify(WeekSpendAmount));
        } catch (error) {
            console.log("error for saving data ", error);
        }
    }

    const CheckResetDate = async () => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const todayDate = today.toDateString(); // Store as a string to compare

        try {
            const lastResetDate = await AsyncStorage.getItem('LastResetDate');

            console.log("final budget", FinalBudget);
            if (currentDay === ResetWeekDay) {
                if (lastResetDate === todayDate) {
                    console.log('Already reset today, skipping...');
                    getData();
                    return;
                }

                CarryAmount();
                // Reset the budget and clear the item array
                setItemArray([]);
                setweeklyAmount(FinalBudget);
                setWeekSpendAmount(0);


                await AsyncStorage.setItem('BudgetAmount', JSON.stringify(FinalBudget));
                await AsyncStorage.setItem('Item_Array', JSON.stringify([]));
                await AsyncStorage.setItem('Item_Reset', JSON.stringify(true));
                await AsyncStorage.setItem('WeekSpendAmount', JSON.stringify(0));
                await AsyncStorage.setItem('LastResetDate', todayDate); // Store today's date to prevent multiple resets

                console.log('Budget and items reset for the week.');

                setTimeout(() => {
                    getData();
                }, 500);

            } else {
                console.log('Not reset day, skipping...');
                getData();
            }
        } catch (error) {
            console.log("Error in CheckResetDate:", error);
        }
    };

    const buttonclick = async (data) => {
        setItemArray((array) => {
            const newId = array.length + 1;
            const newItem = { id: newId, ...data };
            return [...array, newItem];
        });

        setAllItemDataArray((array) => {
            const newId = array.length + 1;
            const newItem = { id: newId, ...data };
            return [...array, newItem];
        });

        const am = data.Amount;
        setweeklyAmount(weeklyAmount - am);
        const amInFloat = parseFloat(am) + parseFloat(WeekSpendAmount);
        console.log("amInFloat : ", amInFloat, " = ", parseFloat(am), " + ", parseFloat(WeekSpendAmount));
        setWeekSpendAmount(amInFloat);
    }

    const DecodeDate = async (dateTime) => {
        const date = new Date(dateTime);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const dayNumber = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
        minutes = minutes.toString().padStart(2, "0"); // E
        return `${day}, ${dayNumber} ${month} | ${hours}:${minutes} ${ampm}`;
    }

    const WeekDayRem = async (date2) => {
        const date = new Date(date2);
        let CurrentDay = date.getDay();
        if (CurrentDay === 0) CurrentDay = 7;
        return 8 - CurrentDay;
    }

    const setColorOfWeekBalance = async (am, mnAm) => {

        if (mnAm <= 500) {
            let minPercentage = 40;
            const minAMout = (mnAm * minPercentage) / 100;
            if (am <= minAMout) { setweeklyAmountColor('red'); }
            else { setweeklyAmountColor('#4caf50'); }
        } if (mnAm > 500 && mnAm <= 1000) {
            let minPercentage = 20;
            const minAMout = (mnAm * minPercentage) / 100;
            if (am <= minAMout) { setweeklyAmountColor('red'); }
            else { setweeklyAmountColor('#4caf50'); }
        } else {
            let minPercentage = 10;
            const minAMout = (mnAm * minPercentage) / 100;
            if (am <= minAMout) { setweeklyAmountColor('red'); }
            else { setweeklyAmountColor('#4caf50'); }
        }
    }

    const CarryAmount = () => {
        console.log("saving week data is carry", weeklyAmount);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>

            <View style={styles.header}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '500' }}>Available balance</Text>
                <Text style={{ fontSize: 55, color: weeklyAmountColor, fontWeight: '800' }}>{weeklyAmount} ₹</Text>
                <Text style={{ fontSize: 18, color: '#999' }}>{reminingDay} day remining</Text>
            </View>

            <TouchableOpacity style={{ backgroundColor: '#4caf50', width: 60, height: 60, borderRadius: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', elevation: 3, position: 'absolute', bottom: 25, right: 25, zIndex: 5 }} onPress={() => setInputModalVisible(true)}>
                <Ionicons name='add' size={40} color='#fff' />
            </TouchableOpacity>

            <FlatList
                data={[...ItemsArray].reverse()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <View>
                            <Text style={styles.title}>{truncateTitle(item.ItemName)}</Text>
                            <Text style={styles.subtitle}>{DecodeDate(item.Time)}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>₹ {item.Amount}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
            <AddItemUserInputModal
                visible={InputModal}
                onClose={() => setInputModalVisible(false)}
                onSubmit={(data) => buttonclick(data)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomLeftRadius: 55,
        borderBottomRightRadius: 55,
        elevation: 15,
        paddingTop: 15,
        paddingBottom: 20,
    },
    cardContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 16,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 0,
    },
    priceContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#1E90FF',
        borderRadius: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    listContent: {
        paddingVertical: 8,
    },
});

export default HomeScreen;
