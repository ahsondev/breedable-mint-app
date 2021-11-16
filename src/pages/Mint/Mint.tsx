import { useEffect, useState } from 'react'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'
import queryString from 'query-string'
import api from 'utils/api'
import { encrypt, decrypt, getStorageItem } from 'utils/helper'
import axios from 'axios'

interface Props {}

const Mint = (props: Props) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [twitterLogin, setTwitterLogin] = useState<{
    isLoggedIn: boolean,
    profile: any
  }>({
    isLoggedIn: false,
    profile: {}
  })

  const [discordLogin, setDiscordLogin] = useState({
    isLoggedIn: false
  })

  useEffect(() => {
    ;(async () => {
      const { oauth_token, oauth_verifier, code } = queryString.parse(window.location.search)
      if (code) {
        // Discord oAuth 2.0
        try {
          const {data: profile} = await api.post('/auth/discord/profile', {code})
          setLoggedIn(true)
          setUsername(profile.username)
        } catch (error) {
          console.error(error)
        }
      } else if (oauth_token && oauth_verifier) {
        // Twitter oAuth 1.0
        try {
          // Oauth Step 3
          // Authenticated Resource Access
          const {data: profile} = await api.post('/auth/twitter/profile', {
            oauth_token: getStorageItem('oauth_token', ''),
            oauth_verifier
          })

          setLoggedIn(true)
          setUsername(profile.name)
          console.log(profile)
        } catch (error) {
          console.error(error)
        }
      } else {
        // check if user is included in whitelist
      }
    })()
  }, [])

  return (
    <div className='mint-page'>
      {loggedIn && (<button type='button'>Confirm {username}</button>)}
    </div>
  )
}

export default Mint
