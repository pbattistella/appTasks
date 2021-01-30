import React from 'react'
import {Platform, ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import {Gravatar} from 'react-native-gravatar'
import commonsStyles from '../commonsStyles'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'


export default props => {
    const optionsGravatar = {
        email: props.navigation.getParam('email'),
        secure: true
    }

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')
    }

    return(
        <ScrollView>
            <Text style={styles.title}>Tasks</Text>
            <View style={styles.header}>
                <Gravatar style={styles.avatar}
                    options={optionsGravatar}/>
                
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
                    <Text style={styles.email}>{props.navigation.getParam('email')}</Text>

                </View>
                
            </View>

            <DrawerItems {...props} />

            <TouchableOpacity onPress={logout}> 
                <View style={styles.logoutIcon}>
                    <Icon name='sign-out' size={30} color='#800' />
                </View>
            </TouchableOpacity>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        color: '#000',
        fontFamily: commonsStyles.fontFamily,
        fontSize: 30,
        paddingTop: 30,
        padding:5,
        marginTop:Platform.OS === 'ios'? 50 : 20
    },
    avatar:{
       width: 60,
       height: 60,
       borderWidth: 3,
       borderRadius: 30,
       margin: 5,
       
    },
    userInfo: {
        marginLeft: 10
    },
    name: {
        fontFamily:commonsStyles.fontFamily,
        fontSize: 20,
        marginBottom: 5,
        color:commonsStyles.colors.mainText

    },
    email: {
        fontFamily:commonsStyles.fontFamily,
        fontSize: 15,
        marginBottom: 10,
        color:commonsStyles.colors.subtext
    },
    logoutIcon: {
        marginTop: 30,
        marginRight: 50,
        marginBottom: 10,
        alignItems:'flex-end'
    }

})