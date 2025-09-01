import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  // Cada vez que se accede a cualquier página:
  // debe configurarse para cada request
  const client = buildClient(appContext.ctx);
  // debe ejecutarse en TODAS las páginas para saber si el usuario está autenticado
  const { data } = await client.get('/api/users/currentuser');
  // 1. AppComponent.getInitialProps() ← SIEMPRE se ejecuta primero
  // 2. Component.getInitialProps() ← Luego se ejecuta (si existe)
  // 3. Se renderiza la página
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    // Inyeccion de dependencias
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;

// Next.js mas reciente
// En lugar de getInitialProps en _app.js
// export function getServerSideProps(context) {
// Solo se ejecuta en páginas específicas
// }

// O middleware para autenticación
// export function middleware(request) {
// Se ejecuta antes de cada request
// }