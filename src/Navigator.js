import {createAppContainer, createSwitchNavigator} from 'react-navigation'

import Auth from './screens/Auth' 
import TasksList from './screens/TaskList' 

const mainRouter ={
    Auth:{
        name: 'Auth',
        screen: Auth
    },
    Home:{
        name: 'Home',
        screen: TasksList
    }
}

const mainNavigator = createSwitchNavigator(mainRouter, {
    initialRouteName:'Auth'
})

export default createAppContainer(mainNavigator)