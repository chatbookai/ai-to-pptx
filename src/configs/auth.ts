//import os from 'os'

//const hostname = os.hostname();

//console.log('Hostname:', hostname);

export default {
  productName: "ChatBook",
  backEndApiChatBook: "http://localhost:1988",
  meEndpoint: "/auth/me",
  storageTokenKeyName: "ChatBookAccessToken",
  userInfoTokenKeyName: "ChatBookUserToken",
  onTokenExpiration: "ChatBookRefreshToken",
};
