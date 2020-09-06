import * as React from 'react'
import {Button, Col, Grid, Icon, Panel, Row} from 'rsuite';

import {getOverallLocalStore,
    getLegendaryLocalStore,
    getLegendaryLocalStoreKey,
    getOverallLocalStoreKey,
    sanitizeString, voteToggle} from './utils';


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
    regularAbility: string;
    secondRegAbility: string;
    hiddenAbility: string;
    baseStats: number[]
    baseStatTotal: number
    EVs: number[],
    spriteURL:string
}

interface specInfoData {
    catchRate: number;
    eggGroupOne: string;
    eggGroupTwo: string;
    genIntro: number;
    growthRate: string;
    isLegendary: boolean
    isMythical: boolean
}

export const PokeInfo = (props: PokemonInfoProps) => {
    const {retrieveSelectedPkmn} = props;
    const {updateSelectedPkmn} = props;
    const [pokeData, setPokeData] = React.useState<pokeInfoData>()
    const [specData, setSpectData] = React.useState<specInfoData>()
    const [hidden, setHide] = React.useState<boolean>(true)
    const [rerender, setRerender] = React.useState<boolean>(true)

    const [overallVoteToggle, setOverallVoteToggle] = React.useState<boolean>(true)
    const [legendaryVoteToggle, setLegendaryVoteToggle] = React.useState<boolean>(true)

    const STAT_LABELS = ["HP", "ATK", "DEF", "SP.ATK", "SP.DEF", "SPD"]

    //let hide = false

    React.useEffect(() => {
        async function retrievePokeDetails() {
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon/" + retrieveSelectedPkmn)
            const data = await resp.json()
            const {sprites, types} = data
            let tempPokeData: pokeInfoData =
                {
                    name: sanitizeString(data.name),
                    dexNum: data.id,
                    officialArt: sprites.other["official-artwork"].front_default,
                    types: [],
                    regularAbility: "",
                    secondRegAbility: "",
                    hiddenAbility: "None",
                    baseStats: [],
                    baseStatTotal: 0,
                    EVs: [],
                    spriteURL: sprites.versions["generation-viii"].icons.front_default
                }
            //set types
            tempPokeData.types.push(sanitizeString(types[0].type.name))
            if (types.length === 2) {
                tempPokeData.types.push(sanitizeString(types[1].type.name))
            }

            let tempBaseStats: number[] = []
            let tempEVs: number[] = []
            data.stats.forEach((stat: any) => {
                tempBaseStats.push(stat.base_stat)
                tempEVs.push(stat.effort)
                tempPokeData.baseStatTotal += stat.base_stat
            })

            tempPokeData.baseStats = tempBaseStats
            tempPokeData.EVs = tempEVs


            //set abilities
            data.abilities.forEach((ability: { slot: number; ability: { name: string; }; }) => {
                const {slot, ability: abil} = ability
                if (slot === 1) {
                    tempPokeData.regularAbility = sanitizeString(abil.name)
                } else if (slot === 2) {
                    tempPokeData.secondRegAbility = sanitizeString(abil.name)
                } else {
                    tempPokeData.hiddenAbility = sanitizeString(abil.name)
                }
            })
            setPokeData(tempPokeData)
            setOverallVoteToggle(voteToggle("overall", tempPokeData.name))
            setLegendaryVoteToggle(voteToggle("legendary", tempPokeData.name))

        }
        async function retrieveSpeciesDetails() {
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + retrieveSelectedPkmn)
            const data = await resp.json()
            const {egg_groups} = data;

            let tempSpecData: specInfoData = {
                catchRate: data.capture_rate,
                eggGroupOne: sanitizeString(data.egg_groups[0].name),
                eggGroupTwo: "",
                genIntro: parseInt(data.generation.url.replace("https://pokeapi.co/api/v2/generation/", "").slice(0, -1)),
                growthRate: sanitizeString(data.growth_rate.name),
                isLegendary: data.is_legendary,
                isMythical: data.is_mythical
            }

            if (egg_groups.length === 2) {
                tempSpecData.eggGroupTwo = sanitizeString(data.egg_groups[1].name)
            }

            setSpectData(tempSpecData)
        }
        retrievePokeDetails()
        retrieveSpeciesDetails()
        setHide(false)

    }, [retrieveSelectedPkmn,rerender])

    const vote = async (contest: string) => {
        let resp = await fetch('/vote', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contest: contest,
                name: pokeData?.name,
                dexNum: pokeData?.dexNum,
                imgURL: pokeData?.officialArt,
                spriteURL: pokeData?.spriteURL
            })
        })

        if(resp.status == 200){
            const voteData = {name: pokeData?.name, spriteURL: pokeData?.spriteURL}
            if(contest === "overall"){
                ///return function
                let overallVotes:any = getOverallLocalStore()
                if(overallVotes === null){
                    overallVotes = []
                }
                else{
                    overallVotes = JSON.parse(overallVotes)
                }
                overallVotes.push(voteData)
                localStorage.setItem(getOverallLocalStoreKey(), JSON.stringify(overallVotes))
                setOverallVoteToggle(false)
            }
            else{
                let legendaryVotes:any = getLegendaryLocalStore()
                if(legendaryVotes === null){
                    legendaryVotes = []
                }
                 else{
                    legendaryVotes = JSON.parse(legendaryVotes)
                }
                legendaryVotes.push(voteData)
                localStorage.setItem(getLegendaryLocalStoreKey(), JSON.stringify(legendaryVotes))
                setLegendaryVoteToggle(false)
            }
            setRerender(!rerender)
        }
    }

    const renderVoteButtons = () => {
        return (
            <>
                <Button
                    className="voteButton"
                    disabled={!overallVoteToggle}
                    size="lg" color="green"
                    onClick={() => vote("overall")}>
                    Vote Overall</Button>
                {legendNomination()}
            </>
        )
    }

    const legendNomination = () => {
        if (specData?.isLegendary || specData?.isMythical) {
            return <Button
                className="voteButton"
                disabled={!legendaryVoteToggle}
                size="lg"
                color="cyan"
                onClick={() => vote("legendary")}>
                Vote Legendary</Button>
        }
    }

    const renderTypeImgs = () => {
        let typeImgs = pokeData?.types.map(type => (<img className="typeIMG" alt="vanity" src={`../assets/elements/${type.toLowerCase()}.png`}/>))
        return typeImgs
    }

    const renderRegAbility = () => {
        if (pokeData?.secondRegAbility) {
            return (
                <div className="singleField">
                    <h4 className="title">Abilities: </h4>
                    <p className="content">{pokeData.regularAbility} or {pokeData.secondRegAbility}</p>
                </div>
            )
        } else {
            return (
                <div className="singleField">
                    <h4 className="title">Abilities: </h4>
                    <p className="content">{pokeData?.regularAbility}</p>
                </div>
            )
        }
    }


    const renderStats = () => {
        let statHeader = STAT_LABELS.map(header => {
            return (<Col className="statContent" xs={2}><strong>{header}</strong></Col>)
        })

        let pokeStats = pokeData?.baseStats.map(stat => {
            return (<Col className="statContent" xs={2}>{stat}</Col>)
        })
        return (
            <Grid className="grid">
                <Row xs={12}><h4 className="gridHeader">Stats</h4></Row>
                <Row>{statHeader}</Row>
                <Row>{pokeStats}</Row>
            </Grid>

        )
    }

    const renderEVs = () => {
        let statHeader = STAT_LABELS.map(header => {
            return (<Col className="statContent" xs={2}><strong>{header}</strong></Col>)
        })

        let EVs = pokeData?.EVs.map(stat => {
            return (<Col className="statContent" xs={2}>{stat}</Col>)
        })

        return (
            <Grid className="grid">
                <Row xs={12}><h4 className="gridHeader">EVs</h4></Row>
                <Row>{statHeader}</Row>
                <Row>{EVs}</Row>
            </Grid>
        )
    }

    const renderEggGroup = () => {
        if (specData?.eggGroupTwo === "") {
            return (
                <div className="singleField">
                    <h4 className="title">Egg Group: </h4>
                    <p className="content">{specData?.eggGroupOne}</p>
                </div>
            )
        } else {
            return (
                <div className="singleField">
                    <h4 className="title">Egg Group: </h4>
                    <p className="content">{specData?.eggGroupOne} or {specData?.eggGroupTwo}</p>
                </div>
            )
        }
    }

    //updateSelectedPkmn(0)


    return (
        <div hidden={hidden} className="pokeInfo">
            <Panel className="card" shaded bordered bodyFill>
                <Icon size='lg' icon='close-circle' className="xButton" onClick={() => {setHide(true)}}/>
                <h2>{pokeData?.name}: #{pokeData?.dexNum}</h2>
                <img className="artwork" src={pokeData?.officialArt} alt="vanity"/>
                <div className="types">
                    {renderTypeImgs()}
                </div>
                {renderRegAbility()}
                <div className="singleField">
                    <h4 className="title">Hidden Ability: </h4>
                    <p className="content">{pokeData?.hiddenAbility}</p>
                </div>

                <div className="singleField">
                    <h4 className="title">Generation Introduced:</h4>
                    <p className="content">{specData?.genIntro}</p>
                </div>
                <div className="singleField">
                    <h4 className="title">Catch Rate: </h4><p className="content">{specData?.catchRate}</p>
                </div>
                {renderEggGroup()}
                {renderStats()}
                {renderEVs()}
                {renderVoteButtons()}
            </Panel>
        </div>
    )
}