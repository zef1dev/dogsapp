import { launchCameraAsync } from 'expo-image-picker';
import { View, Text, Button } from 'react-native';

function ImagePicker() {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    async function verifyPermissions() {
    
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            
            return permissionResponse.granted;
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant camera permissions to use this app.'
            );
        }
    }
    async function takeImageHandler() {
       const image = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,

       });
       console.log(image);
    }
    

 return <View>
  <Text>Image Picker</Text>
  <Button title="Take Image" onPress={takeImageHandler} />
 </View>
}

export default ImagePicker;