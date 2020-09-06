export const sanitizeString = (s: string) => {
  s = s.replace("-", " ");
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export const getOverallLocalStoreKey = () => {
  return "overallVotes";
};
export const getLegendaryLocalStoreKey = () => {
  return "legendaryVotes";
};

export const getOverallLocalStore = () => {
  return localStorage.getItem(getOverallLocalStoreKey());
};

export const getLegendaryLocalStore = () => {
  return localStorage.getItem(getLegendaryLocalStoreKey());
};

export const getOverallVoteCount = () => {
  let overalls = getOverallLocalStore();
  if (overalls !== null) {
    return JSON.parse(overalls).length;
  }
  return 0;
};
export const getLegendaryVoteCount = () => {
  let overalls = getLegendaryLocalStore();
  if (overalls !== null) {
    return JSON.parse(overalls).length;
  }
  return 0;
};

export const voteToggle = (contest: string, pokeName: string) => {
  if (contest === "overall") {
    if (getOverallVoteCount() >= 3) {
      return false;
    } else {
      let overallList: any = getOverallLocalStore();
      if (overallList !== null) {
        overallList = JSON.parse(overallList);
        for (let i = 0; i < overallList.length; i++) {
          if (overallList[i].name === pokeName) {
            return false;
          }
        }
      }
    }
  } else {
    //Legendary
    if (getLegendaryVoteCount() >= 3) {
      return false;
    } else {
      let legendaryList: any = getLegendaryLocalStore();
      if (legendaryList !== null) {
        legendaryList = JSON.parse(legendaryList);
        for (let i = 0; i < legendaryList.length; i++) {
          if (legendaryList[i].name === pokeName) {
            return false;
          }
        }
      }
    }
  }
  return true;
};
