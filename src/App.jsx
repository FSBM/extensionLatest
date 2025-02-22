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
            window.close();
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
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
          <div className="w-full max-w-md p-8">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  container: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  },
                  button: {
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      transform: 'translateY(-1px)',
                    }
                  },
                  input: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    width: '100%',
                    marginBottom: '1rem',
                    '&:focus': {
                      borderColor: '#3b82f6',
                      outline: 'none',
                      backgroundColor: '#1d4ed8'
                    }
                  },
                  label: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '0.5rem',
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  },
                  message: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '1rem'
                  }
                }
              }}
              onlyThirdPartyProviders={true}
              providers={['google']}
            />
          </div>
        </div>
      )
    }
    
    else {
      return (<div>Logged in!</div>)
  }
}


export default App
