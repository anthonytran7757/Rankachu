import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {List, Button, Loader} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import {Navigation} from './Navigation'

import '../css/PokemonList.css'

type PokemonListProps = {
    updateSelectedPkmn: (pokemonId: string) => void
}

interface pkmnListData {
    name: string;
    url: string;
    imgURL?: string
}

export function PokemonList(props: PokemonListProps) {

    const {updateSelectedPkmn} = props;

    const [pkmnList, setPkmnList] = React.useState<pkmnListData[]>([])


    React.useEffect(() => {
        async function retrievePkmnList() {
            let tempResp;
            let tempData;
            let resp = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=5');
            resp.json().then(data => {
                let listOfPokes = data.results;
                listOfPokes.forEach(async function (poke: any) {
                    //tempResp = await fetch(poke.url)
                    //tempData = await tempResp.json()
                    pkmnList.push(
                        {
                            "name": poke.name,
                            "url": poke.url,
                            //"imgURL": tempData.sprites.versions['generation-viii'].icons.front_default
                        })
                })
                setPkmnList(pkmnList)
            });
        }

        retrievePkmnList();
    }, [pkmnList]
    )


    const test = (testparam: string) => {
        updateSelectedPkmn(testparam)
    }

    const renderList = () => {
        console.log(pkmnList);
        let listToDisplay = pkmnList.map(item => (

                <List.Item>
                    {item.name}
                    <Button onClick={() => test(item.url)}>{'>'}</Button>
                </List.Item>

        ))
    }

    return (<div>
        <List bordered hover>
            {pkmnList.map(item => (

                <List.Item>
                    {item.name}
                    <Button onClick={() => test(item.url)}>{'>'}</Button>
                </List.Item>

            ))}
        </List>
    </div>)


}







