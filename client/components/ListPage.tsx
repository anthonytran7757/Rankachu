import * as React from 'react';
import {Navigation} from './Navigation'
import {PokemonList} from './PokemonList'
import {PokeInfo} from './PokeInfo'

export function ListPage(){
    const [selectedPkmn, setSelectedPkmn] = React.useState("")

    const updateSelectedPkmn = (pkmnId: string) => {
        setSelectedPkmn(pkmnId)
    }

    const retrieveSelectedPkmn = () => {
        return selectedPkmn
    }

    const renderPokeInfo = () =>{
        if(selectedPkmn){
            return(
                <PokeInfo retrieveSelectedPkmn={retrieveSelectedPkmn}/>)
        }
    }

    return (
        <div>
            <Navigation/>
            <h1>Pokemon List</h1>
            <PokemonList updateSelectedPkmn={updateSelectedPkmn}/>
            {renderPokeInfo()}
        </div>)
}

