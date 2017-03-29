import React, { Component } from 'react';
import {
    AsyncStorage,
    AppRegisty,
    StyleSheet,
    Text,
    TextInput,
    Modal,
    TouchableHighlight,
    View,
    Button,
    Alert
} from 'react-native';

import Dimensions from 'Dimensions';

var Phrases = require('../phrases/phrases.json');

import realm from '../realm.js';

import CamView from './cam.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export default class Quiz extends Component{
    constructor(props){
	super(props);
	this.state={
	    visible: false,
	    phrase: Phrases[0]
	};

    }
    
    _ModalVisibleSet(index){
	this.quiz = realm.objects('Quiz')[0];
	this.setState({
	    visible: !this.state.visible,
	    index: index,
	    phrase: this.quiz.quiz_index_list[index]
	});
	this.front = this.state.phrase.question1.length;
	this.back = this.state.phrase.question2.length;
	this.pre_size = (this.front+this.back) / 100;
	if (this.pre_size<0.3){
	    this.setState({
		size: 0.3
	    });
	} else if(this.pre_size>1){
	    this.setState({
		size: 1
	    });
	} else {
	    this.setState({
		size: this.pre_size
	    });
	}
    }

    render(){
	return(
	    <Modal
	      animationType={'slide'}
	      transparent={true}
	      visible={this.state.visible}
	      onRequestClose={()=>{}}
	      >
	      <View
		style={styles.container}
		>
		<View
		  style={
		      [styles.contents_frame,
		       {
			   width: width * 4/5,
			   height: height * this.state.size
		       }]
		  }>
		  <View
		    style={styles.title_container}>
		    <Text
		      style={styles.title}>
		      {this.state.phrase.book}{'  '}
		      {this.state.phrase.chapter}{ this.state.phrase.chapter!==' '? '장 ' : ''}
		      {this.state.phrase.verse}{this.state.phrase.verse!==' '? '절' :''}
		    </Text>
		  </View>
		  <View
		    style={styles.phrase_container}>
		    <Text
		      style={styles.quiz_container}>
		      {this.state.phrase.question1}
		      <Text
			style={
			    {
				fontWeight: 'bold',
				color: 'indigo',
				fontSize:  22
			    }
			}>
			{this.state.answer? this.state.answer : '??'}
		      </Text>
		      {this.state.phrase.question2}
		      </Text>
		      <TextInput
			style={styles.input_container}
			onChangeText={(answer)=>{
			    this.setState({answer});
			}}
			placeholderTextColor="#F0F0F0"
			placeholder='답을 입력하세요.'
			/>
			<Button
			  title='답 제출'
			  onPress={()=>{
			      if(this.state.phrase.answer.indexOf(this.state.answer)==0){
				  Alert.alert('정답!', '점수가 올랐습니다.');
				  this.setState({
				      visible: false
				  });

				  realm.write(()=>{
				      try{
					  let answer = realm.create('Answered', {index: this.state.index});
					  this.quiz.answered_list.push(answer);
				      } catch(exception){

				      }
				      let user = realm.objects('User')[0];
				      user.score = user.score + 1;
				  });
				  this.props.handler(0);
			      }else{
				  Alert.alert('오답!', '다시 생각해보세요!');
			      }
			  }}/>
			  <Button
			    title=' 포기'
			    onPress={()=>{
				this.props.handler();
			    }}
			    color="#841584"
			    />
		  </View>
		</View>
	      </View>
	    </Modal>
	);
    }
}

const styles = StyleSheet.create({
    container:{
	flex:  1,
	alignItems: 'center',
	justifyContent: 'center'
    },
    contents_frame:{
	backgroundColor: '#FFFFFF',
	borderTopLeftRadius: 5,
	borderTopRightRadius: 5	
    },
    title_container:{
	flex: 1,
	backgroundColor: '#1E90FF',
	alignItems: 'center',
	justifyContent: 'center',
	borderTopLeftRadius: 5,
	borderTopRightRadius: 5
    },
    title:{
	fontFamily: 'TmonMonsori',
	fontWeight: 'bold',
	fontSize: 20,
	color: '#FFFFFF'
    },
    phrases:{

    },
    phrase_container:{
	flex: 10,
	backgroundColor: '#FFFFFF'
    },
    question_mark:{
	fontSize: 36,
	textAlign: 'center'
    },
    quiz_container:{
	flex:3,
	fontSize:  18,
	textAlign: 'center',
	fontFamily: 'TmonMonsori'
    },
    quiz:{
	flex:3
    },
    input_container:{
	flex:1,
	borderColor: 'gray',
	borderWidth: 1,
	height: 40
    }
});
