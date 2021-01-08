import React, {Component} from 'react'
import {View, Text, ImageBackground, 
        StyleSheet, FlatList, TouchableOpacity, 
        Platform, Alert} from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br' //nesse caso, não vou usar no esse cara no componente, ele vai ser um conf para moment

import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-community/async-storage"

import AddTask from './AddTask'

import commonStyles from '../commonsStyles'
import todayImagem from '../../assets/imgs/today.jpg'

const initialState ={showDoneTasks: true, showAddTask:false, visibleTasks:[], tasks:[]}

export default class TaskList extends Component{
    state ={
        ... initialState
    }
    //método de ciclo de vida do react
    componentDidMount = async() => {
       const stateString = await AsyncStorage.getItem('tasksState')
       const state = JSON.parse(stateString) || initialState
       this.setState(state, this.filterTasks)
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
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

    toggleTask = taskId =>{
        const tasks = [... this.state.tasks]
        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({tasks}, this.filterTasks) //não preciso fazer tasks = tasks são nomes iguais
    }

    addTask = newTask =>{
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return 
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({tasks, showAddTask:false}, 
            this.filterTasks)

    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({tasks}, this.filterTasks)
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D, [de] MMMM',)
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} 
                    onCancel={()=>this.setState({showAddTask:false})}
                    onSave={this.addTask}/>                
                <ImageBackground style={styles.background}
                    source={todayImagem}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title} >Hoje</Text>
                        <Text style={styles.subTitle}>{today} </Text>

                    </View>            
                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`} 
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>}/>
                </View>
                <TouchableOpacity style={styles.addButton}
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
        justifyContent: 'flex-end',
        marginTop:Platform.OS === 'ios' ? 40 : 10
    },
    addButton:{
        position:'absolute',
        right:20,
        bottom:20,
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:commonStyles.colors.today,
        justifyContent:'center',
        alignItems:'center'

    }
})