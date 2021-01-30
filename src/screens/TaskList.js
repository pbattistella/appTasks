import React, {Component} from 'react'
import {View, Text, ImageBackground, 
        StyleSheet, FlatList, TouchableOpacity, 
        Platform, Alert} from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br' //nesse caso, não vou usar no esse cara no componente, ele vai ser um conf para moment

import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"

import AddTask from './AddTask'

import {server, showError} from '../common'
import commonStyles from '../commonsStyles'
import todayImagem from '../../assets/imgs/today.jpg'
import tomorrowImagem from '../../assets/imgs/tomorrow.jpg'
import weekImagem from '../../assets/imgs/week.jpg'
import monthImagem from '../../assets/imgs/month.jpg'



const initialState ={
    showDoneTasks: true, 
    showAddTask:false, 
    visibleTasks:[], 
    tasks:[]
}

export default class TaskList extends Component{
    state ={
        ... initialState
    }
    //método de ciclo de vida do react
    componentDidMount = async() => {
       const stateString = await AsyncStorage.getItem('tasksState')
       const savedState = JSON.parse(stateString) || initialState
       this.setState({showDoneTasks: savedState.showDoneTasks}, this.filterTasks)
       this.loadTasks()
    }

    loadTasks = async () => {
        try{
            const maxDate = moment()
                .add({days:this.props.daysAhead})
                .format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({tasks: res.data}, this.filterTasks)
        } catch(e){
            showError(e)
        }
    }

    toggleFilter = () => {
        this.setState({showDoneTasks : !this.state.showDoneTasks}, this.filterTasks)//filtertasks é chamada no callback
    }

    filterTasks = () =>{
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({visibleTasks})

        //salva o objeto state
        AsyncStorage.setItem('tasksState', JSON.stringify({showDoneTasks: this.state.showDoneTasks}))
    }

    toggleTask = async taskId =>{
        try{
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
    }

    addTask = async newTask =>{
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return 
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({showAddTask: false}, this.loadTasks)

        }catch(e){
            showError(e)
        }
    }

    deleteTask = async tasksId => {
        try{
            await axios.delete(`${server}/tasks/${tasksId}`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead){
            case 0 : return todayImagem
            case 1 : return tomorrowImagem
            case 7 : return weekImagem
            default: return monthImagem
        }
    }

    getColor = () => {
        switch(this.props.daysAhead){
            case 0 : return commonStyles.colors.today
            case 1 : return commonStyles.colors.tomorrow
            case 7 : return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D, [de] MMMM',)
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} 
                    onCancel={()=>this.setState({showAddTask:false})}
                    onSave={this.addTask}/>                
                <ImageBackground style={styles.background}
                    source={this.getImage()}>
                    <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name='bars'
                            size={20} 
                            color={commonStyles.colors.secondary}/>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title} >{this.props.title}</Text>
                        <Text style={styles.subTitle}>{today} </Text>

                    </View>            
                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`} 
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>}/>
                </View>
                <TouchableOpacity style={[styles.addButton, 
                    {backgroundColor: this.getColor()}]}
                    onPress={() => this.setState({showAddTask:true})}
                    activeOpacity={0.7}>
                    <Icon name="plus" size={20}
                        color={commonStyles.colors.secondary} />
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {//pai
        flex: 1 //permite flex crescer com proporção de 1 -- tela inteira
    },
    background:{//filho
        flex:3 //divide em 3/10
    },
    taskList:{//filho
        flex:7//divide em 7/10
    },
    titleBar:{
        flex: 1,
        justifyContent:'flex-end'
    },
    title:{
        fontFamily:commonStyles.fontFamily,
        fontSize: 50,
        color: commonStyles.colors.secondary,
        marginLeft: 20,
        marginBottom:20
    },
    subTitle:{
        fontFamily:commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.secondary,
        marginLeft: 20,
        marginBottom:30
    },
    iconBar:{
        flexDirection: 'row',
        marginHorizontal:20,
        justifyContent: 'space-between',
        marginTop:Platform.OS === 'ios' ? 40 : 10
    },
    addButton:{
        position:'absolute',
        right:20,
        bottom:20,
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'

    }
})