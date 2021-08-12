import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useState } from 'react';
import { GooglePay } from 'react-native-google-pay';

const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
 
const requestData = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      // stripe (see Example):
      gateway: 'stripe',
      gatewayMerchantId: '',
      stripe: {
        publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
        version: '2018-11-08',
      },
      // other:
      gateway: 'example',
      gatewayMerchantId: 'exampleGatewayMerchantId',
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '2',
    totalPriceStatus: 'FINAL',
    currencyCode: 'EUR',
  },
  merchantName: 'Example Merchant',
};

export default function PayC({type}) {
    const [showContent, setShowContent] = useState(true);
    useEffect(() => {
      AsyncStorage.getItem('profile')
      .then(res => {
        if(res == 'premium'){
          setShowContent(false);
        }
      })
    }, []);

    return showContent ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#00ff00', fontSize: 20}}>You are interested in your Top 100 {type}?</Text>
          <Text style={{color: 'white', fontSize: 16}}>Click here to get premium version for only 2$</Text>
          <TouchableOpacity style={{backgroundColor: '#00ff00', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5}} onPress={async() => {await AsyncStorage.setItem('profile', 'premium')}}><Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>Get Now</Text></TouchableOpacity>
        </View>
    ) : null
}
