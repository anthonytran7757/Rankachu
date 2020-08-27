import * as React from 'react'


type PokemonIdProp = {
    retrieveSelectedPkmn: () => string
}



export const PokeInfo = (props: PokemonIdProp) =>{
    const [name, setName] = React.useState("")
    const [elem, setElem] = React.useState("")
    const [ability, setAbility] = React.useState("")
    const [imgURL, setImgURL] = React.useState("")

    const {retrieveSelectedPkmn} = props;

    React.useEffect(()=>{
        fetch(retrieveSelectedPkmn())
            .then(response => response.json())
            .then(data => {
                setName(data.name)
                setElem(data.types[0].type.name)
                setAbility(data.abilities[0].ability.name)
                setImgURL(data.sprites.front_default)
            })
    },[])

    return(
        <div>
            <h1>Name: {name}</h1>
            <img src={imgURL}></img>
            <p>Type: {elem} </p>
            <p>Abilities: {ability}</p>

        </div>
    )
}