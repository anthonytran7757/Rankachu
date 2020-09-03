import * as React from 'react'
import {Dropdown} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css'
import {useEffect} from "react";

export function VoteList (){
    const renderVoteList = () =>{
        let myarr = []
        let votedPokemon = localStorage.getItem("votedPokemon")
        if(votedPokemon !== null){
            myarr = JSON.parse(votedPokemon)
        }

        let listToDisplay = myarr.map((vote: { spriteURL: string; name: string; }) => {
            <Dropdown.Item>
                test
            </Dropdown.Item>
        })
        console.log(listToDisplay)
        return listToDisplay
    }

    return(
        <Dropdown title="Voted">
            {renderVoteList()}
        </Dropdown>
    )
}