import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

function App() {

    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
          console.log(session)
          if (session) {
            localStorage.setItem('session', JSON.stringify(session))
            localStorage.setItem('access_token', session.access_token)
            localStorage.setItem('refresh_token', session.refresh_token)
            document.cookie = `access_token=${session.access_token}; path=/; domain=extension-auth.vercel.app; SameSite=Lax`
            document.cookie = `refresh_token=${session.refresh_token}; path=/; domain=extension-auth.vercel.app; SameSite=Lax`
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.remove(tabs[0].id);
            });
          }
        })
      
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          if (session) {
            localStorage.setItem('session', JSON.stringify(session))
            localStorage.setItem('access_token', session.access_token)
            document.cookie = `access_token=${session.access_token}; path=/; domain=extension-auth.vercel.app; SameSite=Lax`
            document.cookie = `refresh_token=${session.refresh_token}; path=/; domain=extension-auth.vercel.app; SameSite=Lax`
          }
        })
      
        return () => subscription.unsubscribe()
      }, [])

    if (!session) {
      return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
      return (<div>Logged in!</div>)
  }
}


export default App
