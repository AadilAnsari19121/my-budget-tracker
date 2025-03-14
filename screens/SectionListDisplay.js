//-----Hello guys, my name is Aadil. Please guide and support me in gaining more knowledge about technology-----
import { SectionList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
// import FoodSpendHistory from './FoodHistoryArrayObject.json';
import { MaterialIcons } from "@expo/vector-icons";

const SectionListDisplay = () => {
    const truncateTitle = (title) => title.length > 20 ? `${title.slice(0, 20)}...` : title;

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
        hours = hours % 12 || 12;
        minutes = minutes.toString().padStart(2, "0");
        return `${day}, ${dayNumber} ${month} | ${hours}:${minutes} ${ampm}`;
    }


    
    const CallLogItem = ({ name, time, type }) => {
        const getIcon = () => {
            switch (type) {
                case "incoming":
                    return { name: "call-received", color: "green" };
                case "outgoing":
                    return { name: "call-made", color: "green" };
                case "missed":
                    return { name: "call-missed", color: "red" };
                default:
                    return { name: "call", color: "gray" };
            }
        };

        const icon = getIcon();

        const getProfileText = (name) => {
            if (!name || name.toLowerCase() === "unknown") return null; // Unknown के लिए icon दिखेगा

            const firstChar = name.charAt(0);


            if (firstChar === "+" && name.length > 1) {
                return isNaN(name.charAt(1)) ? name.charAt(1).toUpperCase() : null;
            }

            return isNaN(firstChar) ? firstChar.toUpperCase() : null;
        };

        const getProfileIcon = (name) => {
            if (!name || name.toLowerCase() === "unknown") return "person";
            return isNaN(name.charAt(0)) ? null : "phone";
        };


        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    {getProfileText(name) ? (
                        <Text style={styles.profileText}>{getProfileText(name)}</Text>
                    ) : (
                        <MaterialIcons name='person' size={24} color="white" />
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.time}>+919427015204</Text>
                </View>
                <View style={{alignItems:'center',justifyContent:'space-between',marginRight:5}}>
                <MaterialIcons name={icon.name} size={20} color={icon.color} />
                <Text style={[styles.time, type === "missed" && styles.missedCall,{fontSize:12}]}>{time}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <CallLogItem name="Sam" time="11:50" type="incoming" />
            <CallLogItem name="Alex" time="15:30" type="outgoing" />
            <CallLogItem name="John" time="19:15" type="missed" />
            <CallLogItem name="+918758898864" time="11:50 a.m." type="incoming" />
            <CallLogItem name="Alex" time="10:30 a.m." type="outgoing" />
            <CallLogItem name="John" time="9:15 a.m." type="missed" />
            <Text style={styles.sectionHeaderText}>17 February 2025</Text>
            <CallLogItem name="Alex" time="10:30 a.m." type="outgoing" />
            <CallLogItem name="John" time="9:15 a.m." type="missed" />
            <CallLogItem name="+918758898864" time="11:50 a.m." type="incoming" />
            <CallLogItem name="+918758898864" time="11:50 a.m." type="incoming" />
            <CallLogItem name="Alex" time="10:30 a.m." type="outgoing" />
            <CallLogItem name="John" time="9:15 a.m." type="missed" />
        </View>
    );
}

const styles = StyleSheet.create({
    SecHeader: { fontSize: 20, color: 'rgba(108, 134, 161,1)', marginTop: 10 },
    SecHeaderCon: { alignSelf: 'center', width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    sectiolListStyle: { zIndex: 5, width: '100%', height: '100%' },
    cardContainer: { width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 16, paddingVertical: 5, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3, marginVertical: 8, marginHorizontal: 16 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 12, color: '#666', marginTop: 0 },
    priceContainer: { width: 50, height: 50, backgroundColor: '#1E90FF', borderRadius: 50, padding: 5, justifyContent: 'center', alignItems: 'center' },
    priceText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    listContent: { paddingVertical: 8 },

    sectionHeaderText:{
        color: "#777",
        fontSize: 14,
        fontWeight: "500",
        marginVertical:5,
        marginLeft:10
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth:0.25,
        borderBottomWidth: 0.25,
        borderTopColor:'#ddd',
        borderBottomColor: "#ddd",
    },
    profileContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    profileText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    time: {
        fontSize: 14,
        color: "#777",
    },
    missedCall: {
        color: "red",
        fontWeight: "bold",
    },
});

export default SectionListDisplay;