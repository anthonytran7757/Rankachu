import * as React from 'react'
import {Dropdown} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

import {useEffect} from "react";
import {getOverallLocalStore, getLegendaryLocalStore} from './utils';
import '../css/VoteList.css'
import DropdownMenu from "rsuite/es/Dropdown/DropdownMenu";

export function VoteList() {
    const [overallList, setOverallList] = React.useState<[]>([])
    const [legendaryList, setLegendaryList] = React.useState<[]>([])


    React.useEffect(() => {
        updateVoteList()
    }, [overallList, legendaryList])

    const updateVoteList = () => {
        let stateLegendary = []
        let localStoreLegendary = getLegendaryLocalStore()
        if (localStoreLegendary !== null) {
            if (localStoreLegendary !== JSON.stringify(legendaryList)) {
                stateLegendary = JSON.parse(localStoreLegendary)
                setLegendaryList(stateLegendary)
            }
        }
        let stateOverall = []
        let localStoreOverall = getOverallLocalStore()
        if (localStoreOverall !== null) {
            if (localStoreOverall !== JSON.stringify(overallList)) {
                stateOverall = JSON.parse(localStoreOverall)
                setOverallList(stateOverall)
            }
        }
    }

    const renderOverallVotes = () => {
        //if
        let voteList = overallList?.map((voted: { name: string, spriteURL: string }) => (
            <Dropdown.Item className="dropdownitems">
                <img src={voted.spriteURL}/>
                <p className="dropdownName">{voted.name}</p>
            </Dropdown.Item>
        ))
        return voteList
    }
    const renderLegendaryVotes = () => {
        //if
        let voteList = legendaryList?.map((voted: { name: string, spriteURL: string }) => (
            <Dropdown.Item className="dropdownitems">
                <img src={voted.spriteURL} className="dropdownImg"/>
                <p className="dropdownName">{voted.name}</p>
            </Dropdown.Item>
        ))
        return voteList
    }

    return (
        <Dropdown onClick={updateVoteList} title="Voted" className="dropdown">
            <Dropdown.Item className="dropdownheader">Overall Votes</Dropdown.Item>
            {renderOverallVotes()}
            <Dropdown.Item className="dropdownheader">Legendary Votes</Dropdown.Item>
            {renderLegendaryVotes()}
        </Dropdown>
    )
}
