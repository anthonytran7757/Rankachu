import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {List, Button, Loader, Pagination} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

import '../css/PokemonList.css'

type PokemonListProps = {
    updateSelectedPkmn: (pokemonId: string) => void
}

interface pkmnListData {
    name: string;
    url: string;
}

export function PokemonList(props: PokemonListProps) {
    const {updateSelectedPkmn} = props;
    const [pkmnList, setPkmnList] = React.useState<pkmnListData[]>([])
    const [currPage, setCurrPage] = React.useState<number>(1)

    React.useEffect(() => {
        retrievePkmnList();
    }, [currPage])


    async function retrievePkmnList() {
        let offset = ((currPage -1)* 10).toString();
        let url = "https://pokeapi.co/api/v2/pokemon/?limit=10&offset=".concat(offset)
        console.log(url)
        let resp = await fetch(url);
        let data = await resp.json()
        setPkmnList(data.results)
    }

    const paging = (eventKey:number) =>{
        setCurrPage(eventKey)
    }

    const getSpriteURL = (pokeURL: string) => {
        let dexNum = pokeURL;
        dexNum = dexNum.replace('https://pokeapi.co/api/v2/pokemon/',"")
        dexNum = dexNum.substring(0, dexNum.length - 1);
        let imgURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
        imgURL = imgURL.concat(dexNum,".png")
        return imgURL
    }
    const capitalize = (s: string) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const renderList = () => {
        let listToDisplay = pkmnList.map(item => (
            <a onClick={() => selectPkmn(item.url)}>
                <List.Item>
                    <img src={getSpriteURL(item.url)}/>
                    {capitalize(item.name)}
                </List.Item>
            </a>
        ))
        return(listToDisplay)
    }

    const selectPkmn = (selectedPkmn: string) => {
        updateSelectedPkmn(selectedPkmn)
    }
    return (
        <div id="pokeList">
            <List size="sm" bordered hover >
                {renderList()}
            </List>
            <Pagination
                prev
                last
                next
                first
                size="m"
                ellipsis
                pages={90}
                maxButtons={10}
                activePage={currPage}
                onSelect={paging}
            />
        </div>
    )
}







