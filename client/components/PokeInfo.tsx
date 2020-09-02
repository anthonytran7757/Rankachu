import * as React from 'react'
import {Button, Icon, Panel} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import '../css/PokeInfo.css'

type PokemonInfoProps = {
    retrieveSelectedPkmn: number
    updateSelectedPkmn?: (pokemonId: number) => void
}

export const PokeInfo = (props: PokemonInfoProps) =>{
    const {retrieveSelectedPkmn} = props;
    const {updateSelectedPkmn} = props;
    const [dexNum, setDexNum] = React.useState(0)
    const [name, setName] = React.useState("")
    const [elem, setElem] = React.useState("")
    const [ability, setAbility] = React.useState("")
    const [imgURL, setImgURL] = React.useState("")
    const [legendaryStatus, setLegendaryStatus] = React.useState(false)

    React.useEffect(()=>{
        async function retrievePokeDetails(){
            let resp = await fetch("https://pokeapi.co/api/v2/pokemon/" +retrieveSelectedPkmn)
            let data = await resp.json()
            setName(capitalize(data.name))
            setElem(capitalize(data.types[0].type.name))
            setAbility(capitalize(data.abilities[0].ability.name))
            setImgURL(data.sprites.other["official-artwork"].front_default)

        }
        async function retrieveExtraDetails(){
            let resp = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + dexNum)
            let data = await resp.json()
            setLegendaryStatus(data.is_legendary)
        }
        setDexNum(retrieveSelectedPkmn)
        retrievePokeDetails()
        retrieveExtraDetails()

    },[retrieveSelectedPkmn,dexNum])

    const vote = async (contest: string) => {
        let spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
        await fetch('/vote', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({contest: contest, name:name, dexNum: dexNum, imgURL: imgURL, spriteURL: spriteURL+dexNum+".png"})
        })
    }

    const capitalize = (s: string) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function legendNomination(){
        if (legendaryStatus){
            return <Button size="lg" color="cyan" onClick={() => vote("legendary")}>Nominate Legendary</Button>
        }
    }
    return(
        <div id="pokeInfo">
            <Panel className="card" shaded bordered bodyFill>
                <h2>{name}: #{dexNum}</h2>
                <Icon size='lg' icon='close-circle' onClick={() => updateSelectedPkmn(0)}/>
                <img src={imgURL} alt="vanity"/>
                <Button size="lg" color="green" onClick={() => vote("overall")}>Nominate Overall</Button>
                {legendNomination()}
                <p>Type: {elem} </p>
                <p>Abilities: {ability}</p>
            </Panel>
        </div>
    )
}