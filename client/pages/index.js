import buildClient from '../api/build-client'

const LandingPage = ({ email }) => {
  return (
    <div>
      <h1>Landing Page</h1>
      {email ? <p>Welcome, {email}!</p> : <p>You are not signed in.</p>}
    </div>
  )
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)

  try {
    const { data } = await client.get('/api/users/currentuser')
    return data.currentUser
  } catch (err) {
    console.error(err)
  }
}

export default LandingPage
