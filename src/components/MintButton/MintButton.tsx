import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import api from 'utils/api'
import { encrypt, decrypt, setStorageItem } from 'utils/helper'
import AuthSelectorModal from 'pages/AuthSelectorModal'

import './MintButton.scoped.scss'

interface PropsType {
  disabled?: boolean
  presaleMode?: boolean
  authenticated?: boolean
  onMint?(): void
}

const MintButton = (props: PropsType) => {
  const { disabled, presaleMode, authenticated, onMint } = props
  const [ modalOpened, setModalOpened ] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onDiscordLogin = () => {
    (async () => {
      try {
        const recaptchaStatus = await verifyRecaptcha()
        if (!recaptchaStatus) {
          console.log("Recaptcha Error")
          return
        }

        const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID
        const oauthCallback = process.env.REACT_APP_REDIRECT_AUTH_URL
        window.location.href = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${oauthCallback}`
      } catch (error) {
        console.error(error); 
      }
    })()
  }

  const onTwitterLogin = () => {
    (async () => {
      try {
        const recaptchaStatus = await verifyRecaptcha()
        if (!recaptchaStatus) {
          console.log("Recaptcha Error")
          return
        }

        // OAuth Step 1
        const response = await api.post('/auth/twitter/request_token')
        const { oauth_token } = response.data;
        setStorageItem('oauth_token', encrypt(oauth_token))
        
        // Oauth Step 2
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
      } catch (error) {
        console.error(error); 
      }
    })();
  }

  const verifyRecaptcha = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return null
    }

    try {
      const newToken = await executeRecaptcha('MS_Pyme_DatosEmpresa')
      return newToken
    } catch (err) {
      return null
    }
  }

  const handleMint = () => {
    if (disabled) {
      return
    }

    if (presaleMode) {
      onMint && onMint()
    } else {
      if (authenticated) {
        onMint && onMint()
      } else {
        setModalOpened(true)
      }
    }
  }

  return (
    <div>
      <button onClick={handleMint} type='button' className='mint' disabled={!!disabled}>
        Jack In
      </button>
      {modalOpened && (
        <AuthSelectorModal
          isOpen={modalOpened}
          onTwitter={onTwitterLogin}
          onDiscord={onDiscordLogin}
          onRequestClose={() => setModalOpened(false)}
        />
      )}
    </div>
  )
}

export default MintButton
