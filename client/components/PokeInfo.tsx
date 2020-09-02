import * as React from 'react'
import {Button, Icon, Panel} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import '../css/PokeInfo.css'

type PokemonInfoProps = {
    retrieveSelectedPkmn: number
    updateSelectedPkmn: (pokemonId: number) => void
}

interface pokeInfoData {
    name: string;
    dexNum: number;
    officialArt: string;
    types: string[];
    regularAbilities: string[];
    hiddenAbilities: string[];
    baseHPStat: number;
    baseAtkStat: number;
    baseSpAtkStat: number;
    baseDefStat: number;
    baseSpDefStat: number;
    baseSpeedStat: number;
    baseStatTotal:number
    hpEVs: number;
    atkEVs: number;
    spAtkEVs: number;
    defEVs: number;
    spDefEVs: number;
    speedEVs: number;
}

interface specInfoData {
    catchRate: number;
    eggGroups: string[];
    preEvolution: string;
    preEvolutionURL: string;
    genIntro: number;
    growthRate: string;
    isLegendary: boolean
    isMythical: boolean
}

export const PokeInfo = (props: PokemonInfoProps) => {
    const {retrieveSelectedPkmn} = props;
    const {updateSelectedPkmn} = props;

    const [dexNum, setDexNum] = React.useState(0)
    /*
    const [name, setName] = React.useState("")
    const [elem, setElem] = React.useState("")
    const [ability, setAbility] = React.useState("")
    const [imgURL, setImgURL] = React.useState("")
    const [legendaryStatus, setLegendaryStatus] = React.useState(false)
*/
    const [pokeData, setPokeData] = React.useState<pokeInfoData>()
    const [specData, setSpectData] = React.useState<specInfoData>()

    React.useEffect(() => {
        setDexNum(retrieveSelectedPkmn)
        retrievePokeDetails()
        retrieveSpeciesDetails()
    }, [retrieveSelectedPkmn, dexNum])

    async function retrievePokeDetails() {
        let resp = await fetch("https://pokeapi.co/api/v2/pokemon/" + retrieveSelectedPkmn)
        let data = await resp.json()
        const {sprites, stats, types} = data
        let tempPokeData:pokeInfoData =
            {
                name:capitalize(data.name),
                dexNum:data.id,
                officialArt: sprites.other["official-artwork"].front_default,
                types: [],
                regularAbilities: [],
                hiddenAbilities: [],
                baseHPStat: stats[0].base_stat,
                baseAtkStat: stats[1].base_stat,
                baseDefStat: stats[2].base_stat,
                baseSpAtkStat: data.stats[3].base_stat,
                baseSpDefStat: data.stats[4].base_stat,
                baseSpeedStat: data.stats[5].base_stat,
                baseStatTotal:0,
                hpEVs: data.stats[0].effort,
                atkEVs: data.stats[1].effort,
                defEVs: data.stats[2].effort,
                spAtkEVs: data.stats[3].effort,
                spDefEVs: data.stats[4].effort,
                speedEVs: data.stats[5].effort
            }
        tempPokeData.types.push(capitalize(types[0].type.name))
        if(types.length > 1){
            tempPokeData.types.push(capitalize(types[1].type.name))
        }

        tempPokeData.baseStatTotal = tempPokeData.baseHPStat + tempPokeData.baseAtkStat +
            tempPokeData.baseDefStat + tempPokeData.baseSpAtkStat +
            tempPokeData.baseSpDefStat + tempPokeData.baseSpeedStat

        data.abilities.forEach((ability: { is_hidden: boolean, ability: any}) =>{
            if(ability.is_hidden){
                tempPokeData.hiddenAbilities.push(capitalize(ability.ability.name))
            }
            else{
                tempPokeData.regularAbilities.push(capitalize(ability.ability.name))
            }
        })
        setPokeData(tempPokeData)
        /*
        setName(capitalize(data.name))
        setElem(capitalize(data.types[0].type.name))
        setAbility(capitalize(data.abilities[0].ability.name))
        setImgURL(data.sprites.other["official-artwork"].front_default)
    */
    }

    async function retrieveSpeciesDetails() {
        let resp = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + retrieveSelectedPkmn)
        let data = await resp.json()

        let tempSpecData:specInfoData = {
            catchRate: data.capture_rate,
            eggGroups: [],
            preEvolution: "",
            preEvolutionURL:"",
            genIntro: parseInt(data.generation.url.replace("https://pokeapi.co/api/v2/generation/","").slice(0,-1)),
            growthRate: capitalize(data.growth_rate.name),
            isLegendary: data.is_legendary,
            isMythical: data.is_mythical
        }
        if (data.evolves_from_species){
            tempSpecData.preEvolution = data.evolves_from_species.name
            tempSpecData.preEvolutionURL = data.evolves_from_species.url
        }
        setSpectData(tempSpecData)
        //setLegendaryStatus(data.is_legendary)
    }

    const vote = async (contest: string) => {
        const spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
        await fetch('/vote', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contest: contest,
                name: pokeData?.name,
                dexNum: dexNum,
                imgURL: pokeData?.officialArt,
                spriteURL:`${spriteURL}${dexNum}.png`
            })
        })
    }

    const capitalize = (s: string) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function legendNomination() {
        if (specData?.isLegendary || specData?.isMythical) {
            return <Button size="lg" color="cyan" onClick={() => vote("legendary")}>Nominate Legendary</Button>
        }
    }

    let hide = false
    return (
        <div hidden={hide} id="pokeInfo">
            <Panel className="card" shaded bordered bodyFill>
                <h2>{pokeData?.name}: #{pokeData?.dexNum}</h2>
                <Icon size='lg' icon='close-circle' onClick={()=>updateSelectedPkmn(0)}/>
                <img src={pokeData?.officialArt} alt="vanity"/>
                <Button size="lg" color="green" onClick={() => vote("overall")}>Nominate Overall</Button>
                {legendNomination()}
            </Panel>
        </div>
    )
}