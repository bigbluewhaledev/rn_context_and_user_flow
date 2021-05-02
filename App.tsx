/**
 * Sample React Native project to demonstrate the use of React Context API
 * and how it can be used to not hinder desired user flow by making data
 * available where it needs to be made available.
 */

import React, {Context, useContext, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text, TextInput} from 'react-native';

import {
  NavigationContainer,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LockPadIcon from './LockPadIcon';
import CheckBox from '@react-native-community/checkbox';

// The Context requires an interface that the consumers of the context will
// interact with. In this example, it will be comprised of a simple boolean flag
// as well as a setter method for changing that flag. Allowing the consumers of the
// Context API to change the data is not necessarily a recommended approach, but
// for the purpose of this example it will be fine. A more traditional approach would be
// to dispatch some action that does some work (subscribes on behalf of the user), and
// then react to the changes at the higher level which is responsible for the value
// of the context data.
interface SubscriptionModel {
  isSubscribed: boolean;
  setSubscription: (value: boolean) => void;
}

// Create an instance of the Context and supply it with default data
const MySubscriptionContext: Context<SubscriptionModel> = React.createContext<SubscriptionModel>(
  {
    isSubscribed: false,
    setSubscription: () => {},
  },
);

// This utility hook provides us with an implementation that can be used by the consumers
// of the API by defining our own implementation for the setter method.
const useSubscription = (): SubscriptionModel => {
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const setSubscription = React.useCallback(
    (value: boolean): void => setIsSubscribed(value),
    [],
  );

  return {
    isSubscribed,
    setSubscription,
  };
};

// this application utilizes a basic stack navigator
const Stack = createStackNavigator();

const App = () => {
  // at the root level, retrieve the implemented interface and provide
  // it to consumers of the context
  const subscription = useSubscription();

  return (
    <MySubscriptionContext.Provider value={subscription}>
      <Navigator />
    </MySubscriptionContext.Provider>
  );
};

const Navigator = () => {
  // This is how you retrieve the context via the useContext hook
  // it can then be used directly with the interface defined.
  const subscriptionModel = useContext<SubscriptionModel>(
    MySubscriptionContext,
  );

  // As a demonstration, we will use the subscription model provided
  // to conditionally render the Subscription Screen. By removing it
  // directly from the stack, it allows us to pop() from the stack
  // and if stack _did_ have a subscription screen on it, but it's
  // no longer relevant, it will skip it
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="property"
          component={PropertyScreen}
          options={{title: 'Property Details'}}
        />
        <Stack.Screen
          name="offer"
          component={OfferScreen}
          options={{title: 'Make an Offer'}}
        />
        {subscriptionModel.isSubscribed ? null : (
          <Stack.Screen
            name="subscription"
            component={SubscriptionScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              title: 'Subscribe!',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Basic screen to mimic a Property Screen
// The subscription Model is used on this screen to (1) display
// local indicating that the action is behind a subscription control
// mechanism that is not yet satisfied, and (2) determine which screen
// to go to next.
const PropertyScreen = () => {
  const subscriptionModel: SubscriptionModel = useContext<SubscriptionModel>(
    MySubscriptionContext,
  );

  const navigation = useNavigation();

  // if the user is not subscribed, bring them to the subscription sign in
  // page, but provide additional parameters that specify where they should
  // continue in the situation where subscribing is a success. This is key
  // to not interfering with user flow.
  const onPressMakeOffer = () => {
    if (!subscriptionModel.isSubscribed) {
      navigation.navigate('subscription', {destination: 'offer'});
    } else {
      navigation.navigate('offer');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 20,
        }}>
        <MockImageBox style={{width: '50%'}} />
        <MockImageBox style={{width: '50%'}} />
        <MockImageBox style={{width: '50%'}} />
        <MockImageBox style={{width: '50%'}} />
      </View>
      <View style={{padding: 30, paddingTop: 0}}>
        <Text style={styles.bigText}>123 Fake Street</Text>
        <Text style={styles.smallText}>Ottawa, ON, Canada</Text>
        <Divider />
        <LineItem label="Bedrooms" value="3" />
        <Divider />
        <LineItem label="Bathrooms" value="2.5" />
        <Divider />
        <LineItem label="Walkscore" value="97" />
        <Divider />
        <LineItem label="Ghosts" value="1" />
      </View>
      <BasicButton label="Place an Offer" onPress={onPressMakeOffer} />
    </SafeAreaView>
  );
};

// Basic screen representing subscribing to content
const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const subscriptionModel: SubscriptionModel = useContext<SubscriptionModel>(
    MySubscriptionContext,
  );

  // in an actual application, i would recommend an approach that separates the
  // act of subscribing (likely via rest call) and reacting to the response (likely
  // somewhere else), but for this basic sample we will assume the subscription is
  // to be added, and act directly on the interface provided.
  const updateSubscription = () => {
    subscriptionModel.setSubscription(true);
  };

  // If the subscription model changes at the higher level (as made possible with the
  // above call to enable the subscription), a side effect is to then continue the user
  // onto the next screen they were attempting to reach. In this case the screen to make
  // an offer.
  useEffect(() => {
    if (subscriptionModel.isSubscribed) {
      const destination: string = route.params?.destination ?? '';
      if (destination.length > 0) {
        navigation.navigate(destination);
      } else {
        navigation.goBack();
      }
    }
  }, [subscriptionModel]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{padding: 40}}>
        <Text style={[styles.bigText, {textAlign: 'center', marginBottom: 30}]}>
          Subscribe and unlock features!
        </Text>
        <Text style={styles.bigText}>
          • Place unlimited offers on properties
        </Text>
        <Text style={styles.bigText}>• Chat with a Live Real Estate Agent</Text>
        <Text style={styles.bigText}>• Gain Immortaility</Text>
      </View>
      <BasicButton label="$3 Monthly" onPress={updateSubscription} />
      <BasicButton label="$30 Annually" onPress={updateSubscription} />
    </SafeAreaView>
  );
};

// Basic screen representing an making an offer
// This screen doesn't utilize the subscription model, but simple
// resets the stack when the action is completed.
const OfferScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 40, flex: 1}}>
        <Text style={[styles.smallText, {color: '#a3a3a3'}]}>
          Property Details
        </Text>
        <Divider />
        <Text style={styles.bigText}>123 Fake Street</Text>
        <Text style={styles.smallText}>Ottawa, ON, Canada</Text>
        <Text style={[styles.smallText, {color: '#a3a3a3', marginTop: 40}]}>
          Your Details
        </Text>
        <Divider />
        <Text style={styles.bigText}>Green, Bob</Text>
        <Text style={styles.smallText}>129 Notareal Rd</Text>
        <Text style={styles.smallText}>Carp, ON, Canada</Text>
        <Text style={[styles.smallText, {color: '#a3a3a3', marginTop: 40}]}>
          Offer Details
        </Text>
        <Divider />
        <TextInput
          value={`$430,000`}
          style={{backgroundColor: '#fff', padding: 10, marginBottom: 30}}
        />
        <CheckBoxItem label="Contingent on Financing" />
        <CheckBoxItem label="Contingent on Inspection" />
        <CheckBoxItem label="Contingent on No Ghosts" />
        <View style={{flex: 1}} />
        <BasicButton
          label="Submit Offer"
          onPress={() => navigation.dispatch(StackActions.popToTop)}
        />
      </View>
    </SafeAreaView>
  );
};

//
// Below are a bunch of basic components that are used through this basic example
//
const BasicButton = (props: {label: string; onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          margin: 20,
          backgroundColor: '#d6d6d6',
          flexDirection: 'row',
        }}>
        <Text style={[{marginLeft: 20, marginRight: 20}, styles.bigText]}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CheckBoxItem = (props: {label: string}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
      }}>
      <CheckBox />
      <Text style={[styles.bigText, {marginLeft: 10}]}>{props.label}</Text>
    </View>
  );
};

const MockImageBox = (props: {style: any}) => {
  return (
    <View style={[props.style, {padding: 10, aspectRatio: 1}]}>
      <View
        style={{width: '100%', height: '100%', backgroundColor: '#d6d6d6'}}
      />
    </View>
  );
};

const LineItem = (props: {label: string; value: string}) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <Text style={{flex: 1}}>{props.label}</Text>
      <Text>{props.value}</Text>
    </View>
  );
};

const Divider = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        opacity: 0.1,
        marginTop: 10,
        marginBottom: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  bigText: {
    fontSize: 18,
  },
  smallText: {
    fontSize: 10,
  },
});

export default App;
