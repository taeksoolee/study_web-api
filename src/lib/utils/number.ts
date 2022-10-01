const randomNumList: number[] = [];

/**
 * 0이상 max(최대값) 이하의 자연수 중 랜덤값을 반환한다.
 * @param {number} max 
 * @returns 
 */
export const getRandomNumber = (max: number = 10000) => {
  while(true) {
    const randomNum = Math.round(Math.random() * max);

    if(!randomNumList.includes(randomNum)) {
      randomNumList.push(randomNum);
      return randomNum;
    }
  }
}