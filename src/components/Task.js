import React from 'react'
import {View, Text, StyleSheet, 
        TouchableWithoutFeedback, TouchableOpacity} from 'react-native'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonsStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? 
        { textDecorationLine: 'line-through'}: {} //estilo condicional

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formatedDate = moment(date).local('pt-br').format('ddd, D [de] MMM')

    const getRightContent = () =>{
        return(
            <TouchableOpacity style={styles.right}>
                <Icon name="trash" size={30} color='#FFF' />

            </TouchableOpacity>
        )
    }

    const getLeftContent = () =>{
        return(
            <View style={styles.left}>
                <Icon name="trash" size={20} color='#FFF' style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>

            </View>
        )
    }

    return (
        <Swipeable 
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}>
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.toggleTask(props.id)} >
                    
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>

                </TouchableWithoutFeedback>
                
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formatedDate}</Text>
                </View>
            </View>

        </Swipeable>
        
    )
}

function getCheckView(doneAt){
    if (doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name='check' size={20}
                    color='#FFF'></Icon>
            </View>
        )    
    } else {
        return (
            <View style={styles.pending}></View>
        )
    }


    
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',//vamos adicionar cada tarefa por linha
        borderColor: '#AAA',
        borderBottomWidth:1,
        alignItems: 'center',
        paddingVertical:10,
        backgroundColor:'#FFF'
    },
    checkContainer:{
        width:'20%',
        alignItems:'center',//com base no container que é linha, estamos alinhando ele ao center
        justifyContent:'center'//nesse caso, o conteúdo será alinhado na coluna, porque o flexdirection é row
        //Poderia inveter o flexDirection, daí esses dois itens mudariam

    },
    pending:{
        height:25,
        width:25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height:25,
        width:25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems:'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily:commonStyles.fontFamily,
        color:commonStyles.colors.mainText,
        fontSize: 15
    },
    date:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subtext,
        fontSize:12
    },
    right:{
        backgroundColor:'red',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingHorizontal:20    
    },
    left:{
        flex:1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems:'center'
    },
    excludeText:{
        fontFamily:commonStyles.fontFamily,
        color:'#FFF',
        fontSize: 20,
        margin:10
    },
    excludeIcon:{
        marginLeft: 10
    }
})