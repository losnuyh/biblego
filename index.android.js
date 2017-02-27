import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button,
    BackAndroid
} from 'react-native';

import { TabNavigator } from 'react-navigation';

import MainView from './components/main/mainview';
import MapRender from './components/map/mapview';
import SettingView from './components/settings/settingview';


BackAndroid.addEventListener('hardwareBackPress', function(){
    return true;
});

const Nav = TabNavigator({
    '내 정보':{
	screen: MainView
    },
    '주변탐색':{
	screen: MapRender
    },
    '설정':{
	screen: SettingView
    }
},{
    tabBarOptions: {
	activaTintColor: '#91e63',
	labelStyle:{
	    fontSize: 13,
	    fontFamily: 'TmonMonsori'
	}
    },
    tabBarPosition: 'bottom'
});

AppRegistry.registerComponent('BibleGo', ()=> Nav);
