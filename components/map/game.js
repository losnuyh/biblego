import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    Image,
    TouchableHighlight,
    BackAndroid
} from 'react-native';

import Dimensions from 'Dimensions';

import { SensorManager } from 'NativeModules';
import Camera from 'react-native-camera';
import * as Animatable from 'react-native-animatable';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const init_bottom = (height/2);
const init_right = (width/2);

export default class GameView extends Component{
    constructor(props){
	super(props);
    }
}
