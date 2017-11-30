import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableHighlight,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  WebView,
  Button,
  Animated,
  Easing
} from 'react-native';
import {StackNavigator} from 'react-navigation';

class AKCScreen extends React.Component {

   static navigationOptions = {
      title: 'Dog Breed Finder'
    };

 render() {
   const breed = this.props.navigation.state.params.breed;
   const lowercasebreed = breed.toLowerCase();
   const url = lowercasebreed.replace(" ", "-");
   return (
     <WebView
     source={{uri: 'http://www.akc.org/dog-breeds/' + url + '/'}}/>
   );
 }
}

class ImageLargeScreen extends React.Component {
    constructor() {
       super();
       this.state = {
           loading: false,
       };
   }

   static navigationOptions = {
      title: 'Dog Breed Finder'
    };

 render() {
   const imageUrl = this.props.navigation.state.params.image;
   return (
     <View style={styles.container}>
        {this.state.loading &&
             <ActivityIndicator
             animating={this.state.loading}
             size = "large"
             style={styles.activityIndicator} />
        }
         <Image
         onLoadStart={(e) => this.setState({loading: true})}
         onLoad={(e) => this.setState({loading: false})}
         resizeMode={'contain'}
         style={styles.largeImage}
         source={{uri: imageUrl}}
         />
     </View>
   );
 }
}

class DogPhotoScreen extends React.Component {
    constructor() {
       super();
       this.state = {
           images: [],
       };
   }

   static navigationOptions = {
      title: 'Dog Breed Finder'
    };



   getImageList() {
       const url = "https://dog.ceo/api/breed/" + this.props.navigation.state.params.breed + "/images";
       return fetch(url)
       .then((response) => response.json())
       .then((responseJson) => {
           this.setState({images: responseJson.message});
       })
       .catch((error) => {
           console.error(error);
       });
   }

   componentDidMount() {
       this.getImageList()
   }

 render() {
   const currentBreed = this.props.navigation.state.params.breed;
   return (
     <View style={styles.imgcontainer}>
       <Text style={styles.header1}>{currentBreed}</Text>
       <ScrollView style={styles.scrollview}
       contentContainerStyle={styles.scrollViewStyle}>
           <FlatList
           numColumns={3}
           contentContainerStyle={styles.dogFlatList}
           data={this.state.images}
           keyExtractor={(item, index) => index}
           renderItem={({item}) =>
               <TouchableHighlight onPress={() => this.props.navigation.navigate('ImageLarge', {image: item})}>
                   <Image
                       style={styles.dogImage}
                       source={{uri: item}}
                        />
              </TouchableHighlight>

          }
           ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator}></View>}
           />
       </ScrollView>
     </View>
   );
 }
}


 class HomeScreen extends React.Component {
     constructor() {
        super();
        this.state = {
            breeds: [],
        };
        this.spinValue = new Animated.Value(0);
    }

    cycle() {
        this.spinValue.setValue(0);
        Animated.timing(
        this.spinValue,
        {
            toValue: 1,
            duration: 3500,
            easing: Easing.linear
        }).start(() => this.cycle());
    }

    static navigationOptions = {
       title: 'Dog Breed Finder'
     };

    getBreedList() {
        const url = "https://dog.ceo/api/breeds/list";
        return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({breeds: responseJson.message});
        })
        .catch((error) => {
            console.error(error);
        });
    }

    componentDidMount() {
        this.getBreedList()
        this.cycle()
    }



  render() {
      const spin = this.spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
      });
    return (
      <View style={styles.container}>
        <Animated.Image
        style={[styles.icon,
            {
          transform: [
            {rotate: spin}]
            }]}
        source={{uri: 'https://d30y9cdsu7xlg0.cloudfront.net/png/53194-200.png'}}
        />
        <Text style={styles.header1}>Dogs</Text>
        <View stlyes={styles.searchContainer}>
            <TextInput
            placeholder="Search for a Specific Dog Breed..."
            style={styles.search}
            onChangeText={(searchDog) => this.setState({searchDog})}
            value={this.state.searchDog} />
            <Button
            onPress={() => this.props.navigation.navigate('AKC', {breed: this.state.searchDog})}
            title="Go"/>
        </View>
            <FlatList
            style={styles.breedFlatList}
            data={this.state.breeds}
            keyExtractor={(item, index) => item}
            renderItem={({item}) =>
                <TouchableHighlight style={styles.th} underlayColor="lightgrey" onPress={() => this.props.navigation.navigate('Dog', {breed: item})}>
                    <Text
                        style={styles.flatListText}
                         >
                        {item}
                    </Text>
                </TouchableHighlight>}
            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator}></View>}/>
        </View>

    );
  }
}

export const RootNavigator = StackNavigator({
    Home: {
       name: 'HomeScreen',
       description: 'Main screen listview of dog breeds',
       screen: HomeScreen,
    },
    Dog: {
        path: 'dog/:breed',
        name: 'DogPhotoScreen',
        description: 'Display list of dog images based on Homescreen selection',
        screen: DogPhotoScreen
    },
    ImageLarge: {
        path: 'ImageLarge/:image',
        name: 'ImageLargeScreen',
        description: 'Display selected image full screen',
        screen: ImageLargeScreen
    },
    AKC: {
        path: 'AKC/:breed',
        name: 'AKCScreen',
        description: 'Display web view with AKC site in it',
        screen: AKCScreen
    }
});

AppRegistry.registerComponent('RootNavigator', () => RootNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgcontainer: {
      height: StyleSheet.absoluteFill,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  flatListText: {
      padding: 20,
      fontSize: 24,
      alignSelf: 'center'
  },
  header1: {
      marginTop: 15,
      fontSize: 35,
      fontWeight: 'bold'
  },
  separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
  },
  breedFlatList: {
      flex: 1,
      width: '100%',
      marginTop: 20
  },
  th: {
      height: 70,
  },
  dogFlatList: {
      flex: 1,
      flexDirection: 'column',
  },
  dogImage: {
      height: 120,
      minWidth:120
  },
  scrollViewStyle: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      height: StyleSheet.absoluteFill,
  },
  header2: {
      fontSize: 25,
      marginTop: 10,
      marginBottom: 10
  },
  scrollview: {
      flex: 1
  },
  largeImage: {
      flex: 1,
      alignSelf: 'stretch',
      width: "100%",
      height: "100%",
  },
  activityIndicator: {
      position: 'absolute',
       left: 0,
       right: 0,
       top: 0,
       bottom: 0,
       alignItems: 'center',
       justifyContent: 'center',
  },
  search: {
      height: 20,
      width: '100%',
      marginTop: 20,
      marginBottom: 10,
      marginLeft: 20
  },
  searchContainer: {
      flex: 1,
      flexDirection: "row"
  },
  icon: {
      marginTop: 20,
      height: 50,
      width: 50
  }
});
