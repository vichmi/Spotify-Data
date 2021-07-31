import React from 'react'
import { View, Text } from 'react-native'

export default function StatsContainer({index, time}) {
    return (
        <View>
            <View style={{backgroundColor: '#313131',borderRadius: 5, padding: 6, marginBottom: 20}}>
                <Text style={{color: '#00FF56', fontSize: 26}}>#{index}</Text>
                <Text style={{color: 'white', fontSize: 15}}>In top {index} since {time == 'short_term' ? '4 weeks' : time == 'medium_term' ? '6 months' : time == 'long_term' ? 'lifetime' : null}</Text>
            </View>
        </View>
    )
}
