import React, { Component} from 'react';
import {Icon,ListItem } from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import { Animated,View, Text, StyleSheet ,Alert, requireNativeComponent, Dimensions} from 'react-native';
import db from '../config';

export default class SwipeableFlatList extends Component{
    constructor(props){
        super(props);
            this.state = {
                allNotifications: this.props.allNotifications
            }
    }

    onSwipeValueChange = (swipeData)=> {
        var allNotifications = this.state.allNotifications
        const {key, value }= swipeData
        if(value<-Dimensions.get('window').width) {
            const newData = [...allNotifications]
            const previousIndex = allNotifications.findIndex((item)=> {
                item.key===key
            })
            this.updateMarkAsRead(allNotifications[previousIndex])
            newData.splice(previousIndex, 1)

            this.setState({
                allNotifications: newData
            })

        }

    }

    updateMarkAsRead = (notification)=> {
         db.collection('all_notifications').doc(notification.doc_id).update(
             {
                 "notification_status": "read" 
             }
         )
    }

    renderItems = (data)=> (
        <Animated.View>
            <ListItem
                leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
                title = {data.item.book_name}
                titleStyle = {{color: 'black', fontWeight: 'bold'}}
                {...console.log(data.item.message)}
                subtitle = {data.item.message}
                bottomDivider
            />   
        </Animated.View>  
    )

    renderHiddenItem=()=> (
        <View style={styles.rowBack}>
            <View style = {[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style = {styles.backTextWhite}> </Text>
            </View>
        </View>
    )


    render(){
    return(
        <View style ={styles.container}>
            <SwipeListView
                disableRightSwipe
                renderItem = {this.renderItems}
                data = {this.state.allNotifications}
                renderHiddenItem = {this.renderHiddenItem}
                onSwipeValueChange = {this.onSwipeValueChange}
                previewRowKey= {"0"}
                rightOpenValue={-Dimensions.get('window').width}
            />
        </View>
    )
}
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#29b6f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightBtnRight: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
});