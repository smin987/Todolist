import { Text, View, StyleSheet,TouchableOpacity, TextInput,ScrollView, Alert, Platform } from "react-native";
import { theme } from "../colors";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fontisto} from "@expo/vector-icons"

const STORAGE_KEY="@toDos"

export default function Index() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(()=> {
    loadToDos();
  },[])
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText=(payload:any) => setText(payload)
  const saveToDos = async (toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  const loadToDos = async () =>{
    // 실사용시 catch를 적용하는것이 좋다
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  }
  const addToDo = async () => {
    if(text===""){
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]:{text, working},
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("")
  };
  const deleteToDo = (key) =>{
    if(Platform.OS === "web"){
      const ok = confirm("You want to delete this item?");
      if(ok){
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else{    
      Alert.alert("Delete To Do","Are you sure?", [
        {text:"Cancel"},
        {text:"OK", 
          style:"destructive",
          onPress:async ()=>{
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },

      ])}

    return

  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white": theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white": theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType='done'
        value ={text}
        placeholder={working ? "Add a To Do":"Where do you want to go?"} 
        style={styles.input}/>
        <ScrollView>
          {Object.keys(toDos).map((key)=> 
            toDos[key].working === working ? (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=>deleteToDo(key)}>
              <Fontisto name="trash" size={20} color={theme.grey}></Fontisto>
            </TouchableOpacity>
          </View>) : null
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    fontSize:44,
    fontWeight:"600",
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop:20,
    fontSize:18,
    marginVertical:20,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  toDoText:{
    color:"white",
    fontSize:16,
    fontWeight:"500",
  },
});