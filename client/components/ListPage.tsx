import * as React from 'react';

import {PokemonList} from './PokemonList'
import {PokeInfo} from './PokeInfo'

import '../css/ListPage.css'

export function ListPage(){
    const [selectedPkmn, setSelectedPkmn] = React.useState(0)

    const updateSelectedPkmn = (pkmnId: number) => {
        setSelectedPkmn(pkmnId)
    }

    const renderPokeInfo = () =>{
        if(selectedPkmn){
            return(
                <PokeInfo retrieveSelectedPkmn={selectedPkmn} updateSelectedPkmn={updateSelectedPkmn}/>)
        }
    }

    return (
        <div>
            <h1>Pokemon List</h1>
            <PokemonList updateSelectedPkmn={updateSelectedPkmn}/>
            {renderPokeInfo()}
        </div>)
}