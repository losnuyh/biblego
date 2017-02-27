import Realm from 'realm';


class User extends Realm.Object{}
User.schema = {
    name: 'User',
    properties:{
	name: {type: 'string', default: '이름을 입력해주세요'},
	score: {type: 'int', default: 0}
    }
};

class Phrase extends Realm.Object{}
Phrase.schema = {
    name: 'Phrase',
    properties:{
	book: 'string',
	chapter: {type: 'string', default: ''},
	verse: {type: 'string', default: ''},
	question1: 'string',
	question2: {type:'string', default:''},
	answer: 'string'
    }
};

class Answered extends Realm.Object{}
Answered.schema ={
    name: 'Answered',
    properties:{
	index: {
	    type: 'int',
	    optional: true
	}
    }
};

class Point extends Realm.Object{}
Point.schema = {
    name: 'Point',
    properties:{
	latitude: 'float',
	longitude: 'float'
    }
}

class Markers extends Realm.Object{}
Markers.schema = {
    name: 'Markers',
    properties:{
	point: {type: 'list', objectType: 'Point'}
    }
};

class Quiz extends Realm.Object{}
Quiz.schema = {
    name: 'Quiz',
    properties:{
	quiz_index_list: {type: 'list', objectType: 'Phrase'},
	answered_list: {type: 'list', objectType: 'Answered'}
    }
};

export default new Realm({schema: [Point, Markers, Phrase, Answered, Quiz, User]});
