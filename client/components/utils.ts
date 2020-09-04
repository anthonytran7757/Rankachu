export const sanitizeString = (s: string) => {
    s = s.replace('-', " ")
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getOverallLocalStoreKey =() =>{
    return "overallVotes"
}

export const getLegendaryLocalStoreKey =() =>{
    return "legendaryVotes"
}

export const getOverallLocalStore = () =>{
    return localStorage.getItem(getOverallLocalStoreKey())
}

export const getLegendaryLocalStore = () =>{
    return localStorage.getItem(getLegendaryLocalStoreKey())
}

export const arraysMatch = (arr:[], otherArr:[]) =>{
    console.log("arraymatch begins")
    console.log(arr)
    console.log(otherArr)
    if (arr.length !== otherArr.length) return false;
    for (var i = 0; i < arr.length; i++) {
        console.log("arr: " + arr[i])
        console.log("otehrarr: " + otherArr[i])
        if (arr[i] !== otherArr[i]) return false;
    }
    return true;
}