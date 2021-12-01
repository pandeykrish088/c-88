import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Google from "expo-google-app-auth";
import firebase from "firebase";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
}

export default class LoginScreen extends Component {
constructor(props) {
super(props)
this.state = {
fontsLoaded: false
}
}

async loadFonts() {
  await Font.loadAsync({customFonts})
  this.setState({fontsLoaded: true})
}

componentDidMount() {
  this.loadFonts();
}

  isUserEqual = (googleUser, firebaseUser) => {
  if(firebaseUser) {
  var google = firebaseUser.google;
  for(var i = 0; i < google.length; i++) {

   if(
    google[i].providerId === firebaseUser.auth.GoogleAuthProvider.PROVIDER_ID
    && google[i].uid === googleUser
    .getBasicProfile()
    .getId()
   ) {
    return true;
   }

  }
  }
   return false;
  }

  SignIn = googleUser => {
   var Gmail = firebase.auth().onAuthStateChanged(firebaseUser => {
    Gmail();

   if(!this.isUserEqual(googleUser, firebaseUser)) {
    
 var credential = firebase.auth.GoogleAuthProvider.credential(
   googleUser.idToken,
   googleUser.accessToken
  )

  firebase.auth()
  .signInWithCredential(credential)
  .then(function(result) {

   if(result.additionalUserInfo.isNewUser) {
    firebase.database()
    .ref("/user" + result.user.uid)
    .set({

    gmail: result.user.email,
    profile_picture: result.additionalUserInfo.profile.picture,
    locale: result.additionalUserInfo.profile.locale,
    first_name: result.additionalUserInfo.profile.given_name,
    last_name: result.additionalUserInfo.profile.family_name,
    current_theme: "dark"

    })
   .then(function(snapshot) {})
   }

  })

  .catch(error => {

   var Code = error.code;
   var Message = error.message;

   var email = error.email;
   var credential = error.credential;
    
  })
    
   }
   else {
    console.log("This user already signed-in Firebase.")
   }

   })
  }

  SignInWithGoogle = async () => {
   try {
   const result = await Google.logInAsync({
    behaviour: "web",
    androidClientId: "958076585750-911sqiv3ob14jcr76o7hc7cm1k7dp3t2.apps.googleusercontent.com",
    iosClientId: "958076585750-56pt0064f2vl5sckg868je0du93umqde.apps.googleusercontent.com",
    scopes: ["profile", "email"]
   })

   if(result.type === "success") {
    this.SignIn(result)
    return result.accessToken
   }

   else {
    return {cancelled: true}
   }
   }

   catch (error) {
    console.log(error.message)
   }

  }

  render() {
  if (!this.state.fontsLoaded) {
    return <AppLoading />;
  }

  else{
    return (
      <View style={styles.container}>
      <SafeAreaView style={styles.droidSafeArea}/>

      <View style={styles.appTitle}>
       <Image
       source={require("../assets/logo.png")}
       style={styles.appIcon}
       /> 
       <Text style={styles.appTitleText}>Story Telling\nApp</Text>
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity 
      style={styles.button}
      onPress={() => this.SignInWithGoogle()}>
      <Image
      style={styles.googleIcon}
      source={require("../assets/google_icon.png")}/>
      <Text style={styles.googleText}>Sign in with google</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.googleText}>
      <Image
      style={styles.cloudImage}
      source={require("../assets/cloud.png")}/>
      </View>

    </View>
    )}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white"
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  cloudContainer: {
    flex: 0.3
  },
  cloudImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "contain",
    bottom: RFValue(-5)
  }
});