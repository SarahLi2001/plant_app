import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React, { Component } from 'react'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import * as firebase from 'firebase'

import { Provider } from 'react-redux'
// provider is a tag that will wrap
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
// root folder from reducers
import thunk from 'redux-thunk'
const store = createStore(rootReducer,
  applyMiddleware(thunk));

const firebaseConfig = {
  apiKey: "AIzaSyD-le1EVcYmEkWrCJw_fj-1bcYH-WDv5co",
  authDomain: "plant-app-c9d10.firebaseapp.com",
  projectId: "plant-app-c9d10",
  storageBucket: "plant-app-c9d10.appspot.com",
  messagingSenderId: "271901594763",
  appId: "1:271901594763:web:a8744becf12471c9a3308e",
  measurementId: "G-8D8GM23T52"
};


let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'

import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'


// Stack Navigator provides a way for your app to transition between
// screens where each new app is placed on top of a stack
const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false
    }
  }
  // componentDidMount() allows us to execute the React code when the component
  // is already placed on the DOM, (mounting phase -> after the component is rendered)
  componentDidMount() {
    //check if the user is logged in or not
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name= "Landing" component={LandingScreen} options={{ headerShown: false}}/>
            <Stack.Screen name = "Register" component={RegisterScreen} />
            <Stack.Screen name = "Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name= "Main" component={MainScreen}/>
            <Stack.Screen name= "Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name= "Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name= "Comment" component={CommentScreen} navigation={this.props.navigation}/>

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )

    
  }
}

export default App

