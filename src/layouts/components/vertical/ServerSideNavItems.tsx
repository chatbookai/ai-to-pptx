// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'


// ** Config
import { authConfig, defaultConfig } from 'src/configs/auth'
import { useRouter } from 'next/router'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { DecryptDataAES256GCM } from 'src/configs/functions'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])
  const backEndApi = authConfig['indexMenuspath']
  const router = useRouter()

  useEffect(() => {
    const storedToken = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    axios.get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken } }).then(res => {

      let dataJson: any = null
      const data = res.data
      if(data && data.isEncrypted == "1" && data.data)  {
          const AccessKey = window.localStorage.getItem(defaultConfig.storageAccessKeyName)!
          const i = data.data.slice(0, 32);
          const t = data.data.slice(-32);
          const e = data.data.slice(32, -32);
          const k = AccessKey;
          const DecryptDataAES256GCMData = DecryptDataAES256GCM(e, i, t, k)
          try{
              dataJson = JSON.parse(DecryptDataAES256GCMData)
          }
          catch(Error: any) {
              console.log("DecryptDataAES256GCMData view_default Error", Error)

              dataJson = data
          }
      }
      else {

          dataJson = data
      }

      const menuArray = dataJson
      if (menuArray && menuArray.status && menuArray.status == "ERROR" && router.pathname != '/login') {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem(defaultConfig.storageTokenKeyName)
        localStorage.removeItem('GO_SYSTEM')
        console.log("menuArray ERROR", menuArray, router)
        router.push('/login')
      }
      if(menuArray) {
        setMenuItems(menuArray)
      }
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
