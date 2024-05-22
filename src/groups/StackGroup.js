import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* import options from '../functions/options'; */

import Home from '../components/Home';

const Stack = createNativeStackNavigator();

export default StackGroup = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} /* options={options.stack} */ />
    </Stack.Navigator>
  );
};
