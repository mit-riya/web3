export function VerifyIdentity (identityType) {
    const randomInt = Math.floor(Math.random() * (100));
    console.log(randomInt);
    if(identityType === 0){
        if(randomInt < 10) return false;
    } else if (identityType === 1){
        if(randomInt < 10) return false;
    } else if (identityType === 2){
        if(randomInt < 10) return false;
    } else if (identityType === 3){
        if(randomInt < 10) return false;
    } else if (identityType === 4){
        if(randomInt < 10) return false;
    } else if (identityType === 5){
        if(randomInt < 10) return false;
    } else if (identityType === 6){
        if(randomInt < 10) return false;
    } else {
        if(randomInt < 10) return false;
    }
    return true;
}