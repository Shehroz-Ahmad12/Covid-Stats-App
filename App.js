import * as React from 'react';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';



import Constants from 'expo-constants';



const  World = ()=> {
  const [getCovidData, setCovidData] = React.useState();
  const [getPop, setPop] = React.useState();


  const getDataFromAPI = async () => {
    fetch("https://covid-19-data.p.rapidapi.com/totals", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
      }
    })  .then((response) => response.json())
          .then((result) => { 
            console.log(result) 
            setCovidData(result)
            
          })
          .catch((error) => { 
            console.log('Error: ', error)
          });
      };


  const getDataFromAPI2 = async () => {

fetch("https://world-population.p.rapidapi.com/worldpopulation", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9",
		"x-rapidapi-host": "world-population.p.rapidapi.com"
	}
})  .then((response) => response.json())
      .then((result) => { 
        console.log(result.body.world_population) 
        setPop(result.body.world_population)
        
      })
      .catch((error) => { 
        console.log('Error: ', error)
      });
  };


  React.useEffect(() => {
    getDataFromAPI();
  }, [setCovidData]);

  React.useEffect(() => {
    getDataFromAPI2();
  }, [setPop]);


  if (getCovidData && getPop) {
    return (
      <>

        <View style={styles.container}>
          <FlatList
            refreshing={false}
            onRefresh={getDataFromAPI}
            keyExtractor={(item, index) => item.key}
            data={getCovidData}
            renderItem={({item, index}) => (
              <View>
               
                <Text style={styles.card}>{getPop}</Text>
               <Text style={styles.label}>Total World Population</Text>

                <Text style={[styles.card, {backgroundColor: "plum"}]}>{item.confirmed}</Text>

                <Text style={styles.label}>Total Cases</Text>
                <Text style={styles.label}>{((item.confirmed/getPop)*100).toFixed(3)}%</Text>

                <Text style={[styles.card, {backgroundColor: "yellowgreen"}]}>{item.recovered}</Text>
                <Text style={styles.label}>Recovered</Text>
                <Text style={styles.label}>{((item.recovered/getPop)*100).toFixed(3)}%</Text>

                <Text style={[styles.card, {backgroundColor: "tomato"}]}>{item.deaths}</Text>
                <Text style={styles.label}>Total Deaths</Text>
                <Text style={styles.label}>{((item.deaths/getPop)*100).toFixed(3)}%</Text>
                

                <Text style={[styles.label, {backgroundColor: "lightgrey", marginTop: 20}]}>Last Updated</Text>

                <Text style={[styles.label, {backgroundColor: "lightgrey"}]}>{item.lastUpdate}</Text>


              </View>
            )}
          />

         
        </View>
      </>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6545a4" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
}



const Countries = ()=>{
  return(
    <View>
    <Text>Countries</Text>
    </View>
  )
}

const FavCountries = ()=>{
  return(
    <View>
    <Text>Fav Countries</Text>
    </View>
  )
}


const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
    >
      <Drawer.Screen name="World Stats" component={World} />
      <Drawer.Screen name="Countries Stats" component={Countries} />
      <Drawer.Screen name="Favourite Countries" component={FavCountries} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    height: 60,
    backgroundColor: 'lightseagreen',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  tile: {
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 40,
    padding: 8,
    margin: 3,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
card: {
  fontSize:26,
  fontWeight:"bold", 
  backgroundColor:"lightblue",
  padding:30, 
  borderRadius:50, 
  marginTop: 20, 
  width: "fit-content", 
  alignSelf: "center" 
},
label: {
  alignSelf: "center", fontWeight: "bold", fontSize: 16
}

});
