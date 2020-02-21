import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Modal, KeyboardAvoidingView } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';
import acapy_api from '../api/acapy_api';
import base64 from 'react-native-base64';
import axios from 'react-native-axios';


const { height, width } = Dimensions.get('screen');

const HomeScreen = ({ navigation }) => {

    // const api = async () => {
    //     try {
    //         const acapy_api = axios.create({
    //             baseURL: `http://${Agenturl}`
    //         });
    //         return acapy_api;
    //     } catch (err) {
    //         console.log(err);
    //         console.log('Something went wrong');
    //     }
    // }

    const [popup, setpopup] = useState(false);
    const [popupcam, setpopupcam] = useState(false);
    const [gen_url, setgenUrl] = useState('');
    const [con_to, setcon_to] = useState('');
    const [conn_s, setconn_s] = useState('');
    // const [Agenturl, setAgenturl] = useState('');

    const data = async () => {
        try {
            // api();
            const response = await acapy_api.post('/connections/create-invitation')
            console.log(response.data.invitation_url);
            const invite_url = response.data.invitation_url;
            const url = invite_url.split('=')[1];
            console.log("Invitation url", url);
            return url;
        } catch (err) {
            console.log(err);
            console.log('Something went wrong');
            return {};
        }
    };

    const receiveData = async (url_64) => {
        try {
            const receive_response = await acapy_api.post('/connections/receive-invitation', url_64);
            console.log("Receive res", receive_response);
        } catch (err) {
            console.log(err);
            console.log('Something went wrong');
            return {};
        }
    };

    const checkConnections = async () => {
        try {
            const connection_response = await acapy_api.get('/connections');
            const connected_to = JSON.stringify(connection_response.data.results[0].their_label)
            const connection_status = JSON.stringify(connection_response.data.results[0].state)
            console.log("Connected to :", connected_to);
            console.log("Connection state :", connection_status);
            setcon_to(con_to => connected_to);
            setconn_s(conn_s => connection_status);

        } catch (err) {
            console.log(err);
            console.log('Something went wrong');
            return {};
        }
    };

    const createInvite = async () => {
        setpopup(popup => true);
        let response = await data();
        console.log("Response", response)
        setgenUrl(gen_url => response);
        console.log("gen_url", gen_url)
    };

    const receiveInvite = async (e) => {
        setpopupcam(popupcam => false);
        console.log(e.data);
        const url_64 = base64.decode(e.data);
        console.log("Base64 Url", url_64);
        await receiveData(url_64);
    };

    return (
        <KeyboardAvoidingView style={styles.screenstyle}>
            <View>
                <View style={styles.topnavigation}>
                    <Text style={styles.navtext}>Home</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                    {/* <View style={styles.Text_input}>
                        <TextInput
                            style={{ fontSize: 20 }}
                            placeholder={'Enter Agent Url'}
                            onChangeText={(text) => setAgenturl(Agenturl => text)}
                            onSubmitEditing={() => api()}
                        />
                    </View> */}
                    <TouchableOpacity onPress={() => createInvite()}>
                        <View style={styles.btn_create}>
                            <Text style={styles.textstyle_create}>Create Invitation</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setpopupcam(popupcam => true)}>
                        <View style={styles.btn_open}>
                            <Text style={styles.textstyle_open}>Receive Invitation</Text>
                        </View>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={popupcam}
                        onRequestClose={() => setpopupcam(popupcam => false)}
                    >
                        <QRCodeScanner
                            cameraStyle={{ height, width, alignSelf: 'center' }}
                            onRead={(e) => receiveInvite(e)}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            showMarker
                        />
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={popup}
                        onRequestClose={() => setpopup(popup => false)}
                    >
                        <TouchableOpacity onPress={() => setpopup(popup => false)} style={{ height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000070' }}>
                            <View style={{ height: 300, backgroundColor: 'white', width: 300 }}>
                                <Text style={{ textAlign: 'center', fontSize: 24, paddingVertical: 10 }}>Scan this invitation url</Text>
                                {
                                    gen_url == '' ? null : (
                                        <QRCode
                                            value={gen_url}
                                            size={300}
                                        />
                                    )
                                }
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    <TouchableOpacity onPress={() => checkConnections()}>
                        <View style={styles.btn_conn}>
                            <Text style={styles.textstyle_open}>Check connections</Text>
                        </View>
                    </TouchableOpacity>
                    <View >
                        <Text style={{ paddingTop: 30, borderBottomWidth: 4, borderBottomColor: '#000000', fontSize: 24 }}>All Connections</Text>
                        <Text style={{ paddingTop: 40, fontSize: 20, fontWeight: "bold" }}>Connected to : {con_to}</Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Connection state : {conn_s}</Text>
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

export default HomeScreen;
