import React from 'react'
import { View, Text, Image } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

export default function Test() {



    return (
        <View>
            <HeaderImageScrollView
                maxHeight={300}
                minHeight={90}
                renderHeader={() => {
                    <Image  source={{uri: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwZm9vZCUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'}} />
                    
                }}>
                <TriggeringView>
                    <View>
                        
                    </View>
                </TriggeringView>

            </HeaderImageScrollView>
        </View>
    )
}
