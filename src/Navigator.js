import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createDrawerNavigator} from 'react-navigation-drawer'

import AuthOrApp from './screens/AuthOrApp'
import Auth from './screens/Auth' 
import TasksList from './screens/TaskList' 

import Menu from './screens/Menu'
import commonStyles from './commonsStyles'

const menuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold',
        }
    }
}

const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <TasksList title='Hoje' daysAhead={0} {...props} />,//preciso do import Reac
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorroy',
        screen: props => <TasksList title='Amanhã' daysAhead={1} {...props} />,//preciso do import Reac
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <TasksList title='Semana' daysAhead={7} {...props} />,//preciso do import Reac
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <TasksList title='Mês' daysAhead={30} {...props} />,//preciso do import Reac
        navigationOptions: {
            title: 'Mês'
        }
    },
}

const menuNavigator = createDrawerNavigator(menuRoutes,menuConfig)

const mainRouter ={
    AuthOrApp: {
        name:'AuthOrApp',
        screen: AuthOrApp
    },

    Auth:{
        name: 'Auth',
        screen: Auth
    },

    Home:{
        name: 'Home',
        screen: menuNavigator
    }
}

const mainNavigator = createSwitchNavigator(mainRouter, {
    initialRouteName:'AuthOrApp'
})

export default createAppContainer(mainNavigator)