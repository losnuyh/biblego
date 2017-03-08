import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableHighlight,
    Alert,
    Button,
    BackAndroid
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
import BackgroundTimer from 'react-native-background-timer';

import MapView, { Circle, Marker } from 'react-native-maps';

import DropdownAlert from 'react-native-dropdownalert';

import UserPositionImg from './img/position.png';
import BibleImg from './img/bible.png';
import Replay from './img/replay.png';

import CamView from './cam.js';

var Phrases = require('../phrases/phrases.json');

import realm from '../realm.js';

var GpsAlert = false;

export default class MapRender extends Component {
    constructor(props){
	super(props);
	this.state = {
	    currentPosition:{
		latitude: 11,
		longitude: 11
	    }
	};
	this.marker_handler = this.MakeMarker.bind(this);
    }

    setNativeProps (nativeProps){
	this._root.setNativeProps(nativeProps);
    }

    _getcurrentPosition(){
	navigator.geolocation.getCurrentPosition(
	    (position) => {
		GpsAlert=false;
		this.setState({
		    currentPosition:{
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		    }
		});
		this._MarkersPoint();
		this.MakeMarker();
		this._watchPosition();
		BackgroundTimer.setInterval(
		    ()=>{
			this._MarkersPoint();
			this.MakeMarker(); 
		    },
		    180000
		);
		this.setState({
		    currentPosition:{
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		    }
		});
	    },
	    (error) => {
		if(!GpsAlert){
		    Alert.alert('GPS연결 실패', 'GPS를 연결한뒤 다시 실행해주세요.');
		    GpsAlert=true;
		}
		this._getcurrentPosition();
	    },
	    {enableHighAccuracy:false, timeout:10000, maximumAge: 1000}
	);
    }

    componentDidMount(){
	this.makeQuiz();
	let answered = realm.objects('Answered');
	let point = realm.objects('Point');
	let markers = realm.objects('Markers');
	if (answered.length != 0){
	    realm.write(()=>{
		realm.delete(answered);
	    });
	}
	if (point.length != 0){
	    realm.write(()=>{
		realm.delete(point);
	    });
	}
	if ( markers.length != 0){
	    realm.write(()=>{
		realm.delete(markers);
	    });
	}
	this._getcurrentPosition();
    }

    markercheck(latitude){
	try{
	    let a = realm.objects('Markers')[0].point[0].latitude.toFixed(5);
	    let b = latitude.toFixed(5);
	    return (a - b).toFixed(2);
	}
	catch(err){
	    return 1;
	}
    }

    _watchPosition(){
	navigator.geolocation.watchPosition(
	    (position)=>{
		this.setState({
		    currentPosition: {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		    }
		});
		if(this.markercheck(position.coords.latitude) != 0){
		    this._MarkersPoint();
		    this.MakeMarker(); 
		}
	    },
	    (error) => {
		this._watchPosition();
	    },
	    {enableHighAccuracy: true, timeout:200, distanceFilter: 3}
	);    
    }

    _check_range(target_latitude, target_longitude){
	let x= Math.pow((target_latitude - this.state.currentPosition.latitude), 2);
	let y= Math.pow((target_longitude - this.state.currentPosition.longitude), 2);
	return Math.sqrt(x+y)<0.00015; 
    }

    _MarkersPoint(){
	realm.write(()=>{
	    realm.delete(realm.objects('Answered'));
	    realm.delete(realm.objects('Point'));
	    realm.delete(realm.objects('Markers'));
	    realm.delete(realm.objects('Quiz'));
	});
	this.makeQuiz();
	let point_array = [];
	let key = 0;
	for (let j=1; j<5 ; j++){
	    for(let i=1; i<5 ; i++){
		let oper1 = Math.floor(Math.random() * 2) == 1 ? true : false;
		let oper2 = Math.floor(Math.random() * 2) == 1 ? true : false;
		let random_la = (Math.floor( 15 * Math.random()));
		random_la = oper1 ? - random_la : random_la;
		let random_lo = (Math.floor( 15 * Math.random()));
		random_lo = oper2 ? - random_lo : random_lo;
		let target_latitude = this.state.currentPosition.latitude+(random_la * 0.00003 * j);
		let target_longitude = this.state.currentPosition.longitude+(random_lo * 0.00003 * j);
		this.setState({
		    visible: []
		});
		realm.write(()=>{
		    let point = realm.create('Point', {latitude: target_latitude, longitude: target_longitude});
		    point_array.push(point);
		});
		key++;
	    }
	}
	realm.write(()=>{
	    let markers = realm.create('Markers',{
		point: point_array
	    });
	});
    }

    RemoveMarker(list){
	let answered = realm.objects('Quiz')[0].answered_list;
	for ( let key in answered){
	    list.splice(answered[key].index, 1);
	}
	return list;
    }

    tolist(obj){
	let result = [];
	for ( let key in obj.point ){
	    result.push(obj.point[key]);
	}
	return result;
    }

    MakeMarker(){
	this.quiz =realm.objects('Quiz');
	this.markers = realm.objects('Markers');
	let marker_list = this.tolist(this.markers[0]);
	marker_list = this.RemoveMarker(marker_list);
	let result = marker_list.map(
	    (function(obj, index){
		return(
		    <Marker
		    key={index}
		    image={BibleImg}
		coordinate={{
		    latitude: obj.latitude,
		    longitude: obj.longitude
		}}
		    ref={component => this._root = component}
		    onPress={()=>{
			if(this._check_range(obj.latitude, obj.longitude)){
			    this.refs.visible._CamOpen(index);
			} else {
			    this.dropdown.alertWithType("warn", "멀리 있습니다.", "잡을수 없어요. 조금 더 이동하세요.");
			    this.setState({
				currentPosition:{
				    latitude: this.state.currentPosition.latitude,
				    longitude: this.state.currentPosition.longitude
				}
			    });
			}
		    }}
			/>
		);
	    }
	    ).bind(this)
	);
	this.setState({
	    markers: result
	});
    }

    makeQuiz(){
	this.quiz = realm.objects('Quiz');
	if (this.quiz.length < 1){
	    let ind = this.picker_index();
	    realm.write(()=>{
		let results = [];
		for (let i = 0; i < 16; i ++){
		    let index = ind[i];
		    let phrase = Phrases[index];
		    let result = realm.create('Phrase', {
			book: phrase.book,
			chapter: phrase.chapter ? phrase.chapter.toString() : ' ',
			verse: phrase.verse ? phrase.verse.toString() : ' ',
			question1: phrase.question1,
			question2: phrase.question2 ? phrase.question2 : ' ',
			answer: phrase.answer
		    });
		    results.push(result);
		}
		if (realm.objects('Quiz').length<1){
		    const test = realm.create('Quiz',{
			quiz_index_list: results
		    });
		} else{
		    realm.objects('Quiz')[0].quiz_index_list = results;
		}
	    });
	}	
    }

    picker_index() {
	let result = [];
	while(result.length<16){
	    let ind = Math.floor(Math.random() * Phrases.length);
	    if(result.indexOf(ind)<0){
		result.push(ind);
	    }
	}
	return result;
    }

    static navigationOption = {
	tabBar:{
	    label: 'Map'
	}
    };

    render(){
	return(
	    <View
	      style={styles.container}>
	      <CamView
	    ref="visible"
	    MakeMarker={this.marker_handler}
		/>
	      <MapView
		region={{
		    latitude: this.state.currentPosition.latitude,
		    longitude: this.state.currentPosition.longitude,
		    latitudeDelta: 0.0015,
		    longitudeDelta: 0.0015
		}}
		style={styles.map}
		zoomEnabled={false}
		scrollEnabled={false}
		pitchEnabled={false}
		>
		<Circle
		  center={{
		      latitude: this.state.currentPosition.latitude,
		      longitude: this.state.currentPosition.longitude
		  }}
		  radius={500}
		  fillColor="rgba(25, 65, 95, 0.8)"
		  />
		{this.state.markers}
		<Marker
		  image={UserPositionImg}
		  coordinate={{
		      latitude: this.state.currentPosition.latitude,
		      longitude: this.state.currentPosition.longitude
		  }}
		  />
	      </MapView>
	      <DropdownAlert
		ref={(ref)=>this.dropdown = ref}
		closeInterval={3500}
		/>
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
