import { ScrollView, TextInput } from "react-native-gesture-handler";
import ImagePicker from "./ImagePicker";

function PlaceForm() {
    const [enteredTitle, setEnteredTitle] = useState('');

    function ChangeTitleHandler(enteredText) {
        setEnteredTitle(enteredText);
    }

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text styles={styles.label}>Title</Text>
                <TextInput styles={styles.input} onChangeText={ChangeTitleHandler} value={enteredTitle}></TextInput>
            </View>
            <ImagePicker/>
        </ScrollView>
    )
}

export default PlaceForm;

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 24
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        backgroundColor: '#fff'   
    }
})