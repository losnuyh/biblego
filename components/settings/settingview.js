import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text
} from 'react-native';

export default class SettingView extends Component{
    static navigationOption = {
	tabBar:{
	    labe : 'settings'
	}
    }
    render(){
	return(
	    <Text>settings</Text>
	);
    }
}
