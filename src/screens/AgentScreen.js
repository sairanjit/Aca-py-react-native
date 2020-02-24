import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DBServices from '../realm/DBServices';

const AgentScreen = ({ navigation }) => {
    const [Agenturl, setAgenturl] = useState('');
    const [showErrorMessage, setErrorMsg] = useState('');

    const saveAgentUrl = () => {
        if (Agenturl == '') {
            console.log('Data0');
            // setErrorMsg(showErrorMessage => "Enter All details");
        }
        else {
            navigation.navigate('Home');
            let Agenturlsave = {
                agentUrl: Agenturl
            }
            console.log('Data1');
            DBServices.saveInfo(Agenturlsave);
        }
    };

    return (
        <View style={styles.screenstyle}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>Agent Url</Text>
                <TextInput style={styles.textinput}
                    placeholder='Agent Url'
                    onChangeText={(text) => setAgenturl(Agenturl => text)}
                    keyboardType={'numbers-and-punctuation'}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => saveAgentUrl()}>
                    <View style={styles.btn_create}>
                        <Text style={styles.textstyle_create}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenstyle: {
        flex: 1,
        backgroundColor: '#0C91E8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textinput: {
        marginVertical: 10,
        padding: 10,
        height: 50,
        width: 350,
        borderColor: 'white',
        borderWidth: 2,
        backgroundColor: 'white',
        color: 'black',
        fontSize: 18,
        borderRadius: 50,
        borderColor: 'white'
    },
    btn_create: {
        marginVertical: 30,
        width: 300,
        height: 60,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textstyle_create: {
        color: '#0C91E8',
        fontSize: 24
    }

});

export default AgentScreen;