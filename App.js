import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button, Keyboard, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React,{useState,useEffect}from 'react';
import * as Location from 'expo-location';


export default function App() {
  const initial={
    latitude:60.200692,
    longitude:24.934302,
    latitudeDelta:0.0322,
    longitudeDelta:0.0221
  };

  useEffect(()=>{
    const fetchLocation=async ()=>{
    let {status}=await Location.requestForegroundPermissionsAsync();
    if (status != 'granted'){
      alert('Permission not granted');
    }else{
      try{
        let location=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
    console.log(location)
    setRegion({...region,latitude:location.coords.latitude,longitude:location.coords.longitude});
      }catch(error){
        console.log('error',error.message)
      }
    }
    
  }
  fetchLocation();
  },[]);


  const [region,setRegion]=useState(initial);
  const [address,setAddress]=useState('');

  const getCoordinates=async (address)=>{
    const KEY='jjK24fYAwJIVztjClcd7zNFZ0jVo3ME4';
    const url= `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;
 

  try{
    const response = await fetch(url);
    const data= await response.json();
    const lat=data.results[0].locations[0].latLng.lat;
    const lng=data.results[0].locations[0].latLng.lng;

    setRegion({...region, latitude:lat, longitude:lng});
  }catch(error){
    console.log('error',error.message);
  }
  Keyboard.dismiss();
 };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}>
          <Marker coordinate={region}/>
      </MapView>
      <View style={styles.searchContainer}>
      <TextInput
      style={styles.input}
      placeholder={'Search'}
      value={address}
      onChangeText={(text)=>setAddress(text)}/>
      </View> 
      <View>
        <Button title="Get Coordinates" onPress={()=>getCoordinates(address)} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 50, 
    width: '90%',
    alignItems: 'center',
    backgroundColor:'rgba(244, 229, 237, 0.8)'
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    marginBottom: 10,
  },
});
