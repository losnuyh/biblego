import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    Image,
    StatusBar,
    Modal,
    TouchableHighlight,
    BackAndroid
} from 'react-native';

import Dimensions from 'Dimensions';

import { SensorManager } from 'NativeModules';
import Camera from 'react-native-camera';
import * as Animatable from 'react-native-animatable';

import Quiz from './quiz';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const init_bottom = (height/2) - 64;
const init_right = (width/2) - 64;


BackAndroid.addEventListener('hardwareBackPress', function(){
    return true;
});

export default class CamView extends Component{
    constructor(props){
	super(props);
	this.state={
	    visible: false,
	    target_bottom: init_bottom,
	    target_right: init_right,
	    over:{
		right: false,
		left: false,
		top: false,
		bottom: false
	    },
	    arrow:{
		bottom: height * 2,
		right: width * 2
	    }
	};
	this.handler = this.handler.bind(this);
    }

    _CamOpen(index){
	this.setState({
	    visible: !this.state.visible,
	    index: index,
	    target_bottom : init_bottom,
	    target_right: init_right
	});
    }

    handler(){
	this.setState({
	    visible: false
	});
	this.props.MakeMarker();
    }

    componentDidMount(){
	SensorManager.startGyroscope(100);
	DeviceEventEmitter.addListener('Gyroscope', function(data){
	    let bottom_point = this._bottomset();
	    let right_point = this._rightset();
	    this.setState({
		target_bottom: this.state.target_bottom - (data.x.toFixed(5) * height/10),
		target_right: this.state.target_right - (data.y.toFixed(5) * width/10),
		over:{
		    right: (this.state.target_right) < -128 ? true : false,
		    left: (this.state.target_right) > width ? true: false,
		    top: (this.state.target_bottom) > height ? true : false,
		    bottom: (this.state.target_bottom) < -128 ? true: false
		},
		arrow:{
		    bottom: (this.state.over.right||this.state.over.left) ? bottom_point : height * 2,
		    right: (this.state.over.bottom||this.state.over.top) ? right_point : width * 2
		}		
	    });
	}.bind(this));
    }

    _bottomset(){
	if(this.state.target_bottom+64<0){
	    return 0;
	}else if(this.state.target_bottom > height-64){
	    return height-64;
	}else{
	    return this.state.target_bottom+64;
	}
    }

    _rightset(){
	if(this.state.target_right<0){
	    return 0;
	}else if(this.state.target_right+64 > width){
	    return width-64;
	}else{
	    return this.state.target_right + 64;
	}
    }

    render(){
	return(
	    <Modal
	      animationType={'slide'}
	      transparent={false}
	      visible={this.state.visible}
	      onRequestClose={()=>{}}
	      >
    <Quiz
      ref='visible'
      handler={this.handler}
      />
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <Camera
	ref={(cam)=>{
	    this.camera = cam;
	}}
	style={styles.cam}
	aspect={Camera.constants.Aspect.fill}>
	<Animatable.View
	  animation="bounce"
	  iterationCount="infinite"
	  style={{
	      position: 'absolute',
	      bottom: this.state.target_bottom,
	      right: this.state.target_right 
	  }} 
	  direction='alternate'>
	  <TouchableHighlight
	    underlayColor='transparent'
	    onPress={()=>{
		this.refs.visible._ModalVisibleSet(
		    this.state.index
		);

	    }}>
	    <Image
	      source={require('./img/targetcam.png')}/>
	  </TouchableHighlight>
	</Animatable.View>
	<Image
	  style={{
	      position: 'absolute',
	      bottom: this.state.over.right ? this.state.arrow.bottom : height * 2,
	      right: 20
	  }}
	  source={require('./img/right-arrow.png')}/>
	<Image
	  style={{
	      position: 'absolute',
	      bottom: this.state.over.left ? this.state.arrow.bottom : height*2,
	      left: 20
	  }}	      
	  source={require('./img/left-arrow.png')}/>
	<Image
	  style={{
	      position: 'absolute',
	      right: this.state.over.bottom ? this.state.arrow.right : width*2,
	      bottom: 20
	  }}	      
	  source={require('./img/down-arrow.png')}/>
	<Image
	  style={{
	      position: 'absolute',
	      right: this.state.over.top ? this.state.arrow.right : width*2,
	      top: 20
	  }}	      
	  source={require('./img/up-arrow.png')}/>
      </Camera>
    </View>
</Modal>
	);
    }
}


const styles =  StyleSheet.create({
    container:{
	flex: 1
    },
    cam:{
	flex: 1,
	height: height,
	width: width
    }
});
