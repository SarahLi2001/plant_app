import React from 'react'
import {Text, View, Button} from 'react-native'
// typing rcf creates a react functional component
// the prop navigation will give us access to the router
export default function Landing({navigation}) {
    return (
        //makes the landing page in the center
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Button
                title="Register"
                onPress={() => navigation.navigate("Register")}/>
            <Button
                title="Login"
                onPress={() => navigation.navigate("Login")}/>

        </View>
    )
}
