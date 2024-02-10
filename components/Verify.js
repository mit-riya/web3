/* Verify.js */

export function VerifyIdentity(identityType) {
    const randomInt = Math.floor(Math.random() * 100);
  
    // Assuming the probability of returning false is 10% for all identity types
    return randomInt >= 10;
}