import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { asyncStorage } from 'reactotron-react-native';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({ name: 'NASA Space Explorer' })
  .useReactNative({ asyncStorage: false })
  .use(asyncStorage())
  .connect();

  