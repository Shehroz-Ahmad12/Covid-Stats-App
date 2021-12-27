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

const WorldStats = () => {
  const [getCovidData, setCovidData] = React.useState();
  const [getPopulation, setPopulation] = React.useState();
  const [getData, setData] = React.useState();

  const getCovidDataApi = async () => {
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

  const getWorldPopulationApi = async () => {
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
        setPopulation(result.body.world_population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  React.useEffect(() => {
    getCovidDataApi();
  }, [setCovidData]);

  React.useEffect(() => {
    getWorldPopulationApi();
  }, [setPopulation]);

  if (getCovidData && getPopulation) {
    return (
      <>
        <View style={styles.container}>
          <FlatList
            refreshing={false}
            onRefresh={getCovidDataApi}
            keyExtractor={(item, index) => item.key}
            data={getCovidData}
            renderItem={({ item, index }) => (
              <View>
                <Text style={styles.card}>{getPopulation}</Text>
                <Text style={styles.label}>Total World Population</Text>

                <Text style={[styles.card, { backgroundColor: 'plum' }]}>
                  {item.confirmed}
                </Text>

                <Text style={styles.label}>Total Cases</Text>
                <Text style={styles.label}>
                  {((item.confirmed / getPopulation) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'yellowgreen' }]}>
                  {item.recovered}
                </Text>
                <Text style={styles.label}>Recovered</Text>
                <Text style={styles.label}>
                  {((item.recovered / getPopulation) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'tomato' }]}>
                  {item.deaths}
                </Text>
                <Text style={styles.label}>Total Deaths</Text>
                <Text style={styles.label}>
                  {((item.deaths / getPopulation) * 100).toFixed(3)}%
                </Text>

                <Text
                  style={[
                    styles.label,
                    { backgroundColor: 'gold', marginTop: 20, padding: 10 },
                  ]}>
                  Last Updated
                </Text>

                <Text
                  style={[
                    styles.label,
                    { backgroundColor: 'gold', padding: 10 },
                  ]}>
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
        <ActivityIndicator color="lightgreen" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
};

const CountriesList = ({ navigation }) => {
  const [getCountries, setCountries] = React.useState();
  const [getText, setText] = React.useState();

  const getCountriesApi = async () => {
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
      getCountriesApi();
    },
    [setCountries],
    [setText]
  );

  if (getCountries) {
    return (
      <View>
        <Input
          placeholder="Enter Country Name"
          style={{ padding: 5, width: '80%' }}
          onChangeText={(v) => {
            filter(v);
          }}
        />
        <FlatList
          refreshing={false}
          onRefresh={getCountriesApi}
          keyExtractor={(item, index) => item.key}
          data={getCountries}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.countryLabel}
              onPress={() => {
                navigation.push('Country Details', item);
              }}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="lightgreen" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
};

const CountryStats = ({ navigation, route }) => {
  const [getCountryData, setCountryData] = React.useState();
  const [getPopulation, setPopulation] = React.useState('Data Not Found');
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
            color={selected ? 'lightgreen' : 'lightgrey'}
          />
        </TouchableOpacity>
      ),
    });
  });

  const addToFav = async () => {
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

  const getCountryDataAPI = async () => {
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
        setCountryData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getCountryPopApi = async () => {
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
        setPopulation(result.body.population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  React.useEffect(() => {
    getCountryPopApi();
  }, [setPopulation]);

  React.useEffect(() => {
    getCountryDataAPI();
  }, [setCountryData]);

  if (getCountryData && getPopulation) {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={false}
          onRefresh={getCountryDataAPI}
          keyExtractor={(item, index) => item.key}
          data={getCountryData}
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
              <Text style={styles.card}>{getPopulation}</Text>
              <Text style={styles.label}>Total Population</Text>

              <Text style={[styles.card, { backgroundColor: 'plum' }]}>
                {item.confirmed}
              </Text>

              <Text style={styles.label}>Total Cases</Text>
              <Text style={styles.label}>
                {((item.confirmed / getPopulation) * 100).toFixed(3)}%
              </Text>

              <Text style={[styles.card, { backgroundColor: 'yellowgreen' }]}>
                {item.recovered}
              </Text>
              <Text style={styles.label}>Recovered</Text>
              <Text style={styles.label}>
                {((item.recovered / getPopulation) * 100).toFixed(3)}%
              </Text>

              <Text style={[styles.card, { backgroundColor: 'tomato' }]}>
                {item.deaths}
              </Text>
              <Text style={styles.label}>Total Deaths</Text>
              <Text style={styles.label}>
                {((item.deaths / getPopulation) * 100).toFixed(3)}%
              </Text>

              <Text
                style={[
                  styles.label,
                  { backgroundColor: 'gold', marginTop: 20, padding: 10 },
                ]}>
                Last Updated
              </Text>

              <Text
                style={[
                  styles.label,
                  { backgroundColor: 'gold', padding: 10 },
                ]}>
                {item.lastUpdate}
              </Text>
            </View>
          )}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="lightgreen" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
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

  if (getCountries) {
    return (
      <View>
        <FlatList
          refreshing={false}
          onRefresh={loadData}
          keyExtractor={(item, index) => item.key}
          data={getCountries}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.countryLabel}
              onPress={() => {
                console.log('Shift to Country Details');
                navigation.push('Country Details', item);
              }}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="lightgreen" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="World Stats" component={WorldStats} />
      <Drawer.Screen name="Countries Stats" component={CountryStack} />
      <Drawer.Screen name="Favourite Countries" component={FavStack} />
    </Drawer.Navigator>
  );
}

function CountryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countries"
        component={CountriesList}
        options={{
          headerStyle: {
            backgroundColor: 'steelblue',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Country Details"
        component={CountryStats}
        options={{
          headerStyle: {
            backgroundColor: 'steelblue',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
function FavStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favourite Countries"
        component={FavCountries}
        options={{
          headerStyle: {
            backgroundColor: 'steelblue',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Country Details"
        component={CountryStats}
        options={{
          headerStyle: {
            backgroundColor: 'steelblue',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
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
  countryLabel: {
    width: '100%',
    padding: 10,
    backgroundColor: 'lightsteelblue',
    margin: 1,
    borderRadius: 10,
  },
});
