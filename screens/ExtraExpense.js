import { FlatList, Modal, StyleSheet, Text, View, TouchableOpacity, SectionList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from "react-native-calendars";

const ExtraExpense = () => {
  const [AllItemDataArray, setAllItemDataArray] = useState([]);
  const [displayDataArray, setdisplayDataArray] = useState([]);
  const [totalYearlySpendAmount, settotalYearlySpendAmount] = useState(0);
  const [startDateForSpend, setstartDateForSpend] = useState('2024-01-01T00:00:00.000Z');
  const [endDateForSpend, setsendDateForSpend] = useState('2025-01-01T00:00:00.000Z');
  const [todayDate, setTodayDate] = useState(null);
  const truncateTitle = (title) => (title.length > 20 ? `${title.slice(0, 20)}...` : title);
  const [modalVisible, setModalVisible] = useState(false);
  const [calModalVisible, setCalModalVisible] = useState(false);
  const [calModalFor, setcalModalFor] = useState('start');
  const [finalArray, setFinalArray] = useState([]);
  // const AllItemDataArray = [
  //   { "Amount": "150", "ItemName": "Kachori", "Time": "2024-09-15T15:00:00.000Z", "id": 1 },
  //   { "Amount": "120", "ItemName": "Samosa", "Time": "2024-10-01T19:12:00.000Z", "id": 2 },
  //   { "Amount": "180", "ItemName": "Pakora", "Time": "2024-10-20T16:52:00.000Z", "id": 3 },
  //   { "Amount": "110", "ItemName": "Chaat", "Time": "2024-11-17T18:00:00.000Z", "id": 4 },
  //   { "Amount": "130", "ItemName": "Golgappe", "Time": "2024-11-25T11:00:00.000Z", "id": 5 },
  //   { "Amount": "160", "ItemName": "Bhel Puri", "Time": "2024-11-28T07:00:00.000Z", "id": 6 },
  //   { "Amount": "140", "ItemName": "Sev Puri", "Time": "2024-12-14T16:00:00.000Z", "id": 7 },
  //   { "Amount": "190", "ItemName": "Dahi Puri", "Time": "2024-12-26T19:05:00.000Z", "id": 8 },
  //   { "Amount": "100", "ItemName": "Misal Pav", "Time": "2024-12-31T23:50:00.000Z", "id": 9 },
  //   { "Amount": "170", "ItemName": "Vada Pav", "Time": "2025-01-02T18:45:00.000Z", "id": 10 },
  //   { "Amount": "110", "ItemName": "Pani Puri", "Time": "2025-01-14T19:00:00.000Z", "id": 11 },
  //   { "Amount": "130", "ItemName": "Chole Bhature", "Time": "2025-01-28T18:00:00.000Z", "id": 12 },
  //   { "Amount": "50", "ItemName": "Kulche", "Time": "2025-02-01T09:30:00.000Z", "id": 13 },
  //   { "Amount": "50", "ItemName": "Momos", "Time": "2025-02-09T10:26:09.323Z", "id": 14 },
  //   { "Amount": "50", "ItemName": "Spring Rolls", "Time": "2025-02-09T10:26:22.040Z", "id": 15 },
  //   { "Amount": "5", "ItemName": "French Fries", "Time": "2025-02-09T10:28:26.598Z", "id": 16 }];


  const closeModal = () => setModalVisible(false);

  useFocusEffect(
    useCallback(() => {
      startAndFpcusFun();
    }, [])
  );
  useEffect(() => {
    startAndFpcusFun();
  }, []);

  const startAndFpcusFun = () => {
    getData();
    getDateForSpend();
    const today = new Date().toISOString().split("T")[0];
    setTodayDate(today);
  }

  useEffect(() => {
    getYearlyAmount();
  }, [startDateForSpend, endDateForSpend]);


  const getData = async () => {
    try {
      console.log("try start");
      const All_Item_Data_Array = await AsyncStorage.getItem('All_Item_Data_Array');
      if (All_Item_Data_Array !== null) {
        console.log("data found", All_Item_Data_Array);
        setAllItemDataArray(JSON.parse(All_Item_Data_Array));
        setFinalArrayForDisplay(JSON.parse(All_Item_Data_Array));
        console.log("get data fun finsih",All_Item_Data_Array);
      }
    } catch (error) {
      console.log("data clear error ", error);
    }
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

  const DecodeSpendDate = async (date) => {
    const dateFordecode = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const decodeMonth = dateFordecode.getMonth();
    const decodeYear = dateFordecode.getFullYear();
    return `${months[decodeMonth]} ${decodeYear}`
  }

  const getDateForSpend = async () => {
    console.log("get date fun start");
    const curDate = new Date();
    setsendDateForSpend(curDate);
    const oneYearAgo = new Date(curDate);
    oneYearAgo.setFullYear(curDate.getFullYear() - 1);
    setstartDateForSpend(oneYearAgo);
    console.log("get date fun finish");
  }

  const getYearlyAmount = async () => {
    console.log("get yearly amount fun start");
    const startD = new Date(startDateForSpend);
    const endD = new Date(endDateForSpend);
    endD.setDate(endD.getDate() + 1);
    const filterdata = AllItemDataArray.filter((item) => {
      const itemdate = new Date(item.Time);
      return itemdate >= startD && itemdate <= endD;
    });

    let am = 0;
    filterdata.map((item) => {
      am = am + parseFloat(item.Amount);
    });

    settotalYearlySpendAmount(am);
    const displayData = filterFinalData(finalArray);
    setdisplayDataArray(displayData);

    console.log("get yearly amount fun finsih",JSON.stringify(displayData));
  }

  const calenderPress = (day) => {
    console.log("calnder press start");
    const localDate = new Date(day.year, day.month - 1, day.day);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    const isoString = localDate.toISOString();
    if (calModalFor === "start") {
      setstartDateForSpend(isoString);
    } else {
      setsendDateForSpend(isoString);
      setModalVisible(!modalVisible);
    }
    setCalModalVisible(!calModalVisible);
    console.log("calender press finish");
  };


  const setFinalArrayForDisplay = (arraydata) => {
    console.log("final array start");
    const groupData = arraydata.reduce((acc, current) => {
      const month = new Date(current.Time).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(current);
      return acc;
    }, {});

    const formattedData = Object.keys(groupData).map((month) => {
      const Mdata = groupData[month];
      const MCost = Mdata.reduce((total, item) => total + parseInt(item.Amount, 10), 0);
      return {
        MonthDT: month,
        Mdata: Mdata.reverse(),
        MCost: MCost
      };
    });
    setFinalArray(formattedData.reverse());
    console.log("final array set finish",formattedData);
  }

  const filterFinalData = (arrayData) => {
    console.log("filter array start");
    const startDate = new Date(startDateForSpend);
    const endDate = new Date(endDateForSpend);

    let filteredData = arrayData.map(monthObj => {
      let filteredMdata = monthObj.Mdata.filter(item => {
        let itemDate = new Date(item.Time);
        return itemDate >= startDate && itemDate <= endDate;
      });

      if (filteredMdata.length > 0) {
        return {
          MonthDT: monthObj.MonthDT,
          Mdata: filteredMdata,
          MCost: filteredMdata.reduce((sum, item) => sum + parseFloat(item.Amount), 0)
        };
      }
      return null;
    }).filter(monthObj => monthObj !== null);

    console.log("filter data finsih",filteredData);
    return filteredData;
  }

  const SectionD = displayDataArray.map((item) => ({
    title: item.MonthDT,
    data: item.Mdata,
    cost: item.MCost
  }));


  const renderSectionHeaderData = ({ section: { title, cost } }) => (
    <View style={styles.SecHeaderCon}>
      <Text style={styles.SecHeader}>{title}</Text>
      <Text style={styles.SecHeader}>{cost} ₹ </Text>
    </View>

  );

  const renderItemData = ({ item }) => (
    <View style={styles.cardContainer}>
      <View>
        <Text style={styles.title}>{truncateTitle(item.ItemName)}</Text>
        <Text style={styles.subtitle}>{DecodeDate(item.Time)}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>₹ {item.Amount}</Text>
      </View>
    </View>
  );

  const keyExtractorData = (item, index) => item + index;

  return (
    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: '500' }}>Total Spending</Text>
        <Text style={{ fontSize: 18, color: '#999' }}>{DecodeSpendDate(startDateForSpend)} - {DecodeSpendDate(endDateForSpend)}</Text>
        <Text style={{ fontSize: 55, color: 'green', fontWeight: '800' }}>{totalYearlySpendAmount} ₹</Text>
      </View>

      <TouchableOpacity style={{ backgroundColor: '#4caf50', width: 60, height: 60, borderRadius: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', elevation: 3, position: 'absolute', bottom: 25, right: 25, zIndex: 15 }} onPress={() => setModalVisible(true)}>
        <Ionicons name='calendar-number' size={35} color='#fff' />
      </TouchableOpacity>

      {displayDataArray.length > 0 && (
        <SectionList
          sections={SectionD}
          renderSectionHeader={renderSectionHeaderData}
          keyExtractor={keyExtractorData}
          renderItem={renderItemData}
          style={styles.sectiolListStyle}
        />
      )}


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Select Months</Text>

            <View style={styles.dateOption}>
              <Text style={styles.dateText}>Start Month:</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => { setCalModalVisible(true); setcalModalFor('start'); }}>
                <Text style={styles.dateButtonText}>{DecodeSpendDate(startDateForSpend)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateOption}>
              <Text style={styles.dateText}>End Month:</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => { setCalModalVisible(true); setcalModalFor('end'); }}>
                <Text style={styles.dateButtonText}>{DecodeSpendDate(endDateForSpend)}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={calModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Calendar
            style={styles.calendarContainer}
            onDayPress={(day) => calenderPress(day)}
            maxDate={todayDate}
          />
        </View>

      </Modal>

    </View>
  )
}

export default ExtraExpense

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
    paddingBottom: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 0,
  },
  priceContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    paddingInline: 25,
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
    paddingBottom: 5
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateOption: {
    width: '100%',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5
  },
  dateButton: {
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
  dateButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#858585",
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
  calendarContainer: {
    borderRadius: 5,
    overflow: "hidden",
    elevation: 15,
    zIndex: 150
  },
  SecHeader: {
    fontSize: 20,
    color: 'rgba(108, 134, 161,1)',
    marginTop: 10
  },
  SecHeaderCon: {
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingInline: 20,
    marginTop: 15
  },
  sectiolListStyle:{
    zIndex:5,
    width:'100%',
    height:'100%'
  }
});