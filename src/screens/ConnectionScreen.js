import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Modal, KeyboardAvoidingView } from 'react-native';

import base64 from 'react-native-base64';
import axios from 'react-native-axios';
import DBServices from '../realm/DBServices';

const { height, width } = Dimensions.get('screen');

const ConnectionScreen = ({ navigation }) => {
    const [gen_url, setgenUrl] = useState('');
    const [con_to, setcon_to] = useState('');
    const [conn_s, setconn_s] = useState('');
    const [aliasName, setaliasName] = useState('');

    const Agentdb = DBServices.fetchAgentDB();
    // console.log(Agentdb);
    let response1;
    Agentdb.map(item => {
        response1 = item["agentUrl"]
    });

    const acapy_api = axios.create({
        baseURL: `http://${response1}`
    });

    const checkConnections = async () => {
        try {
            const connection_response = await acapy_api.get('/connections');
            const connected_to = JSON.stringify(connection_response.data.results[0].their_label)
            const connection_status = JSON.stringify(connection_response.data.results[0].state)
            const connection_name = JSON.stringify(connection_response.data.results[0].alias)
            console.log("Connected to :", connected_to);
            console.log("Connection state :", connection_status);
            console.log("Connection name :", connection_name);
            setcon_to(con_to => connected_to);
            setconn_s(conn_s => connection_status);
            setaliasName(aliasName => connection_name);
        } catch (err) {
            console.log(err);
            console.log('Something went wrong');
            return {};
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screenstyle}>
            <View>
                <View style={styles.topnavigation}>
                    <Text style={styles.navtext}>Connections</Text>
                </View>
                <TouchableOpacity onPress={() => checkConnections()}>
                    <View style={styles.btn_conn}>
                        <Text style={styles.textstyle_open}>View all connections</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center' }} >
                        <Text style={{ paddingTop: 30, borderBottomWidth: 4, borderBottomColor: '#000000', fontSize: 24 }}>{aliasName} Agent</Text>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ paddingTop: 30, fontSize: 24 }}>Connections</Text>
                        <Text style={{ paddingTop: 40, fontSize: 20, fontWeight: "bold" }}>Name : {con_to}</Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>State : {conn_s}</Text>
                    </View>
                </View>
            </View >
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screenstyle: {
        flex: 1
    },
    topnavigation: {
        backgroundColor: '#260101',
        height: 60,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    navtext: {
        height: 60,
        width: '80%',
        padding: 10,
        textAlignVertical: 'center',
        fontSize: 20,
        color: 'white'
    },
    logoview: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Text_input: {
        marginVertical: 30,
        width: 300,
        height: 60,
        borderWidth: 2,
        borderColor: '#0455BF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_create: {
        marginVertical: 30,
        width: 300,
        height: 60,
        borderWidth: 2,
        borderColor: '#0455BF',
        borderRadius: 10,
        backgroundColor: '#0455BF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_open: {
        width: 300,
        height: 60,
        borderWidth: 2,
        borderColor: '#0455BF',
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_conn: {
        marginVertical: 20,
        width: 300,
        height: 60,
        borderWidth: 2,
        alignSelf: 'center',
        borderColor: '#0455BF',
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textstyle_create: {
        color: 'white',
        fontSize: 18
    },
    textstyle_open: {
        color: '#0455BF',
        fontSize: 18
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    },
    centerText: {
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    }
});

export default ConnectionScreen;
