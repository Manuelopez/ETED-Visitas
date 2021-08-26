export const isAuth = async (url) => {
  const token = localStorage.getItem('token');
  try {
    const resposne = await fetch(
      'https://137.184.75.4:5001/api/user/isLogged',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await resposne.json();
    if (!jsonData.ok) {
      if (
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.pathname = '/';
      }
    } else {
      if (url) {
        window.location.pathname = url;
      }
    }
  } catch {
    console.log('error');
  }
};
