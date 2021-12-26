import * as React from 'react';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Input } from 'react-native-elements';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

import Constants from 'expo-constants';

const World = () => {
  const [getCovidData, setCovidData] = React.useState();
  const [getPop, setPop] = React.useState();
  const [getData, setData] = React.useState();

  const getDataFromAPI = async () => {
    fetch('https://covid-19-data.p.rapidapi.com/totals', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setCovidData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getDataFromAPI2 = async () => {
    fetch('https://world-population.p.rapidapi.com/worldpopulation', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.body.world_population);
        setPop(result.body.world_population);
      })
      .catch((error) => {
        console.log('Error: ', error);
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
            renderItem={({ item, index }) => (
              <View>
                <Text style={styles.card}>{getPop}</Text>
                <Text style={styles.label}>Total World Population</Text>

                <Text style={[styles.card, { backgroundColor: 'plum' }]}>
                  {item.confirmed}
                </Text>

                <Text style={styles.label}>Total Cases</Text>
                <Text style={styles.label}>
                  {((item.confirmed / getPop) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'yellowgreen' }]}>
                  {item.recovered}
                </Text>
                <Text style={styles.label}>Recovered</Text>
                <Text style={styles.label}>
                  {((item.recovered / getPop) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'tomato' }]}>
                  {item.deaths}
                </Text>
                <Text style={styles.label}>Total Deaths</Text>
                <Text style={styles.label}>
                  {((item.deaths / getPop) * 100).toFixed(3)}%
                </Text>

                <Text
                  style={[
                    styles.label,
                    { backgroundColor: 'lightgrey', marginTop: 20 },
                  ]}>
                  Last Updated
                </Text>

                <Text style={[styles.label, { backgroundColor: 'lightgrey' }]}>
                  {item.lastUpdate}
                </Text>
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
};

const Countries = ({ navigation }) => {
  const [getCountries, setCountries] = React.useState();
  const [getText, setText] = React.useState();

  const getDataFromAPI = async () => {
    fetch('https://covid-19-data.p.rapidapi.com/help/countries', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        var res = result.map((item) => {
          return item.name;
        });
        setCountries(res);
        setText(res);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const filter = (text) => {
    console.log(getCountries);
    var result = getText.filter((country) => {
      if (country.includes(text)) {
        return country;
      }
    });
    console.log(result);
    setCountries(result);
  };
  React.useEffect(
    () => {
      getDataFromAPI();
    },
    [setCountries],
    [setText]
  );

  return (
    <View>
      <Input
        placeholder="Enter Country Name"
        style={{ padding: 10 }}
        onChangeText={(v) => {
          filter(v);
        }}
      />
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getCountries}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: 'lightgrey',
              margin: 1,
            }}
            onPress={() => {
              navigation.navigate('Country Details', item);
            }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const CountryStats = ({ navigation, route }) => {
  const [getData, setData] = React.useState();
  const [getPop, setPop] = React.useState('Not Found');
  const [selected, setSelected] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            if (selected) {
              deleteFav();
              setSelected(false);
            } else {
              addToFav();
              setSelected(true);
            }
          }}>
          <Icon
            name="star"
            size={30}
            color={selected ? 'black' : 'lightgrey'}
          />
        </TouchableOpacity>
      ),
    });
  });

  const addToFav = async () => {
    console.log('Saving');
    console.log(route.params);
    var list = JSON.parse(await AsyncStorage.getItem('@fav:key'));
    console.log(list);
    var newList = [...list, route.params];
    await AsyncStorage.setItem('@fav:key', JSON.stringify(newList));
    console.log(newList);
    console.log('Saving Done!');
  };

  const checkFvrt = async () => {
    var list = JSON.parse(await AsyncStorage.getItem('@fav:key'));
    console.log(list);
    if (list.includes(route.params)) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  };

  const deleteFav = async () => {
    var list = JSON.parse(await AsyncStorage.getItem('@fav:key'));
    var index = list.indexOf(route.params);
    if (index > -1) {
      list.splice(index, 1);
      await AsyncStorage.setItem('@fav:key', JSON.stringify(list));
      console.log(list);
    }
  };

  const getDataFromAPI = async () => {
    fetch(
      `https://covid-19-data.p.rapidapi.com/country?name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.confirmed);
        setData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getDataFromAPI2 = async () => {
    fetch(
      `https://world-population.p.rapidapi.com/population?country_name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'world-population.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.body.population);
        checkFvrt();
        setPop(result.body.population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  React.useEffect(() => {
    getDataFromAPI2();
  }, [setPop]);

  React.useEffect(() => {
    getDataFromAPI();
  }, [setData]);

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getData}
        renderItem={({ item, index }) => (
          <View>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 33,
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              {item.country}
            </Text>
            <Text style={styles.card}>{getPop}</Text>
            <Text style={styles.label}>Total Population</Text>

            <Text style={[styles.card, { backgroundColor: 'plum' }]}>
              {item.confirmed}
            </Text>

            <Text style={styles.label}>Total Cases</Text>
            <Text style={styles.label}>
              {((item.confirmed / getPop) * 100).toFixed(3)}%
            </Text>

            <Text style={[styles.card, { backgroundColor: 'yellowgreen' }]}>
              {item.recovered}
            </Text>
            <Text style={styles.label}>Recovered</Text>
            <Text style={styles.label}>
              {((item.recovered / getPop) * 100).toFixed(3)}%
            </Text>

            <Text style={[styles.card, { backgroundColor: 'tomato' }]}>
              {item.deaths}
            </Text>
            <Text style={styles.label}>Total Deaths</Text>
            <Text style={styles.label}>
              {((item.deaths / getPop) * 100).toFixed(3)}%
            </Text>

            <Text
              style={[
                styles.label,
                { backgroundColor: 'lightgrey', marginTop: 20 },
              ]}>
              Last Updated
            </Text>

            <Text style={[styles.label, { backgroundColor: 'lightgrey' }]}>
              {item.lastUpdate}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const FavCountries = ({ navigation }) => {
  const [getCountries, setCountries] = React.useState();

  const loadData = async () => {
    console.log('Loading');
    var item = await AsyncStorage.getItem('@fav:key');
    setCountries(JSON.parse(item));
    console.log('Data Loaded');
  };

  React.useEffect(() => {
    loadData();
  }, [setCountries]);

  return (
    <View>
      <FlatList
        refreshing={false}
        onRefresh={loadData}
        keyExtractor={(item, index) => item.key}
        data={getCountries}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: 'lightgrey',
              margin: 1,
            }}
            onPress={() => {
              navigation.navigate('Country Details', item);
            }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="World Stats" component={World} />
      <Drawer.Screen name="Countries Stats" component={MyStack} />
      <Drawer.Screen name="Favourite Countries" component={FavCountries} />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Countries" component={Countries} />
      <Stack.Screen name="Country Details" component={CountryStats} />
    </Stack.Navigator>
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

  card: {
    fontSize: 26,
    fontWeight: 'bold',
    backgroundColor: 'lightblue',
    padding: 30,
    borderRadius: 50,
    marginTop: 20,
    width: 'fit-content',
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
