import * as React from "react";
import { Dropdown } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";

import {
  getOverallLocalStore,
  getLegendaryLocalStore,
} from "pokemonRanking-components/utils";
import "pokemonRanking-css/VoteList.css";

export function VoteList() {
  const [overallList, setOverallList] = React.useState<[]>([]);
  const [legendaryList, setLegendaryList] = React.useState<[]>([]);

  React.useEffect(() => {
    updateVoteList();
  }, [overallList, legendaryList]);

  const updateVoteList = () => {
    let stateLegendary = [];
    let localStoreLegendary = getLegendaryLocalStore();
    if (localStoreLegendary !== null) {
      if (localStoreLegendary !== JSON.stringify(legendaryList)) {
        stateLegendary = JSON.parse(localStoreLegendary);
        setLegendaryList(stateLegendary);
      }
    }
    let stateOverall = [];
    let localStoreOverall = getOverallLocalStore();
    if (localStoreOverall !== null) {
      if (localStoreOverall !== JSON.stringify(overallList)) {
        stateOverall = JSON.parse(localStoreOverall);
        setOverallList(stateOverall);
      }
    }
  };

  const renderOverallVotes = () => {
    let voteList = overallList?.map(
      (voted: { name: string; spriteURL: string }) => (
        <div className="dropdownitems">
          <img src={voted.spriteURL} />
          <p className="dropdownName">{voted.name}</p>
        </div>
      )
    );
    return voteList;
  };
  const renderLegendaryVotes = () => {
    let voteList = legendaryList?.map(
      (voted: { name: string; spriteURL: string }) => (
        <div className="dropdownitems">
          <img src={voted.spriteURL} className="dropdownImg" />
          <p className="dropdownName">{voted.name}</p>
        </div>
      )
    );
    return voteList;
  };

  return (
    <Dropdown onClick={updateVoteList} title="Voted" className="dropdown">
      <div className="dropdownheader">Overall Votes</div>
      {renderOverallVotes()}
      <hr />
      <div className="dropdownheader">Legendary Votes</div>
      {renderLegendaryVotes()}
    </Dropdown>
  );
}
