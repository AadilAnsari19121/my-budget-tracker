import { FlatList, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const api_base_url = 'http://192.168.0.129:3000/';
import Feather from '@expo/vector-icons/Feather';


const Not = () => {
    const [token, setToken] = useState();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const flatListRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [options, setOptions] = useState([]);


    const login = async () => {
        try {
            const url = `${api_base_url}login`;
            const data = {
                user_name: "aadil",
                pwd: "123456"
            }
            const res = await axios.post(url, data);
            console.log(res.data.token);

            if (res.data) {
                if (res.data.token) {
                    setToken(res.data.token);
                    getoptions(res.data.token);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const savetokenInLocal = async () => {
            try {
                if (!token) {
                    return;
                }
                await AsyncStorage.setItem('token', token);
                console.log('token saved');
            } catch (error) {
                console.log(error, " for saving in local");
            }
        }
        savetokenInLocal();
    }, [token]);

    useEffect(() => {
        const getToken = async () => {
            try {
                const data = await AsyncStorage.getItem('token');
                if (data) setToken(data);
            } catch (error) {
                console.log(error, "error for geting token");
            }
        }

        login();
        getToken();
    }, []);


    const getoptions = async (token) => {
        try {
            const res = await axios.post(`${api_base_url}get-options2`, {}, {
                headers: {
                    api_key: token
                }
            });

            console.log(res.data);
            setOptions(res.data);
        } catch (error) {
            console.log(error, " get op");
        }
    }

    const sendMessageToBot = async (input) => {
        setInput('');
        if (!input.trim()) return;
        const newMessages = [...messages, { type: "user", text: input }];
        setMessages(newMessages);

        try {
            const data = { message: input.trim() };
            const res = await axios.post(`${api_base_url}chat2`, data, {
                headers: {
                    api_key: token
                }
            });

            console.log(res.data);
            const botReply = res.data.chat_response;
            const botOptions = res.data.chat_options;
            const url = res.data.direct_chat_url;
            setMessages([...newMessages, { type: "bot", text: botReply, chat_options: botOptions, direct_link: url }]);
        } catch (error) {
            console.log(error)
        }

    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const gotolink = async (link) => {
        try {
            await Linking.openURL(link);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <View style={{ flex: 1, padding: 10 }}>
            {/* Messages */}
            <ScrollView ref={scrollViewRef} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {messages.map((msg, index) => (
                    <View key={index}>
                        {/* Message Bubble */}
                        <View style={{
                            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.type === "user" ? "#007AFF" : "#E5E5EA",
                            padding: 10, marginVertical: 5, borderRadius: 10,
                            marginTop: msg.type === "user" ? 20 : 15,
                        }}>
                            <Text style={{ color: msg.type === "user" ? "#FFF" : "#000" }}>{msg.text}</Text>
                        </View>

                        {/* Options only for bot messages */}
                        {msg.type === "bot" && msg.chat_options?.length > 0 && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                                {msg.chat_options.map((item, idx) => (
                                    <TouchableOpacity
                                        key={`${item}_${idx}`}
                                        style={{
                                            backgroundColor: '#f7f7fa',
                                            padding: 10,
                                            borderRadius: 5,
                                            borderColor: 'rgba(0,0,0,0.5)',
                                            borderWidth: 0.2,
                                            alignItems: 'center',
                                            paddingHorizontal: 10,
                                            alignSelf: 'flex-start',
                                        }}
                                        onPress={() => sendMessageToBot(item)}
                                    >
                                        <Text style={{ color: "#000", fontSize: 12 }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {msg.type === "bot" && msg.direct_link && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#f7f7fa',
                                        padding: 10,
                                        borderRadius: 5,
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 0.2,
                                        alignItems: 'flex-start',
                                        paddingHorizontal: 10,
                                        alignSelf: 'flex-start',
                                    }}
                                    onPress={() => { gotolink(msg.direct_link) }}
                                >

                                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                        <Text style={{ color: "#000", fontSize: 12, textAlign: 'left' }}>click the link for help</Text>

                                        <Feather name="external-link" size={12} color="black" />
                                    </View>
                                    <Text style={{ color: "#5495ff", fontSize: 12, borderBottomColor: '#5495ff', borderBottomWidth: 0.5 }}>{msg.direct_link}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
                ))}
            </ScrollView>



            {options && (
                <FlatList
                    data={options}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#4CAF50", padding: 7, margin: 5, borderRadius: 5, height: 40, borderColor: 'rgba(0,0,0,0.5)', borderWidth: 0.2, alignItems: 'center', paddingHorizontal: 10
                            }}
                            onPress={() => sendMessageToBot(item.query_text)}
                        >
                            <Text style={{ color: "#fff" }}>{item.query_text}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ marginBottom: 0, height: 0, maxHeight: 55, marginTop: 7 }}
                />
            )}


            {/* Input Box */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 5 }}>
                <TextInput
                    style={{
                        flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5,
                        padding: 10, backgroundColor: "#fff"
                    }}
                    placeholder="Type your message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity
                    style={{ backgroundColor: "#4CAF50", padding: 10, marginLeft: 5, borderRadius: 5, width: 50, alignItems: 'center', zIndex: 5, elevation: 5 }}
                    onPress={() => sendMessageToBot(input)}
                >
                    <FontAwesome name="send" size={22} color="white" style={{ marginLeft: -5, elevation: 5, zIndex: 2, shadowColor: 'white', shadowOpacity: 1, shadowRadius: 15 }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Not

const styles = StyleSheet.create({});