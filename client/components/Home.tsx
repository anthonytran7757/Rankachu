import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {Button, List, Panel,Grid, Row, Col} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import {Navigation} from './Navigation'
import '../css/Home.css'

export const Home = () =>{
    const [pokeRankings, setPokeRankings] = React.useState<any>()
    React.useEffect(()=>{
        async function retrieveRankings(){
            let resp = await fetch("/contest", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            let data = await resp.json()
            await setPokeRankings(data)
        }
        retrieveRankings()
    },[])

    const renderTopThree = (contest: String) =>{
        if(pokeRankings){
            let index

            if (contest == "overall"){index = 0}
            else if(contest == "legendary"){index = 1}
            else{index = 2}

            let overallTopThree = pokeRankings[index].nominees.slice(0,3)
            let toDisplay = overallTopThree.map((poke: any, index:number) =>(
                <Col md={8}>
                    <Panel bordered shaded className="pokeCard">
                        <h3>#{index + 1} {poke.name}
                            <img src={`../assets/medal${index}.png`}/>
                        </h3>
                        <img className="pokeIMG"src={poke.imgURL}/>
                    </Panel>
                </Col>
            ))
            return(toDisplay)
        }
    }

    const renderContenders = (contest:String) => {
        if(pokeRankings){
            let index

            if (contest == "overall"){index = 0}
            else if(contest == "legendary"){index = 1}
            else{index = 2}

            let overallTopThree = pokeRankings[index].nominees.slice(3,10)
            let toDisplay = overallTopThree.map((poke: any, index:number) =>(
                <List.Item>
                    <p>
                        #{index + 4} <img src={poke.spriteURL}/> {poke.name}
                    </p>
                </List.Item>
            ))
            return toDisplay
        }
    }
        return(
            <div>
                <h1>Pokemon Ranking</h1>
                <h2>Top Overall</h2>
                <Grid>
                    <Row>
                        {renderTopThree("overall")}
                    </Row>
                </Grid>
                <Panel header="Honourable Mentions" defaultExpanded collapsible bordered>
                    <List>
                        {renderContenders("overall")}
                    </List>
                </Panel>
                <h2>Top Legendary</h2>
                <Grid>
                    <Row>
                        {renderTopThree("legendary")}
                    </Row>
                </Grid>
                <Panel header="Honourable Mentions" defaultExpanded collapsible bordered>
                    <List>
                        {renderContenders("legendary")}
                    </List>
                </Panel>


            </div>
        )
}

