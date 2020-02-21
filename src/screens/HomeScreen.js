import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';
import acapy_api from '../api/acapy_api';
import base64 from 'react-native-base64';

const { height, width } = Dimensions.get('screen');

const HomeScreen = ({ navigation }) => {
    const [popup, setpopup] = useState(false);
    const [popupcam, setpopupcam] = useState(false);
    const [gen_url, setgenUrl] = useState('');

    const data = async () => {
        try {
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
    };

    return (
        <View style={styles.screenstyle}>
            <View style={styles.topnavigation}>
                <Text style={styles.navtext}>Home</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
            </View>
        </View >
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
