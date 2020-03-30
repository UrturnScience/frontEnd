import React, { Component } from 'react';
import {View, TouchableOpacity, StyleSheet, Text, } from 'react-native';
import { DbContext } from '../context';
import { TextInput } from 'react-native-gesture-handler';
import Axios from 'axios';
import { BACKEND_URL } from 'react-native-dotenv';
import * as firebase from 'firebase';

class RoomJoin extends Component{

    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            roomId: ""
        }
    }

    static contextType = DbContext;

    componentDidMount() {
        console.log("Setting state in RoomJoin from context...");
        this.setState({
            userId: this.context.user._id
        });
        console.log(this.context.user._id);
    }

    joinRoom(roomId, userId) {
        if (!roomId) {
            alert("Please enter a room code");
            return;
        }
        // console.log(`Join room ${roomId} for user ${userId}`);
        Axios.post(`${BACKEND_URL}/roomuser/add/${roomId}/${userId}`).then(res => {
            this.props.reloadContext();
        }).catch(e => {
            alert("Room code doesn't exist");
            this.textInput.clear();
        });
    }

    async createRoom(userId) {
        console.log(`Create room and add user ${userId}`);
        try {
            let res = await Axios.post(`${BACKEND_URL}/room/create`);
            console.log("New room id: " + res.data.room._id);
            this.joinRoom(res.data.room._id, userId);
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.roomCode}
                    placeholder="Room Code"
                    autoCapitalize="none"
                    onChangeText={roomId => this.setState({roomId})}
                    ref={input => {this.textInput = input}}
                ></TextInput>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.joinRoom(this.state.roomId, this.state.userId)}>
                    <Text style={styles.buttonText}>Join a room</Text>
                </TouchableOpacity>
                <View style={styles.horizontalRule}/>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.createRoom(this.state.userId)}>
                    <Text style={styles.buttonText}>Create a room</Text>
                </TouchableOpacity>
                <View style={styles.equalizer}></View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        justifyContent: 'center',
        height: "100%",
        alignItems: "center",
    },
    buttonText:{
        textAlign:'center',
        color:'#fff',
        // fontWeight:'bold',
        fontSize: 22,
    },
    buttonContainer:{
        backgroundColor:'#3B3B98',
        padding: 12,
        borderRadius: 8,
        width: "70%",
    },
    horizontalRule: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "90%",
        marginBottom: 50,
        marginTop: 50,
    },
    roomCode: {
        textAlign: "center",
        fontSize: 22,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 12,
        borderRadius: 8,
        width: "70%",
        marginBottom: 10,
    },
    equalizer: {
        height: 40,
    }
});

export default RoomJoin;