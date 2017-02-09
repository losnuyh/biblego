import  React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
} from 'react-native';

export default class MainView extends Component{
    static navigationOption = {
	tabBar: {
	    label : 'Home'
	}
    }
    render(){
	return(
	    <Text>mainview </Text>
	);
    }
}

