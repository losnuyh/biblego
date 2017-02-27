import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Modal,
    TextInput,
    Button,
    Alert,
    TouchableHighlight
} from 'react-native';

import Dimensions from 'Dimensions';

import realm from '../realm.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

import LicenseView from './license.js';

export default class SettingView extends Component{
    static navigationOption = {
	tabBar:{
	    labe : 'settings'
	}
    }
    
    constructor(props){
	super(props);
	this.handler = this.handler.bind(this);
	this.state = {
	    visible: false,
	    username: '',
	    score: '...',
	    license: false
	};
    }

    componentDidMount(){
	realm.addListener('change', ()=>{
	    if(realm.objects('User').length != 0){
		this.setState({
		    score: realm.objects('User')[0].score,
		    username: realm.objects('User')[0].name
		});
	    }
	});
    }

    handler(){
	this.setState({
	    license: !this.state.license
	});
    }

    render(){
	return(
	    <View>
	      <Modal
		visible={this.state.license}
		onRequestClose={()=>{}}
		>
		<LicenseView
		  onPress={this.handler}/>
		</Modal>
	      <View
		style={{
		    borderBottomColor:'black',
		    height:width/7,
		    borderWidth:1,
		    backgroundColor: 'darkblue'
		}}>
		<Text
		  style={{
		      textAlign:'center',
		      fontSize:40,
		      color:'white',
		      fontFamily:'TmonMonsori',
		      marginTop: 5
		  }}>
		  설 정
		</Text>
	      </View>
	      <Text
		style={{fontFamily:'TmonMonsori',fontSize:30}}>
		사용자 이름 : 
		{this.state.username}
	      </Text>
	      <Button
		title='이름 바꾸기'
		onPress={()=>{
		    this.setState({
			visible: true
		    });
		}}
		/>
		<Text
		  style={{fontFamily:'TmonMonsori', fontSize:30}}>
		  현재 점수 : {this.state.score} 점
		</Text>
		<Button
		  title='점수 초기화'
		  onPress={()=>{
		      Alert.alert('경고', '점수를 지우고 다시 시작하시겠습니까?',
				  [
				      {text: '넵', onPress: ()=>{
					  realm.write(()=>{
					      realm.objects('User')[0].score=0;
					  });
				      }},
				      {text: '아뇨', onPress: ()=>{}}
				  ]
				 );
		  }}/>
		  <View
		    style={{marginBottom:10,alignItems:'flex-end'}}>
		    <TouchableHighlight
		      onPress={()=>{this.handler();}}>
		      <Text>
			License보기
		      </Text>
		      </TouchableHighlight>
		  </View>
	      <Modal
		  animationType={'slide'}
		  transparent={true}
		  visible={this.state.visible}
		  onRequestClose={()=>{}}>
		  <View
		    style={styles.modal_container}>
		    <View
		      style={styles.modal}>
		      <Text>
			바꿀 이름을 입력해주세요.{'\n'}
		      </Text>
		      <Text
			style={{fontWeight: 'bold'}}>
			{this.state.name}
		      </Text>
		      <TextInput
			style={{width: width/5}}
			placeholder={this.state.username}
			placeholderTextColor='#dadada'
			onChangeText={(text)=>{
			    this.setState({
				name: text
			    });
			}}
			/>
			<View
			  style={{
			      flexDirection: 'row',
			      marginTop: 30
			  }}>
			<Button
			  style={{width: width/5}}
			  title="입력"
			  onPress={()=>{
			      realm.write(()=>{
				  if(this.state.name != null){
				      realm.create('User', {name: this.state.name});
				      let user = realm.objects('User')[0];
				      user.name = this.state.name;
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
			  <Text>
			    {'  '}
			  </Text>
			  <Button
			    style={{width: width/5}}
			    title="취소"
			    onPress={()=>{
				this.setState({
				    visible:false
				});
			    }}/>
			</View>
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
	fontSize: 150,
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
	flex:4,
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


