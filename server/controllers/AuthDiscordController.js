const axios = require('axios')
const fetch = require('node-fetch')
const btoa = require('btoa')
const config = require('../config')
const oauthCallback = process.env.REDIRECT_AUTH_URL

let tokenAccessCounts = {}

function _encode(obj) {
  let string = "";

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  return string.substring(1);
}

async function getProfile(req, res, next) {
  const creds = btoa(`${process.env.REACT_APP_DISCORD_CLIENT_ID}:${process.env.REACT_APP_DISCORD_CLIENT_SECRET}`)
  const code = req.body.code
  console.log(`${process.env.REACT_APP_DISCORD_CLIENT_ID}:${process.env.REACT_APP_DISCORD_CLIENT_SECRET}`)
  console.log("code: ", code)


  if (tokenAccessCounts[code]) {
    res.status(500).json({message: 'Duplicated code'})
    return
  }

  try {
    console.log(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${oauthCallback}`)
    let data = {
      'client_id': process.env.REACT_APP_DISCORD_CLIENT_ID,
      'client_secret': process.env.REACT_APP_DISCORD_CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': oauthCallback,
      'scope': 'identify'
    }
    const params = _encode(data)
    const response = await fetch(`https://discordapp.com/api/oauth2/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      }
    );
    // const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${oauthCallback}`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Basic ${creds}`,
    //     },
    //   }
    // )

    const json = await response.json();
    console.log("access_token: ", json)
    const access_token = json.access_token
    const response1 = await axios.get("https://discordapp.com/api/users/@me", {
      headers:{
        "authorization":`Bearer ${access_token}`
      }
    })
    res.json(response1.data)
  } catch (error) {
    // console.error(error)
    res.status(500).json(error)
  }
};

module.exports = {
  getProfile,
}
