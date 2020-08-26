import React, { Component } from 'react';
import {Button} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import '../css/App.css';

class App extends Component {
    testInsert(){
        fetch('/insert', {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: "billy",
                phoneNumber: 123456
            })
        }).then(function(response){
            console.log("test")
        })
        console.log("hello")
    }
    testShow(){
        fetch('/collections',{
            method:'GET'
        })
    }
    render() {
        return (
            <div>
                <h1>Pokemon Rankings</h1>
                <Button onClick={this.testInsert}>test insert</Button>
                <Button onClick={this.testShow}>show all collections</Button>
            </div>


        );
    }
}
export default App;