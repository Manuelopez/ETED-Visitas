export const isAuth = async (url) => {
  const token = localStorage.getItem('token');
  try {
    const resposne = await fetch('http://localhost:5000/api/user/isLogged', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
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
