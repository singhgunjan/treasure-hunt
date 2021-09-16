import { View, StyleSheet, Text, TouchableOpacity, Alert,} from "react-native";
import React, { useState } from "react";
import { TextInput } from 'react-native-paper';
import firebase from './../config/key';
import 'firebase/firestore';

export default function WelcomeScreen () {

    const [fields, setFields] = useState([{ value: null }]);
    const [team, setTeam] = useState("");
    const [register, setRegister] = useState(true);
    const [login, setLogin] = useState(false);
    const [puzz, setPuzzle] = useState(0);
    const [ques, setQuestion] = useState([]);
    const [ans, setAnswer] = useState([]);
    const [solution, setSolution] = useState("");
    const [passcode, setPasscode] = useState("");

    const question = [];
    const answer = [];

    function handleChange(i, event) {
        const values = [...fields];
        values[i].value = event.target.value;
        setFields(values);
    }

    function handleAdd() {
        const values = [...fields];
        values.push({ value: null });
        setFields(values);
    }

    function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    function handleAddTeam() {
        console.log(team);
        const values = [...fields];
        console.log(values);

        const db = firebase.firestore();
        db.collection("Teams").doc(team).set({
            members: values,
            puzzle: 0,
            passcode: passcode
          })
        setRegister(true);
        setLogin(true);
        getQuestions();
    }

    function handlePress() {
        var i = 0;
        var puzzle = 0;
        var pass = "";
        const db = firebase.firestore();
        db.collection("Teams").get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
                if(doc.id === team) {
                    i++;
                    puzzle = doc.data().puzzle;
                    pass = doc.data().passcode;
                }
            });
            if(i===0) {
                alert("Team not found. Please register!");
                setRegister(false);
            } else { 
                if(pass === passcode) {
                    setLogin(true);
                    console.log(puzzle);
                    setPuzzle(puzzle);
                    getQuestions();
                } else {
                    alert("Passcode Incorrect!");
                }
            }
        });
        
    }

    function getQuestions() {
        var i = 0;
        const db = firebase.firestore();
        db.collection("Puzzles").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                question[i] = doc.data().puzzle;
                answer[i] = doc.data().answer;
                i++;
            });
            setAnswer(answer);
            setQuestion(question);
        });
    }

    function handleSolution() {
        if(solution == ans[puzz]) {
            var newPuzzle = puzz + 1;
            setPuzzle(newPuzzle)
            const db = firebase.firestore();
            db.collection("Teams").doc(team).update({
            puzzle: newPuzzle
          })
          setSolution("");
        } else {
            alert("Incorrect");
        }
    }
    return (
        register?
        login?
        <View style = {styles.container}>
            <h1>Question {puzz + 1}</h1>
            <h3>{ques[puzz]}</h3>
            <TextInput style={styles.input} mode="outlined" label="Answer" placeholder="Type answer here!" value={solution} onChangeText={solution => setSolution(solution)}/>
            <TouchableOpacity onPress = {handleSolution} style = {styles.start}><Text style = {{color: 'white'}}>Submit</Text></TouchableOpacity><br/>
        </View>
        :
        <View style = {styles.container}> 
            <h1>GRE-Treasure-Hunt!!</h1>
            <form>
                <TextInput style={styles.input} mode="outlined" label="Team Name" placeholder="Type team name here!" value={team} onChangeText={team => setTeam(team)}/>
                <TextInput style={styles.input} mode="outlined" label="Passcode" placeholder="Enter passcode!" value={passcode} onChangeText={passcode => setPasscode(passcode)}/>
                <TouchableOpacity onPress = {handlePress} style = {styles.start}><Text style = {{color: 'white'}}>Start Now!!</Text></TouchableOpacity><br/>
                <Text style={{color: 'blue'}} onPress={() => {setRegister(false)}}>Register your team here!</Text>
            </form> 
        </View>
        :
        <View style = {styles.container}> 
            <h1>GRE-Treasure-Hunt!!</h1>
            <form>
                <TextInput style={styles.input} mode="outlined" label="Team Name" placeholder="Type team name here!"  value={team} onChangeText={team => setTeam(team)}/>
                <TextInput style={styles.input} mode="outlined" label="Passcode" placeholder="Enter passcode!" value={passcode} onChangeText={passcode => setPasscode(passcode)}/>
                <div style = {{marginTop: '50px'}}>
                <label style= {{fontWeight: 'bold'}}>Add Members</label>
                <TouchableOpacity onPress={handleAdd} style={styles.roundButton1} ><Text style = {{color: 'white'}}>Click here to Add</Text></TouchableOpacity>
                </div>
                {fields.map((field, idx) => {
                    return (
                        <div key={`${field}-${idx}`}>
                            <TextInput style={styles.input} mode="outlined" label="Name" placeholder="Enter name here!"  onChange={e => handleChange(idx,e)} />
                            <TouchableOpacity onPress={() => handleRemove(idx)} style={styles.roundButton2} ><Text style = {{color: 'white'}}>Remove</Text></TouchableOpacity>
                        </div>
                    );
                })}
                <TouchableOpacity onPress = {handleAddTeam} style = {styles.submit}><Text style = {{color: 'white'}}>Submit</Text></TouchableOpacity>
            </form> 
        </View>
    )
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButton1: {
    width: 130,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'green',
    float: 'right',
    
  },
  roundButton2: {
    width: 70,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'purple',
    float: 'bottom',
    marginTop:'2px'
  },
  submit: {
    backgroundColor: 'black',
    color: 'white',
    Text: '20px',
    padding: '10px',
    marginStart: '75px',
    borderRadius: '5px',
    width: "70px",
    alignContent:'center',
    margin: '10px',
    cursor: 'pointer'
  },
  start: {
    backgroundColor: 'black',
    color: 'white',
    Text: '20px',
    padding: '10px',
    borderRadius: '5px',
    width: "100px",
    alignContent:'center',
    margin: '10px',
    cursor: 'pointer'
  },
  input: {
    height: '30',
    width: '250px',
    marginTop: '10px',
    mode: 'outlined',
    backgroundColor: 'white',
    outlineColor: 'black',
    color: 'black'
  }
}); 