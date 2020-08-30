import * as React from 'react';

import {PokemonList} from './PokemonList'
import {PokeInfo} from './PokeInfo'

export function ListPage(){
    const [selectedPkmn, setSelectedPkmn] = React.useState(0)

    const updateSelectedPkmn = (pkmnId: number) => {
        setSelectedPkmn(pkmnId)

    }

    const retrieveSelectedPkmn = () => {
        return selectedPkmn
    }


    const renderPokeInfo = () =>{
        if(selectedPkmn){
            return(
                <PokeInfo retrieveSelectedPkmn={selectedPkmn}/>)
        }
    }

    return (
        <div>
            <h1>Pokemon List</h1>
            <PokemonList updateSelectedPkmn={updateSelectedPkmn}/>
            {renderPokeInfo()}
        </div>)
}

