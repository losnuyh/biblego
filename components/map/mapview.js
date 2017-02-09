import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

export default class MapRender extends Component {
    constructor(props){
	super(props);
	this.state={
	    currentPosition:{
		altitude: 127,
		longitude: 36
	    }
	};
    }

    componentDidMount(){
	navigator.geolocation.getCurrentPosition(
	    (position) => this.setState({
		initialPosition: {
		    altitude: position.coords.altitude,
		    longitude: position.coords.longitude
		}
	    }),
	    (error) => alert(JSON.stringify(error)),
	    {enableHighAccuracy:true, timeout:20000, maximumAge: 1000}
	);
	this.watchPS = navigator.geolocation.watchPosition(
	    (position)=>this.setState({
		currentPosition: {
		    latitude: position.coords.latitude,
		    longitude: position.coords.longitude
		}
	    }),
	    (error) => alert(JSON.stringify(error)),
	    {enableHighAccuracy: true, timeout:20000, distanceFilter: 3}
	);
    }

    componentWillUnmount(){
	navigator.geolocation.clearWatch(this.watchPS);
    }

    static navigationOption = {
	tabBar:{
	    label: 'Map'
	}
    }

    render(){
	return(
	    <View>
	      <Text>{typeof this.state.currentPosition.latitude}</Text>
	    </View>
	);
	
    }
}

const styles = StyleSheet.create({
    container:{
	...StyleSheet.absoluteFillObject,
	justifyContent: 'flex-end',
	alignItems: 'center'
    },
    map:{
	...StyleSheet.absoluteFillObject
    }
});
