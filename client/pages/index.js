import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return (
    <div>
      <h1>Landing Page</h1>
      {currentUser ? (
        <p>Welcome, {currentUser.email}!</p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  )
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  let currentUser = null

  try {
    const { data } = await client.get('/api/users/currentuser')
    currentUser = data.currentUser
  } catch (err) {
    console.error(err)
  }

  return { currentUser }
}

export default LandingPage
