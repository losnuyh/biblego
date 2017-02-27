import  React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Modal,
    TextInput,
    Button,
    Alert,
    Image,
    TouchableHighlight
} from 'react-native';

import Dimensions from 'Dimensions';

import TimerMixin from 'react-timer-mixin';

const Realm = require('realm');

var Phrases = require('../phrases/phrases.json');

import realm from '../realm.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class MainView extends Component{
    constructor(props){
	super(props);
	let visible;
	let username;
	if(realm.objects('User').length>0){
	    visible=false;
	    username=realm.objects('User')[0].name;
	} else {
	    visible=true;
	    username=null;
	}
	this.state ={
	    indeterminate: false,
	    loading: true,
	    visible: visible,
	    score: '...',
	    username: username
	};
    }
    
    get_user_position(){
	navigator.geolocation.getCurrentPosition(
	    (position)=>{
		console.log(JSON.stringify(position));
	    },
	    (error) => {},
	    {enableHighAccuracy:true, timeout:2000, maximumAge: 1000}
	);
    }

    componentWillMount(){
	this.makeQuiz();
    }

    componentDidMount(){
	realm.addListener('change', ()=>{
	    if(realm.objects('User').length > 0){
		if(realm.objects('User')[0].score == 0){
		    this.setState({
			score: '빵점',
			username: realm.objects('User')[0].name			
		    });
		}else{
		    this.setState({
			score: realm.objects('User')[0].score + '점',
			username: realm.objects('User')[0].name
		    });
		}
	    }
	    this.makeQuiz();
	});
    }

    makeQuiz(){
	this.get_user_position();
	this.quiz = realm.objects('Quiz');
	if (this.quiz.length < 1){
	    realm.write(()=>{
		let results = [];
		for (let i = 0; i < 16; i ++){
		    let ind = this.picker_index();
		    let phrase = Phrases[ind];
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
	let ind = Math.floor(Math.random() * Phrases.length);
	return ind;
    }

    howtoplay(){
	
    }

    static navigationOption = {
	tabBar: {
	    label : 'Home'
	}
    }

    render(){
	return(
	    <View
	      style={{flex:1}}>
	      {/** 상단 View */}
	      <View
		style={styles.top}
		>  
	      <Text
		style={styles.titlefont}
		>BibleGo! </Text>
	      </View>
	      {/** 중단 View */}
	      <View
		style={styles.mid}
		>
		{/** 중단 컨테이너 View */}
		<View
		  style={styles.mid_container}>
		  {/** 유저 이름 */}
		  <View
		    style={styles.mid_user_info}>
		    <Text
		      style={styles.username}>
		      {this.state.username!=null ? '내 이름은 ' : ''}{this.state.username}
		    </Text>
</View>
{/** 점수 정보 */}
		  <View
		    style={styles.score_container}>
		    <Text
		      style={
			  {
			      fontFamily:'TmonMonsori',
			      fontSize:20,
			      textAlign:'center'
			  }
		      }>
		      내 점수는..
		    </Text>
		    <Text
		      style={styles.score}>
		      {this.state.score ? this.state.score : '...'}
		    </Text>
		  </View>
		</View>
	      </View>
	      {/** 하단 View */}
	      <View
		style={styles.bottom}
		>
		<View
		  style={styles.bottom_container}>
		    <View
		      style={{alignItems:'center'}}>
		      <View
			style={styles.img}>
		      </View>
		    </View>
		</View>
	      </View>
	      <Modal
		animationType={'slide'}
		transparent={true}
		visible={realm.objects('User').lenght > 0 || this.state.visible==false? false : true}
		onRequestClose={()=>{}}>
		<View
		  style={styles.modal_container}>
		<View
		  style={styles.modal}>
		  <Text>
		    이름을 입력해주세요.{'\n'}
		  </Text>
		  <Text
		    style={{fontWeight: 'bold'}}>
		    {this.state.name}
		    </Text>
		  <TextInput
		    style={{width: width/5}}
		    onChangeText={(text)=>{
			this.setState({
			    name: text
			});
		    }}
		    />
		    <Button
		      title="입력"
		      onPress={()=>{
			  realm.write(()=>{
			      if(this.state.name != null){
				  realm.delete(realm.objects('User'));
				  realm.create('User', {name: this.state.name});
				  this.setState({
				      visible:false,
				      username:this.state.name
				  });
			      }else{
				  Alert.alert('필수',"이름을 입력해주세요!");
			      }
			  });

		      }}
		      />
		</View>
		</View>
	      </Modal>
	    </View>
	);
    }
}

const styles = StyleSheet.create({
    modal_container:{
	alignItems: 'center'
    },
    modal:{
	backgroundColor:'#f9f9f9',
	borderBottomColor: 'black',
	borderRightColor: 'black',
	borderStyle: 'solid',
	borderWidth: 0.5,
	marginTop: 70,
	borderRadius: 8,
	height: height / 3,
	width: (width*2) /3,
	alignItems: 'center',
	justifyContent: 'center'
    },
    score_container:{
	flex:3,
	alignItems: 'center',
	justifyContent: 'center'
    },
    score:{
	textAlign: 'center',
	fontSize: 180,
	fontFamily: 'TmonMonsori',
	color: 'black'
    },
    top:{
	flex: 1,
	backgroundColor: '#4488ff'
    },
    titlefont:{
	fontFamily: 'Cartoon',
	marginTop: 10,
	fontSize: 50,
	textAlign: 'center',
	color: 'white'
    },
    mid:{
	flex:5,
	backgroundColor: '#ffffff'
    },
    mid_container:{
	flex:1 
    },
    mid_user_info:{
	flex:1
    },
    username:{
	textAlign: 'center',
	marginTop: 8,
	fontFamily: 'TmonMonsori',
	fontSize: 35
    },
    bottom:{
	flex:1,
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#ffffff'
    },
    bottom_container:{
	flex: 1,
	flexDirection: 'row',
	alignItems: 'center'
    },
    img:{
	flex: 1
    },
    howtoplayimg:{
	width: width/5,
	height: width/5
    },
    howtoplay:{
	flex: 2
    },
    howtoplaytext:{
	fontFamily:'TmonMonsori',
	fontSize: 40
    }
});
